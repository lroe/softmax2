# Softmax — live explainer preview

A word-synced animated explainer built from `script.txt` and `audio.wav`.
It is authored on a 1920×1080 grid and rendered at **2560×1440 (2K)** minimum.
The primary deliverable is the **localhost preview**. The optional Colab notebook
renders a **2560×1440 MP4** to Google Drive when you need a file.
The production playbook is **`skill_original.md`**.

## Run

```bash
./preview/start.sh
# open http://localhost:4173/
```

The server sends HTTP Range responses so the 57 MB WAV can be scrubbed.

## Controls

- `Space` — play / pause
- `←` / `→` — seek 5 s
- `J` / `L` — seek 10 s
- `B` / `S` — previous / next scene
- `F` — fullscreen
- `M` — mute

## Clean stills

```
http://localhost:4173/preview/?capture=1&t=153&scale=1.333   # 2560×1440
http://localhost:4173/preview/?capture=1&t=153&scale=2       # 3840×2160
```

In capture mode the player chrome is hidden.

## Colab 2K render

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/lroe/softmax2/blob/main/render_2k_colab.ipynb)

The notebook clones this repo at the latest `main`, renders the live canvas at
**2560×1440** with headless Chromium, and writes resumable chunks plus the final
MP4 to **Google Drive**. It asks for Drive permission before writing anything.

- Output: `MyDrive/Softmax2K/softmax-2560x1440.mp4`
- Resume: finished 600-frame chunks are skipped
- Progress: frame count, chunk, speed, and ETA stream live
- `skill.md` / `skill_original.md` are removed from the Colab runtime and are
  never copied to Drive

The renderer is `render/render-2k.mjs`. It drives the existing preview with
Playwright, not a separate video framework.

## What is synced to what

- `align.py` reads the 106 narration paragraphs in `script.txt` and the forced-aligned
  word timings in `words.json`, then writes `preview/js/data/timeline.js`.
- Every scene reveal is keyed with `at('phrase', line)` against the aligned script.
  Re-recording the voiceover and regenerating `words.json` shifts the whole video
  without touching scene code.
- `audio.currentTime` is the master clock. The renderer never counts wall time while
  the audio is playing.

## Structure

```
preview/
  index.html
  style.css
  server.mjs
  start.sh
  public/fonts/          local Space Grotesk + Inter
  js/
    kit.js               drawing primitives
    motifs.js            gate, thought strip, charts, caveats, etc.
    app.js               audio clock, player, capture, draw loop
    data/timeline.js     generated word + line timings
    scenes/              eleven scene files, 78 scenes
```

The background is a single flat `#282A36` fill. There is no grain, dither, noise
texture, radial glow, vignette, circular band, or gradient. The backdrop cache is
baked at the actual output size. Grain and dither were removed because YouTube's
encoder turns low-amplitude noise into moving blocks and banding.

Pictures are drawn as flat vector line art in the kit (`singer`, `deskRobot`,
`silentAgent`, `painting`), so the video has no bitmap dependency. If a generated
picture is supplied later, it can be fitted into the same slots. The picture prompt
rules live in `skill_original.md` §22.

## Verification

- 78 scenes, 0 timeline gaps, end 1194.88 s.
- Full-timeline draw sweep: 0 errors.
- 2K master: 2560×1440 backing store; single flat background, no grain/dither, no circular bands.
- Hook: one softmax curve with adjacent axis labels; no corner-label/bottom-caption scatter.
- Key 2K stills reviewed in `shots/qa/`; the earlier full midpoint pass was used during QA.
- Type: primary labels 30–56 px at 1080p; axis/tertiary 24–28 px; hero 64–250 px.
- Mobile: 16:9 letterboxed player; controls fit at 390×844; landscape gives a readable size.
- QA art: `shots/qa/` (2560×1440 key stills + one 3840×2160 hook still) and `shots/mobile_*.png`.
- Narration only. No music, no SFX.

No MP4 was rendered locally; the optional Colab notebook produces one on Drive.
