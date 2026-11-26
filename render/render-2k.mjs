#!/usr/bin/env node
/**
 * Render the live-canvas Softmax explainer to a 2K MP4.
 *
 * The renderer serves the existing preview, drives window.__drawAt(t) in
 * headless Chromium, writes PNG frames, encodes resumable chunks, and stitches
 * them with the narration WAV.
 *
 * Node emits machine-readable events on stdout:
 *   @@RENDER@@ {"type":"progress", ...}
 * The Colab notebook turns those into a live progress bar.
 */

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (!key.startsWith('--')) continue;
    const name = key.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) out[name] = true;
    else { out[name] = next; i++; }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const int = (v, d) => (v === undefined ? d : Number.parseInt(v, 10));
const num = (v, d) => (v === undefined ? d : Number.parseFloat(v));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const WIDTH = int(args.width, 2560);
const HEIGHT = int(args.height, 1440);
const FPS = num(args.fps, 30);
const CRF = int(args.crf, 18);
const CHUNK_FRAMES = Math.max(30, int(args.chunk, 600));
const REPO_DIR = path.resolve(args.repo || REPO);
const OUTPUT_DIR = path.resolve(args['output-dir'] || path.join(REPO_DIR, 'render-out'));
const WORK_DIR = path.resolve(args['work-dir'] || path.join(os.tmpdir(), 'softmax-render-work'));
const OUTPUT_NAME = args['output-name'] || `softmax-${WIDTH}x${HEIGHT}.mp4`;
const STILL_AT = args.still === undefined ? null : num(args.still, 0);
const STILL_OUT = args['still-out'] ? path.resolve(args['still-out']) : path.join(OUTPUT_DIR, 'stills', 'still.png');
const FORCE = args.force === true;
const STITCH_ONLY = args['stitch-only'] === true;
const KEEP_FRAMES = args['keep-frames'] === true;
const LIMIT_FRAMES = args.limit ? int(args.limit, 0) : null;
const NO_STITCH = args['no-stitch'] === true;

const SCALE = WIDTH / 1920;
const AUDIO = path.join(REPO_DIR, 'audio.wav');
const STATE_PATH = path.join(OUTPUT_DIR, 'render_state.json');
const CONCAT_PATH = path.join(WORK_DIR, 'concat.txt');
const FINAL_LOCAL = path.join(WORK_DIR, OUTPUT_NAME);
const FINAL_DRIVE = path.join(OUTPUT_DIR, OUTPUT_NAME);

if (Math.abs(HEIGHT - 1080 * SCALE) > 0.01) {
  throw new Error(`Keep 16:9: ${WIDTH}x${HEIGHT} does not match 1920x1080.`);
}
if (!fs.existsSync(AUDIO)) throw new Error(`Missing narration: ${AUDIO}`);
if (!fs.existsSync(path.join(REPO_DIR, 'preview', 'server.mjs'))) {
  throw new Error(`Missing preview/server.mjs in ${REPO_DIR}`);
}

function emit(event) {
  process.stdout.write(`@@RENDER@@ ${JSON.stringify(event)}\n`);
}

function log(message) {
  emit({ type: 'log', message });
}

async function run(cmd, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd[0], cmd.slice(1), {
      cwd: opts.cwd,
      env: { ...process.env, ...(opts.env || {}) },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => { out += d.toString(); if (out.length > 20000) out = out.slice(-20000); });
    child.stderr.on('data', (d) => { err += d.toString(); if (err.length > 20000) err = err.slice(-20000); });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ out, err });
      else reject(new Error(`${cmd[0]} exited ${code}\n${err.slice(-4000)}`));
    });
  });
}

async function ensureServer() {
  const port = 4173 + Math.floor(Math.random() * 200);
  const base = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, [path.join(REPO_DIR, 'preview', 'server.mjs')], {
    cwd: REPO_DIR,
    env: { ...process.env, PORT: String(port) },
    stdio: 'ignore',
  });
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(`${base}/preview/`);
      if (r.ok) return { base, server, port };
    } catch {}
    await sleep(100);
  }
  server.kill('SIGTERM');
  throw new Error('Preview server did not start.');
}

function chunkName(i) {
  return `chunk_${String(i).padStart(4, '0')}.mp4`;
}

async function writeJsonAtomic(file, value) {
  const tmp = `${file}.tmp`;
  await fsp.mkdir(path.dirname(file), { recursive: true });
  await fsp.writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`);
  await fsp.rename(tmp, file);
}

function loadState() {
  try {
    const s = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
    if (s.width !== WIDTH || s.height !== HEIGHT || s.fps !== FPS) {
      throw new Error(`State is ${s.width}x${s.height}@${s.fps}; expected ${WIDTH}x${HEIGHT}@${FPS}. Use --force.`);
    }
    return s;
  } catch (e) {
    if (e.code !== 'ENOENT' && !String(e.message).includes('Unexpected')) throw e;
    return null;
  }
}

async function ffprobe(file) {
  const { out } = await run([
    'ffprobe', '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate',
    '-of', 'default=noprint_wrappers=1', file,
  ]);
  return out.trim();
}

async function encodeChunk(dir, nFrames, outFile) {
  await run([
    'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
    '-framerate', String(FPS),
    '-i', path.join(dir, 'frame_%06d.png'),
    '-frames:v', String(nFrames),
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', String(CRF),
    '-tune', 'animation',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outFile,
  ]);
}

async function stitch(state, chunkCount) {
  await fsp.mkdir(WORK_DIR, { recursive: true });
  const lines = [];
  for (let i = 1; i <= chunkCount; i++) {
    const file = path.join(OUTPUT_DIR, 'chunks', chunkName(i));
    if (!fs.existsSync(file)) throw new Error(`Missing chunk ${i}: ${file}`);
    lines.push(`file '${file.replaceAll("'", "'\\''")}'`);
  }
  await fsp.writeFile(CONCAT_PATH, `${lines.join('\n')}\n`);
  log(`Stitching ${chunkCount} chunks + narration...`);
  await run([
    'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'concat', '-safe', '0', '-i', CONCAT_PATH,
    '-i', AUDIO,
    '-c:v', 'copy',
    '-c:a', 'aac', '-b:a', '192k',
    '-shortest', '-movflags', '+faststart',
    FINAL_LOCAL,
  ]);
  await fsp.copyFile(FINAL_LOCAL, FINAL_DRIVE);
  state.final = {
    file: OUTPUT_NAME,
    bytes: (await fsp.stat(FINAL_DRIVE)).size,
    finished: new Date().toISOString(),
  };
  state.updated = new Date().toISOString();
  await writeJsonAtomic(STATE_PATH, state);
  const probe = await ffprobe(FINAL_DRIVE);
  emit({ type: 'final', file: FINAL_DRIVE, bytes: state.final.bytes, probe });
}

async function main() {
  await fsp.mkdir(OUTPUT_DIR, { recursive: true });
  await fsp.mkdir(path.join(OUTPUT_DIR, 'chunks'), { recursive: true });
  await fsp.mkdir(path.join(OUTPUT_DIR, 'stills'), { recursive: true });
  await fsp.mkdir(WORK_DIR, { recursive: true });

  let state = loadState();
  if (STITCH_ONLY) {
    if (!state || !state.final?.chunkCount) throw new Error('No completed render state found. Run the render first.');
    await stitch(state, state.final.chunkCount);
    return;
  }

  const { base, server } = await ensureServer();
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  const shutdown = async () => {
    try { await browser.close(); } catch {}
    try { server.kill('SIGTERM'); } catch {}
  };
  process.on('SIGINT', async () => { await shutdown(); process.exit(130); });
  process.on('SIGTERM', async () => { await shutdown(); process.exit(143); });

  try {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });
    page.setDefaultTimeout(120000);
    const url = `${base}/preview/?capture=1&scale=${SCALE.toFixed(6)}`;
    log(`Loading ${url}`);
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForFunction(() => window.__state && window.__state().ready, null, { timeout: 120000 });
    const meta = await page.evaluate(() => ({
      duration: window.__state().duration,
      width: document.getElementById('stage').width,
      height: document.getElementById('stage').height,
    }));
    if (meta.width !== WIDTH || meta.height !== HEIGHT) {
      throw new Error(`Canvas is ${meta.width}x${meta.height}; expected ${WIDTH}x${HEIGHT}.`);
    }
    log(`Canvas ready: ${meta.width}x${meta.height}, ${meta.duration.toFixed(2)}s`);

    if (STILL_AT !== null) {
      const t = Math.max(0, Math.min(meta.duration - 0.001, STILL_AT));
      const data = await page.evaluate((tt) => {
        window.__drawAt(tt);
        return document.getElementById('stage').toDataURL('image/png');
      }, t);
      await fsp.mkdir(path.dirname(STILL_OUT), { recursive: true });
      await fsp.writeFile(STILL_OUT, Buffer.from(data.split(',')[1], 'base64'));
      emit({ type: 'still', file: STILL_OUT, t, width: meta.width, height: meta.height });
      await shutdown();
      return;
    }

    const totalFrames = Math.min(Math.ceil(meta.duration * FPS), LIMIT_FRAMES || Number.MAX_SAFE_INTEGER);
    const chunkCount = Math.ceil(totalFrames / CHUNK_FRAMES);
    if (!state || FORCE) {
      state = {
        version: 1,
        width: WIDTH, height: HEIGHT, fps: FPS,
        duration: meta.duration,
        totalFrames, chunkFrames: CHUNK_FRAMES, crf: CRF,
        completed: {}, final: null,
        updated: new Date().toISOString(),
      };
      await writeJsonAtomic(STATE_PATH, state);
    }
    state.completed = state.completed || {};
    emit({
      type: 'start',
      width: WIDTH, height: HEIGHT, fps: FPS,
      duration: meta.duration, totalFrames, chunkFrames: CHUNK_FRAMES,
      chunkCount, output: FINAL_DRIVE,
    });

    const overallStart = Date.now();
    let renderedFrames = 0;
    for (let ci = 1; ci <= chunkCount; ci++) {
      const s = (ci - 1) * CHUNK_FRAMES;
      const e = Math.min(totalFrames, s + CHUNK_FRAMES);
      const n = e - s;
      const driveChunk = path.join(OUTPUT_DIR, 'chunks', chunkName(ci));
      const done = state.completed?.[String(ci)];
      if (!FORCE && done && fs.existsSync(driveChunk) && fs.statSync(driveChunk).size > 1024) {
        emit({ type: 'chunk_skip', chunk: ci, chunkCount, frames: n, file: driveChunk });
        renderedFrames += n;
        continue;
      }

      const dir = path.join(WORK_DIR, `frames_${String(ci).padStart(4, '0')}`);
      await fsp.rm(dir, { recursive: true, force: true });
      await fsp.mkdir(dir, { recursive: true });
      emit({ type: 'chunk_start', chunk: ci, chunkCount, startFrame: s, endFrame: e, frames: n });

      const chunkStart = Date.now();
      let lastEmit = 0;
      for (let f = s; f < e; f++) {
        const t = f / FPS;
        const data = await page.evaluate((tt) => {
          window.__drawAt(tt);
          return document.getElementById('stage').toDataURL('image/png');
        }, t);
        const local = path.join(dir, `frame_${String(f - s).padStart(6, '0')}.png`);
        await fsp.writeFile(local, Buffer.from(data.split(',')[1], 'base64'));
        renderedFrames++;
        const now = Date.now();
        if (now - lastEmit > 900 || f === e - 1) {
          const elapsed = (now - overallStart) / 1000;
          const fps = renderedFrames / Math.max(0.001, elapsed);
          const eta = (totalFrames - renderedFrames) / Math.max(0.01, fps);
          emit({
            type: 'progress',
            chunk: ci, chunkCount,
            frame: renderedFrames, totalFrames,
            percent: (renderedFrames / totalFrames) * 100,
            fps: Number(fps.toFixed(2)),
            etaSeconds: Math.round(eta),
            elapsedSeconds: Math.round(elapsed),
            chunkPercent: ((f - s + 1) / n) * 100,
          });
          lastEmit = now;
        }
      }

      const localChunk = path.join(WORK_DIR, chunkName(ci));
      await encodeChunk(dir, n, localChunk);
      await fsp.copyFile(localChunk, driveChunk);
      const bytes = (await fsp.stat(driveChunk)).size;
      const secs = (Date.now() - chunkStart) / 1000;
      state.completed[String(ci)] = {
        file: `chunks/${chunkName(ci)}`,
        frames: n,
        bytes,
        seconds: Number(secs.toFixed(1)),
        finished: new Date().toISOString(),
      };
      state.updated = new Date().toISOString();
      await writeJsonAtomic(STATE_PATH, state);
      emit({ type: 'chunk_done', chunk: ci, chunkCount, file: driveChunk, bytes, seconds: Number(secs.toFixed(1)) });
      if (!KEEP_FRAMES) await fsp.rm(dir, { recursive: true, force: true });
      await fsp.rm(localChunk, { force: true });
    }

    if (NO_STITCH) {
      emit({ type: 'done', chunks: chunkCount, note: '--no-stitch: chunks are ready, final MP4 skipped.' });
      return;
    }
    const finalState = {
      ...state,
      final: { ...(state.final || {}), chunkCount },
    };
    await writeJsonAtomic(STATE_PATH, finalState);
    await stitch(finalState, chunkCount);
  } finally {
    await shutdown();
  }
}

main().catch((err) => {
  emit({ type: 'error', message: String(err?.stack || err) });
  process.exit(1);
});
