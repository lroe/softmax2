# Skill: Live-Canvas Explainer Videos — Dracula Dark
### A complete production playbook for word-synced, minimal, hand-crafted technical explainers — built to be watched on localhost, not rendered to MP4.

This is the "something more" that sits on top of the visual style guide. It covers the look, the timing, the engine, the scene-authoring API, the QA loop, the performance traps, and the content rules that made the Vision Encoder video work.

**Reference build:** `/home/jeevankumar/Videos/vision-encoder/preview`
18:33 · 54 scenes · 1920×1080 · full narration sync · no MP4 render.

If a project already has the older `skill.md`, read it for the Dracula palette and the general MinutePhysics vibe. This file is the production system that actually ships.

---

## 0. What this skill produces

A **16:9, 1920×1080 animated explainer** that plays in a browser from localhost, locked to a supplied voiceover. The default deliverable is the preview itself. Do **not** render a full video unless the user explicitly asks.

The output must feel like a hand-built motion piece, not a slideshow:

- every label lands on the spoken word;
- every scene has a base composition before its first cue;
- diagrams evolve rather than cut from slide to slide;
- the typography is large, quiet, and consistent;
- the palette is Dracula dark, the linework is ink-like, the motion is restrained;
- the viewer always knows where to look;
- the final frame is held long enough to read.

The reference video is the benchmark. If a new video is less clear, less smooth, or less legible than that, it is not done.

---

## 1. Non-negotiables

These are the rules that separate "good enough" from the reference quality.

1. **One fixed master:** 1920×1080. Never design against the browser window. Scale the canvas with CSS; keep the drawing coordinates fixed.
2. **One clock:** `audio.currentTime` is the master clock. The animation follows the audio, not wall time.
3. **Word-level cues:** every reveal uses a phrase from the aligned script, not a guessed percentage through a scene.
4. **No scene titles on canvas:** no top-left heading, no "Part 2", no title + subtitle. The narration is the title. On-canvas text is a label, a value, or a one-line statement.
5. **No blank starts:** at `scene start + 0.4s` the frame must be at least ~20–30% visually occupied, or the previous scene must still be fading. Use ghost scaffolds.
6. **Hold the final state:** 1.5–3.0s minimum after the last reveal; 2.5–3.5s for dense charts, equations, and multi-part diagrams.
7. **One focal zone per beat:** reveal one thing, let it land, then move the eye. Dim the previous focus. Never pop two unrelated corners on the same word.
8. **Two font families, fixed size ramp, no bold-everywhere.** See §8.
9. **No essential text below ~30px at 1080p.** If it does not fit at 30px, cut it or move it to narration.
10. **Horizontal text only.** Never rotate a label. If it does not fit, shorten it.
11. **Measure before placing.** Text overflowing a card or colliding with an icon is a bug, not a style.
12. **Verify visually.** A clean console is not a finished video. Screenshot the beats and look at them.
13. **No invented numbers.** Every value comes from the source. If there is no number, use a relative bar and label it as relative.
14. **No full render by default.** A localhost preview is the deliverable. Stills are captured with query params.

---

## 2. When to use this stack (and when not to)

Use this **Canvas 2D + vanilla ES modules** approach when:

- the deliverable is a localhost preview;
- the video is long (10–30+ minutes) and you want instant seeking;
- you need many bespoke diagrams, not a template;
- you want to iterate visually every few scenes;
- you want no build step, no npm dependency, no render farm;
- you need every frame to be deterministic from a timestamp.

Use **Remotion** instead when:

- the final deliverable is an MP4 at a specific fps;
- you need frame-perfect export and codec control;
- the project already has a Remotion pipeline;
- you need to render on a remote GPU/Colab.

The scene logic in this skill is portable to Remotion later. The live canvas version is faster to author and far better for review.

Do **not** use Rough.js as a dependency for this workflow. It is possible, but the custom kit's `strokePath()` gives enough hand-inked warmth with much less overhead and total control. A 0.4px deterministic wobble + a second faint pass is enough.

---

## 3. Project layout

```
project/
  audio.wav                     # supplied voiceover
  voiceover_narration.txt       # exact script, paragraph lines
  visual_guide.txt              # scene-by-scene visual brief
  skill.md                      # this file
  align.py                      # generates word-level timings
  whisper_words.json            # faster-whisper raw output
  README.md                     # how to run the preview
  preview/
    index.html
    style.css
    server.mjs                  # static server with HTTP Range support
    start.sh
    public/fonts/
      local-fonts.css
      SpaceGrotesk-300_700.woff2
      Inter-300_800.woff2
      Caveat-400_700.woff2      # optional, usually unused
    js/
      kit.js                    # drawing/typography/icon/chart kit
      app.js                    # audio clock, player, render loop, capture
      data/timeline.js          # generated lines + words + at()/start()/end()
      scenes/
        index.js                # concatenates all scene arrays
        one_intro.js
        two_recipes.js
        ...
```

**Recommended file split:** 5–10 scenes per file, grouped by act. Do not put 54 scenes in one 6,000-line file. The reference build has 11 scene files for 54 scenes.

Start every new project by copying the `preview/` engine, then rewrite:

- `js/data/timeline.js`
- `js/scenes/*.js`
- `README.md`
- the audio and the source docs

Leave `kit.js`, `app.js`, `style.css`, `server.mjs` mostly alone unless the visual system genuinely needs a new primitive.

---

## 4. The workflow at a glance

Six passes. Do not skip pass 6.

1. **Intake** — read the narration, visual guide, paper/source, and audio. Build a numbers ledger and a through-line motif.
2. **Transcribe + align** — faster-whisper word timestamps, aligned to the known script. Generate `timeline.js`.
3. **Scene map** — break narration into scenes and beats, with holds and transitions. This is the storyboard.
4. **Engine** — build the player, the kit, the font loading, the background cache.
5. **Author scenes** — in batches of 3–5 scenes. Screenshot each batch. Fix layout before moving on.
6. **QA** — stills at every scene midpoint, empty-start check, full-timeline error sweep, audio/seeking test, frame-time check, mobile check, timeline-gap check.

The order matters. Do not author 54 scenes and then discover the player drifts, the audio seeks badly, or the type overflows.

---

## 5. Intake: what to extract before drawing anything

### 5.1 Read all four inputs

- **Narration script:** the exact spoken text. This is the source of truth for phrasing, numbers, and cue words. Do not paraphrase it on screen.
- **Visual guide:** per-cue visual briefs. Treat it as a storyboard, not a script.
- **Paper/source:** exact numbers, table values, test names, and the citation. Cross-check every on-screen value.
- **Audio:** duration, sample rate, loudness, and whether there are pauses. The whisper alignment will absorb most of this, but know the runtime.

### 5.2 Build a numbers ledger

Before writing scenes, create a compact list like:

| Claim | Exact value | Where it appears |
|---|---:|---|
| SigLIP 2 pretraining | 40B image–text pairs | hook |
| Image tokens spent | ~10T | hook, cost |
| Test 1 tie | 7.4% / 15% of budget | test 1 chart |
| Image score | 44.4 vs 39.0 | test 2 results |
| Text + charts | 38.2 vs 25.2 | test 2 results |
| Floor placements | 39.4 / 37.6 / 35.1 / 45.0 | test 3 result |

Rules:

- **Exact values** for any number the narration says.
- **Relative bars** only when no number is given; do not invent a y-axis value.
- If the source says "trillions", do not turn it into "10T" unless the source supports it.
- Cite the paper at the end: `arXiv 2611.17334 · Unbundling Multimodal Vision Encoding`.

### 5.3 Choose the through-line motif

Every strong explainer has one object the viewer learns to recognize and then tracks through the whole video.

In the reference build:

- a **bicycle photo** → sliced into patches → a patch → a vector → image tokens;
- a **glowing vision-encoder module** → the specialist → the desk → the room → in-fusion;
- **three gift icons** (brain, desk, room) reused in the table, tests, and results.

Pick the motif before the scene map. Reuse it in the hook, the explainer, the tests, and the close. Do not introduce a new visual language in every part.

### 5.4 Assign semantic colors once

Do not choose colors scene by scene. Choose them in intake and never change them:

| Concept | Color |
|---|---|
| Pretrained encoder / vision | Dracula Cyan `#8BE9FD` |
| From-scratch encoder | Dracula Green `#50FA7B` |
| Encoder-free | Dracula Orange `#FFB86C` |
| In-fusion / placement | Dracula Purple `#BD93F9` |
| Loss, waste, wrong | Dracula Red `#FF5555` |
| Question, guess, attention | Dracula Yellow `#F1FA8C` |
| Neutral / shared / text | `#F8F8F2` / `#B8B9C5` |
| Recessed wells / screens | `#1E1F29` |

Support accents (pink, deep blue) are for rare secondary detail, never for a main semantic.

---

## 6. Timing: whisper + the known script

Never eyeball timings. Never rely on "roughly 150 wpm". The difference between a good explainer and a great one is whether the label appears on the syllable.

### 6.1 Transcribe with faster-whisper

```bash
/home/jeevankumar/.venvs/whisper/bin/python - <<'PY'
from faster_whisper import WhisperModel
import json, time
model = WhisperModel("small.en", device="cpu", compute_type="int8",
                     cpu_threads=4, local_files_only=True)
segments, info = model.transcribe(
    "audio.wav", beam_size=1, word_timestamps=True,
    condition_on_previous_text=False,
)
words, segs = [], []
for s in segments:
    seg = {"start": s.start, "end": s.end, "text": s.text.strip(), "words": []}
    for w in (s.words or []):
        if w.word.strip():
            d = {"w": w.word.strip(), "start": w.start, "end": w.end}
            seg["words"].append(d); words.append(d)
    segs.append(seg)
json.dump({"segments": segs, "words": words, "dur": info.duration},
          open("whisper_words.json", "w"), indent=1)
PY
```

`small.en` is enough for timing when the script is known. If the project has unusual names, technical terms, or accents, use `large-v3` or align against the script more aggressively.

### 6.2 Align whisper words to the script

Whisper will drop words, merge numbers, and spell "SigLIP 2" as "siglip2". Do not use raw whisper text as your cue vocabulary. Align whisper to the **known narration**.

The reference `align.py` does this:

1. Read non-empty narration lines. They are paragraphs, not sentences.
2. Normalize both sides:
   - lowercase;
   - apostrophes preserved;
   - digits → words (`14` → `fourteen`, `224` → `two hundred twenty four`);
   - special map: `siglip2` → `siglip two`, `nyu` → `n y u`, `metaclip` → `meta clip`, `webssl` → `web s s l`, `in-fusion` → `in fusion`, `vqa` → `v q a`;
   - punctuation stripped.
3. Run `difflib.SequenceMatcher` on script words vs whisper words.
4. Copy exact start/end times for matched words.
5. Interpolate unmatched runs proportionally between the nearest anchors.
6. Group times back into narration lines.
7. Emit `preview/js/data/timeline.js`.

A good alignment is **≥0.95 similarity** for clean TTS. Below 0.90, inspect before authoring.

### 6.3 The generated data format

```js
export const LINES = [
  { n: 1, text: "...", start: 0.000, end: 5.760,
    words: [{ w: "there's", s: 0.000, e: 0.440 }, ...] },
  ...
];

export const WORD_ROWS = LINES.flatMap(l =>
  l.words.map(w => ({ ...w, line: l.n }))
);

export const DURATION = 1113.6;

export function line(n) { ... }
export function start(n) { ... }
export function end(n) { ... }

// Find a phrase in the aligned script. Returns the start of its first word.
export function at(phrase, fromLine = 0, occurrence = 1) { ... }
export function atEnd(phrase, fromLine = 0, occurrence = 1) { ... }
```

`at()` is the most important authoring tool in the project. It lets a scene say:

```js
const q = {
  called: at('called the vision encoder', 2),
  siglip: at('siglip two', 2),
  ten: at('ten trillion', 2),
  models: at('two hundred models', 3),
};
```

…and the visual lands on the spoken word, even if the audio is re-recorded later and the times shift. The scene code becomes self-documenting.

**Disambiguation rules:**

- Use `fromLine` to pick the first occurrence after a given paragraph.
- Use `occurrence` for repeated phrases ("line of vectors" appears twice in one paragraph).
- If a phrase is not found, print the candidate words and use a shorter phrase. Do not invent a time.
- If the aligner collapses two cues (e.g. "a tie" and "sixty percent" can land on the same word), offset the second cue manually by a documented 0.8–1.5s and note why.
- Hardcode a time only when a phrase genuinely does not exist in the script. Keep those times in one visible place in the scene file.

### 6.4 Scene boundaries

Scene boundaries come from narration line starts, not from visual taste:

```js
{ start: start(12), end: start(14) }
```

The renderer treats `end` as the next scene's start. This gives a continuous timeline with no gaps. A small negative lead (`start(12) - 0.25`) is acceptable if the first visual needs to pre-roll, but the previous scene's end must match. The reference build uses exact line starts and a 0.24s crossfade.

Check the timeline programmatically:

```bash
node --input-type=module -e "
import scenes from './js/scenes/index.js';
const s = scenes.sort((a,b)=>a.start-b.start);
let prev = 0, gaps = 0;
for (const sc of s) {
  if (Math.abs(sc.start - prev) > 0.02) { console.log('GAP', prev, sc.start, sc.id); gaps++; }
  prev = sc.end;
}
console.log('scenes', s.length, 'gaps', gaps, 'end', prev);
"
```

---

## 7. The scene map

Write the scene map before writing scene code. It is a table, not prose.

| # | Start | End | Narration cue | Visual | On-screen text | Hold |
|---|---:|---:|---|---|---|---:|
| 1 | 0.0 | 27.0 | "There's a part…" | photo → patch grid → chip → 10T → 200 dots | vision encoder · 10 trillion | 1.5s |
| 2 | 27.0 | 43.3 | "Say you want…" | three test cards → pipeline → default | the default | 1.2s |
| ... | | | | | | |

Rules for the map:

- **Scene length:** 10–40s typical; 45s only if the diagram keeps evolving. If a paragraph would make a <6s scene, merge it with a neighbor. If a scene exceeds ~45s, split at a natural pause.
- **Beat length:** 3–7s. A 30s scene has 4–7 micro-beats. Do not hold one static composition for 30s.
- **One idea per scene.** The scene can have several beats, but they must all serve the same idea.
- **The visual guide is a brief, not a shot list.** Combine cues where the same diagram can evolve. A new diagram every 5s feels like a slideshow.
- **Every scene needs a hold.** Mark it explicitly.
- **Every scene needs a base state at t=0.** If the first real cue is 3s in, add a ghost scaffold or a context strip.

---

## 8. Typography: the actual rule

This is the part that made the reference feel expensive. It is not "a nice font". It is a system.

### 8.1 Families

- **Space Grotesk** for everything that carries the idea: headlines, labels, values, chart numbers, card titles.
- **Inter** for small supporting copy: explanations, axis labels, citations, secondary card text.
- **Caveat** is optional. It was downloaded for the reference but **not used**. The hand-drawn feeling came from the linework and grain. A handwriting font can make a technical piece feel cute rather than crisp. Use it only for a deliberate annotation or a children's explainer.

Load both as local `.woff2` files. No Google Fonts network dependency during playback.

```css
@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 300 700;
  font-display: block;
  src: url('./SpaceGrotesk-300_700.woff2') format('woff2');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 800;
  font-display: block;
  src: url('./Inter-300_800.woff2') format('woff2');
}
```

Wait for `document.fonts.ready` before the first draw. Otherwise the first still is in a fallback font and every measurement is wrong.

### 8.2 The 1080p ramp

| Role | Size | Weight | Tracking | Color |
|---|---:|---:|---:|---|
| Hero number | 150–185px | 500 | −5 to −7px | `#F8F8F2` |
| Big statement | 48–72px | 450–500 | −1px | `#F8F8F2` |
| Primary label | 36–42px | 450–500 | 0 | `#F8F8F2` |
| Standard label | 30–36px | 450–500 | 0 | `#F8F8F2` |
| Secondary | 28–30px | 400 | 0 | `#B8B9C5` |
| Axis / tertiary | 24–28px | 400 | +0.2px | `#7E8194` |
| Player chrome | CSS `clamp()` | 500 | +0.06em | separate |

**The working floor:** no essential text below ~30px at 1080p. If a label must be smaller than 30px to fit, the label is wrong. Cut it, shorten it, or move the detail to narration. The older visual guide says 36px; treat 36px as the target for primary labels and 30px as the absolute floor for essential content. Axis ticks, floor numbers, and credits may go to 24–28px.

**Why this reads as premium:**

- almost everything is weight 450–500; nothing is bold-everywhere;
- the hero numbers are large, not heavy;
- the hierarchy comes from scale and color, not from font styles;
- tracking is tight on large numerals and neutral on labels;
- there is no synthetic bold, no faux italic, no outline, no letterpress.

### 8.3 Word density

- **1–5 words per callout.** A label is not a sentence.
- **No narration transcription.** The voiceover carries the sentence; the screen carries the noun, the number, or the relationship.
- **No paragraphs** except a deliberate one-line statement.
- **Two lines maximum.** If it needs three, it is a paragraph and belongs in the voiceover.
- **Sentence case.** All-caps is reserved for the player chrome.
- **No top-left heading.** The narration is the heading. A content statement ("encoder-free lost", "early, or nothing") is allowed when it is the actual insight, but do not add a redundant scene title above it.

### 8.4 Contrast and color

- Primary text: `#F8F8F2`.
- Secondary text: `#B8B9C5`.
- Tertiary text: `#7E8194`.
- Never use Dracula comment `#6272A4` for text; it disappears on projectors and phones.
- Accent colors are functional, not decorative. If a label is cyan, cyan means "pretrained/vision" in that video. If it is green, green means "from scratch/good".
- Do not put body text in an accent color. Accent is for the label, number, underline, or mark.

### 8.5 Placement

- Horizontal text only. No rotated labels, no vertical axes.
- Text sits adjacent to its visual anchor, connected by a thin leader line when needed.
- Text never overlaps a filled bar, an icon, or another label. Measure, then place.
- Keep a 150–240px safe margin at 1080p.
- If a label would collide, shorten the label before shrinking it.

### 8.6 The one-line rule

> Pick two fonts. Build a five-step size ramp. If a label needs to be smaller than 30px to fit, delete the label — not the font size.

---

## 9. The engine

### 9.1 Server

`preview/server.mjs` is a tiny static server with **HTTP Range** support. Range support is required for audio seeking in a browser. Python's `http.server` is not enough for a large WAV.

```js
// Minimal shape:
const range = req.headers.range;
if (range) {
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  // send 206 with Content-Range and a read stream
}
```

It serves the project root so `/audio.wav` and `/preview/...` both work. The page uses `new Audio('../audio.wav')` from `/preview/`.

### 9.2 Canvas sizing

```js
const W = 1920, H = 1080;
const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
canvas.width  = Math.round(W * dpr);
canvas.height = Math.round(H * dpr);
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
```

- Design in 1920×1080 coordinates.
- Render at `dpr` up to 1.5 for crispness without melting the GPU.
- CSS scales the canvas to the shell.
- For stills: `?scale=2` forces a 3840×2160 canvas.

### 9.3 The audio clock

`audio.currentTime` is the playhead while playing. Do not count rAF deltas for sync — they drift against the audio.

```js
if (!userSeek) {
  if (!audio.paused && audio.readyState >= 2) playhead = audio.currentTime;
  else playhead += dt; // fallback before metadata
}
```

On seek:

```js
playhead = t;
audio.currentTime = t;
draw(t);
```

The app should expose debug hooks:

```js
window.__seek = (t) => { pause(); seek(t); };
window.__state = () => ({ playhead, duration, playing, ready, scenes: ordered.length });
window.__drawAt = (t) => draw(t);
window.__audio = audio; // for QA only
```

### 9.4 The render loop

```js
function frame(now) {
  if (playing) { /* update playhead from audio.currentTime */ }
  if (playing || dirty) { draw(playhead); dirty = false; }
  if (playing || now - lastUI > 120) { updateUI(); lastUI = now; }
  requestAnimationFrame(frame);
}
```

- Draw every frame while playing.
- When paused, draw only when `dirty` (seek, resize, fullscreen, boot).
- Update DOM UI at ~8 Hz, not 60 Hz. `scrub.value`, CSS custom properties, and `textContent` every frame are expensive.
- Do not call a full-screen `createRadialGradient` or `createPattern` every frame. Cache the backdrop.
- Avoid `ctx.filter`, large `shadowBlur`, and thousands of text calls. The reference draw is <1ms JS per frame.

### 9.5 Backdrop cache

The background is static: base color, a subtle radial glow, grain, and a vignette. Bake it once into an offscreen 1920×1080 canvas and `drawImage` it per frame.

```js
let bgCache = null;
function buildBg() {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
  // glow, grain pattern, vignette
  bgCache = c;
}
export function backdrop(ctx) {
  if (!bgCache) buildBg();
  ctx.drawImage(bgCache, 0, 0, W, H);
}
```

Baking the vignette behind the scenes is intentional. It keeps the edges dark without darkening the text and saves a full-screen gradient every frame.

### 9.6 Transitions

A crossfade through the Dracula background, **0.20–0.26s** (6–8 frames at 30fps):

```js
const fade = 0.24;
if (prev && t - scene.start < fade) {
  const q = easeInOut((t - scene.start) / fade);
  ctx.globalAlpha = 1 - q;
  prev.draw(ctx, prev.end - 0.001, ...);
  ctx.globalAlpha = q;
  scene.draw(ctx, t, ...);
}
```

- Draw the outgoing scene at its **last** state, not at the current time, to avoid it evolving during the fade.
- No wipes, no flashy zooms, no rotations.
- Do not expose an empty background for more than ~0.2s.

### 9.7 Capture mode

The preview must support clean stills for QA and review:

```
?capture=1&t=153&scale=2
```

- Hide the player chrome and poster.
- Render at the requested `t` with no audio.
- Keep the canvas at 16:9.

This is the main review surface. Every few scenes, capture 3–5 stills and look at them.

---

## 10. The kit

`preview/js/kit.js` is the reusable visual language. Keep it stable; add primitives only when a new video genuinely needs one.

### 10.1 Palette

```js
export const C = {
  bg: '#282A36',
  fg: '#F8F8F2',
  muted: '#B8B9C5',
  dim: '#7E8194',
  surface: '#313342',
  surface2: '#3A3D4E',
  well: '#1E1F29',
  current: '#44475A',
  red: '#FF5555',
  green: '#50FA7B',
  pink: '#FF79C6',
  purple: '#BD93F9',
  cyan: '#8BE9FD',
  orange: '#FFB86C',
  yellow: '#F1FA8C',
};
```

### 10.2 Typography helpers

```js
export function text(ctx, str, x, y, {
  size = 44, weight = 500, family = F.display, color = C.fg,
  align = 'left', baseline = 'alphabetic', alpha = 1, ls = 0, maxWidth,
} = {}) { ... }
```

- `setFont` builds `ctx.font = weight size family`.
- `ctx.letterSpacing` is used when supported; reset it after each text call.
- `text` saves/restores the context and multiplies `globalAlpha`.
- `wrap`/`paragraph` exist for the rare body-copy moment. Use them sparingly.

### 10.3 Lines and arrows

`strokePath(ctx, points, { color, width, progress, rough, alpha, dash })`:

- deterministic 0.5–1.0px wobble for an inked feel;
- supports partial drawing via `progress` (draw-on effect);
- supports fill and dash;
- always `round` caps and joins.

`arrow()` is a quadratic arrow with a progress value. **Return early when `progress <= 0.001`** — otherwise a zero-length path with a round cap renders as a stray dot.

### 10.4 Cards, pills, chips

```js
card(ctx, x, y, w, h, {
  fill: C.surface, stroke: 'rgba(248,248,242,0.13)',
  r: 18, lw: 1.6, accent: C.cyan, accentW: 3,
  alpha, dash, rot, glow,
});
```

- Fill `#313342`, hover/active `#44475A`, recessed `#1E1F29`.
- Radius 14–24px.
- 1.5–2px border at `rgba(248,248,242,0.12–0.18)`.
- Accent is a 3px top bar or a left rule, not a colored card fill.
- Use `glow` sparingly (one active module), never as a general drop shadow.

`pill(ctx, x, y, label, { size, color, bg, padX, padY, align })` returns `{w,h,x,y}` so you can place the next element relative to it.

`numberedChip` for 1/2/3/4 test numbers.

### 10.5 Icons

A line-art icon library at a 100×100 normalized size:

`eye, image, grid, text, brain, desk, room, layers, stack, person, people, chip, lock, check, cross, clock, bolt, target, scale, flask, tag, edge, curve, search`.

Draw them at 70–160px for a hero moment, 44–70px for a card. Labels inside diagrams may be 28–30px. If an icon overlaps the text, remove the icon; the text is more important.

### 10.6 Photo motif

`drawPhoto(ctx, x, y, size, opts)` renders a warm dusk bicycle illustration:

- gradient sky, sun, mountains, ground, a simple white bicycle;
- optional 16×16 grid with dark slice lanes;
- optional patch highlight;
- optional dim.

This one image is the through-line for the vision part. It appears in the hook, the patch explainer, the embedding, and the “why early” recap. Reuse it; do not draw a different photo each time.

Slice lanes are **dark lines**, not filled intersection dots. Fill the lanes with `C.bg` at 2–4px. Filling the gaps as squares makes the image look like polka dots.

### 10.7 Vector strips

`vectorStrip(ctx, x, y, w, h, { color, seed, cells, gap, alpha })` draws a narrow heat-map strip: a token embedding as a list of numbers.

`vectorRow(...)` tiles them. Use for:

- text tokens (cyan),
- image tokens (purple),
- “a list of numbers”,
- input/output streams in architecture diagrams.

Do not draw a vector as a bar chart. A bar chart says “quantity”; a strip of cells says “a list of numbers”.

### 10.8 Charts

For a comparison, use **direct labels**, not a legend:

- horizontal bars with the label on the left, value at the bar end;
- a dashed reference line for the baseline, labeled directly at the top or end;
- values in 34–38px, labels 30–32px;
- no y-axis ticks unless the scale matters;
- one accent color for the highlighted series, muted grey for context.

For a line chart:

- label the axes in 28–30px;
- put the series label at the end of the line, not in a separate legend;
- use a dashed reference line for “from scratch”;
- animate points and lines together;
- do not fabricate intermediate values.

For a stacked bar:

- label the segments inside the bar when they are wide enough;
- use a 26–28px label only if the bar segment can hold it; otherwise use a legend under the bar;
- total line in `#F8F8F2`;
- all recipes must visibly reach the same total.

### 10.9 Equation

The in-fusion equation is a custom sequence, not an image:

```
h′ = h + F(h) + m · dF(h)
```

- size 60–76px;
- `F` cyan, `dF` green, `m` yellow;
- labels below: “F shared FFN”, “dF vision-only”, “m 1 image · 0 text”;
- an animated switch for `m` shows 1/0;
- no underbraces unless you measure them; a three-chip legend is clearer.

### 10.10 Grain and vignette

- Grain: 360×360 noise tile, alpha ~0.22, baked into the background.
- Vignette: a subtle radial darkening, baked behind the content.
- No gradients in UI shapes. The only gradients are the photo sky and the very subtle backdrop.

---

## 11. Scene authoring

### 11.1 Scene object

```js
export default {
  id: 't3-floors',
  title: 'Where does the desk go?', // player chapter label only, not drawn
  start: 839.34,
  end: 854.86,
  draw(ctx, t, u, scene) {
    // t = absolute seconds; u = t - scene.start
  },
};
```

`start`/`end` come from `start(n)` / `end(n)` in the timeline. The renderer can derive `end` from the next scene, but explicit is better for the map.

### 11.2 Build each scene in layers

This order prevents the “empty then crowded” failure mode:

1. **Base** — ghost card outlines, card frames, a faint track, a title statement that is part of the content. This is visible at t=0.
2. **Primary object** — draw/fade the main diagram at its cue.
3. **Labels** — reveal each label at the noun that introduces it.
4. **Connectors** — arrows, leader lines, brackets, underlines.
5. **Emphasis** — dim the previous focus, glow the current, count a number.
6. **Hold** — do not add a new element in the last 1.5–3s.

### 11.3 Motion vocabulary

- **Enter:** opacity 0→1 + 8–18px rise + scale 0.985→1 over 0.45–0.65s, spring-ish.
- **Draw-on:** `progress` on `strokePath` / `arrow` over 0.4–0.8s.
- **Number count:** 0→value over 0.7–1.2s; do not count every digit for huge numbers, just animate the value and size.
- **Bar grow:** width/height from 0 to value over 0.6–0.9s.
- **Morph/move:** interpolate position/scale with `easeInOut` over 0.8–1.2s.
- **Dim:** alpha 1→0.35–0.55 over 0.4s when the focus moves.
- **No typewriter text. No blur-in. No 3D flips. No bouncing logos.**

### 11.4 Ghost scaffolds

If the first real cue is more than ~0.5s after the scene start, draw the final layout at 10–20% alpha with dashed borders, then fill it at the cue. Examples:

- four empty recipe cards before the four methods;
- three empty gift cards before the three gifts;
- a ghost 256-token grid before the tokens appear;
- a ghost bar track before the bars;
- a ghost timeline before the stages.

This is the single biggest fix for “the scene starts empty”.

### 11.5 One focal zone

- If two things must be compared, reveal one, hold 0.8–1.0s, then reveal the other, then connect them.
- Dim the first when the second arrives.
- Never put two unrelated new labels in opposite corners on the same cue.
- If a composition has more than one active focus, remove one item.

### 11.6 Holds

- Final reveal of a normal scene: **≥1.5s**.
- Dense chart/equation/multi-part scene: **2.5–3.5s**.
- Do not cut on the same word that completes the diagram.
- If the last narration line is a hand-off (“let’s run the numbers”), move it to the next scene.
- A 30s scene must have a reason to be 30s: at least 4 beats and an evolving diagram. Otherwise split it.

### 11.7 Scene archetypes

Use these as starting points; adapt the geometry to the content.

**A. Hook / hero object**
- full-bleed photo or module;
- a slow camera push-in from frame 1 (1.00 → 1.05 over ~6s);
- autofocus brackets snap in at 0.1–0.3s and lock onto the subject on the word “see”;
- one quiet scan line sweeps the subject once;
- one label with a leader;
- a big number that takes over;
- a dot field for “200 models”;
- three numbered chips for the roadmap.

**Never open on a static hero.** The first 6 seconds decide whether the viewer stays. The photo can be still for the poster frame, but once play begins there must be motion within ~0.25s: a push-in, a focus rack, a scan, a highlight, or a slow drift. A 4px sine drift is not enough. If the narration takes 3s to reach the first noun, add a camera move and a focus/scan motif to carry it.

**B. Pipeline**
- 3–4 boxes: input → transform → model → output;
- arrows between;
- labels 34–38px;
- the active box gets an accent top bar;
- a dashed “trained together” loop if the story needs it;
- the answer bubble is a real output, not a title.

**C. Recipe cards**
- 2–4 cards in a row, each 380–500×380–470;
- mini diagram inside;
- title 36–40px, caption 30–32px;
- color-coded but not filled with color;
- the ghost shells are visible before the names.

**D. Confounds / fairness**
- three columns of dials/sliders at different values;
- red bracket “everything differs”;
- a snap-to-equal animation;
- a single highlighted “one thing changed” dial.

**E. Budget / lifetime compute**
- a stacked bar with three segments;
- total line at the end;
- three recipe bars beneath, all the same total;
- a dashed scratch/encoder reference line;
- direct labels, no legend.

**F. Exam / scoring**
- 2×2 group cards with four dots each;
- a big “average VQA” card with one number;
- a 12-dot language strip;
- instruction-tuning card above.

**G. Test result**
- two or three grouped bars;
- direct values above the bars;
- a dashed reference line;
- a single statement at the top (“encoder-free lost”);
- one accent color for the winner.

**H. Placement / floors**
- 28-row building at left, floor 1 at the bottom;
- four option cards at right, each a 28-row strip with highlighted floors;
- a countdown ring for “pause and guess”;
- results as horizontal bars with reference lines.

**I. Equation / mechanism**
- a layer card with shared FFN and extra vision-only FFN;
- tokens entering, text skipping, image going through both;
- the equation below;
- a switch for `m`;
- a “starts at zero” note.

**J. Close**
- a single statement that lands the thesis;
- a MoE/router diagram for the tease;
- a clean “next video” card;
- the arXiv citation at the bottom.

### 11.8 The first six seconds

This is a separate retention problem from the rest of the video. Treat it as its own shot.

- **Poster frame:** the photo may be static while the play button is visible.
- **On play:** the camera starts a 5–6% push-in immediately.
- **0.1–0.3s:** focus brackets snap in around the subject.
- **0.7–1.9s:** one low-alpha scan line crosses the subject; do not loop it.
- **2.5s:** the brackets contract onto the one patch/detail that the narration will call “the part”.
- **3.1s:** the grid/slice/highlight begins.
- **6s:** the first big reveal (a module, a number, a transformation).

The point is not decoration. The focus/scan motif says “something is looking” before the narration names the vision encoder. It also gives the eye a reason to stay.

If the first noun arrives after 3s and the only motion is a 4px drift, the shot is too static. Add one of:

- a slow push-in;
- a focus rack;
- a single scan pass;
- a highlighted detail that appears and pulses once;
- a subtle object transformation that starts before the noun.

Do **not** add a title, a logo animation, or a fast zoom. The hook should feel like a camera finding something, not a YouTube intro.

### 11.9 Scene template

```js
import { C, text, card, pill, icon, p, enter, line, arrow, bracket, clamp } from '../kit.js';
import { at, start, end } from '../data/timeline.js';

const q = {
  first: at('first phrase', 12),
  second: at('second phrase', 12),
  reveal: at('third phrase', 12),
};

export default {
  id: 'scene-id',
  title: 'Player chapter only',
  start: start(12),
  end: start(14),
  draw(ctx, t) {
    const a = p(t, q.first - 0.2, 0.6);
    const b = p(t, q.second - 0.2, 0.6);

    // 0. base scaffold (always visible)
    card(ctx, 600, 300, 700, 400, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 20, alpha: 0.35,
    });

    // 1. primary object
    if (a > 0) {
      ctx.save();
      ctx.globalAlpha = a;
      // draw the object
      ctx.restore();
    }

    // 2. labels
    text(ctx, 'a short label', 640, 380, { size: 36, alpha: a });

    // 3. connectors
    arrow(ctx, 500, 400, 580, 400, {
      color: C.muted, width: 2.6, progress: p(t, q.second, 0.5), head: 10,
    });

    // 4. emphasis / hold
    if (t > q.reveal) {
      text(ctx, 'the insight', 960, 780, {
        size: 40, color: C.green, align: 'center', alpha: p(t, q.reveal, 0.5),
      });
    }
  },
};
```

---

## 12. Visual language: the look

### 12.1 Composition

- 60–80% negative space. The frame is a stage, not a dashboard.
- One focal zone per beat. The eye should never search.
- Content stays inside 150–240px margins.
- Keep the vertical rhythm: one hero band, one support band, one caption band. Do not scatter.
- A 1080p frame can hold one big idea and three small labels. That is the budget.

### 12.2 Linework

- 3–4px for diagrams; 1.5–2px for cards and axes.
- Round caps and joins.
- A deterministic 0.4–0.8px wobble on illustration strokes; no wobble on chart axes.
- No double outlines, no sketchy scribbles. The reference is “inked”, not “messy”.
- Use a faint second pass on underlines and brackets for a hand-made feel.

### 12.3 Surfaces

- Card: `#313342`, border `rgba(248,248,242,0.13)`, radius 16–22.
- Active card: `#44475A` or a brighter accent border.
- Recessed well: `#1E1F29`.
- No drop shadows. A single small `glow` on an active module is allowed.
- No gradients in cards, pills, bars, or text.

### 12.4 The accent rule

Accent colors are **semantic**, not decorative.

- cyan = pretrained/vision
- green = from-scratch/good/winner
- orange = encoder-free/risk
- purple = in-fusion/placement
- red = loss/waste/wrong
- yellow = question/guess/attention

Use one accent per scene unless the scene is explicitly comparing two things. If everything glows, nothing does.

### 12.5 Charts

- Direct labels beat legends.
- Label the value at the bar end, not inside a tooltip.
- A dashed reference line is stronger than a second axis.
- Animate the bars/points from zero, not from a random midpoint.
- If the axis has no meaningful numeric ticks, remove the ticks; do not invent them.
- If a value is approximate, write “≈” or use a relative bar and say so.

### 12.6 Icons

- Icons are 100×100 line art, scaled to 44–160px.
- One icon per card is enough.
- Do not put an icon behind text. If space is tight, remove the icon.
- The three gift icons (brain, desk, room) are a motif. Reuse them in the table, the tests, and the close.
- The eye module is the vision-encoder motif. Reuse it.

### 12.7 Photos

- The bicycle photo is the only “photographic” element. It is a drawn illustration, not a stock image.
- Use a warm dusk palette inside the photo, so it pops against the cold Dracula background.
- Slice with dark lanes; highlight one patch; zoom a patch; turn it into tokens. The transformation is the explainer.

---

## 13. Content and accuracy

### 13.1 Exactness

- Every number on screen must trace to the source.
- The narration's words and the source's numbers can differ in precision; use the source for the visual value and label it.
- Do not round 44.4 to 44 or 39.0 to 39 if the source gives one decimal.
- If the source gives a range, use a range or a relative bar.
- If a comparison is described qualitatively ("ties", "falls behind"), use relative bars and label them "tie"/"behind"; do not invent a value.

### 13.2 Jargon

- The first time a term appears, show it as a label next to the object.
- Do not stack three new terms on one frame; let the narration introduce them one at a time.
- If a term needs a definition, put the definition in the voiceover, not on screen.

### 13.3 The through-line

- Reuse the same icon and color for the same concept for the entire video.
- Reuse the same diagram and evolve it.
- Reuse the same photo motif.
- Do not introduce a new visual language in Part 5 because you are bored.

### 13.4 The ending

- Land the thesis in one line.
- Tease the next video with a simple diagram, not a fake thumbnail.
- Cite the paper: `arXiv 2611.17334 · Unbundling Multimodal Vision Encoding`.
- Keep the final frame for 5+ seconds.

---

## 14. QA protocol

This is the part most people skip. Do not skip it.

### 14.1 Stills at every scene midpoint

Use Playwright/Chromium at 1920×1080, `deviceScaleFactor: 2`, `?capture=1&t=…&scale=2`.

- 3–5 stills per batch while authoring.
- At least one still at every scene midpoint in the final pass.
- Build contact sheets (3×3 or 4×2) and inspect them as images.

What to look for:

- text overflowing a card or colliding with an icon;
- labels cut by a bar;
- two labels overlapping;
- a caption sitting on a grid;
- a diagram with a huge empty half;
- a ghost scaffold that is too faint;
- a chart whose labels disagree with the narration;
- a scene with a missing value;
- a scene that is a slide, not a motion piece.

### 14.2 Start + 0.4s check

For every scene start, render `start + 0.4`. If the frame is more than ~80% empty, move the base scaffold earlier or add a ghost.

### 14.3 Full-timeline draw sweep

This catches undefined variables in branches you did not screenshot.

```js
const errors = [];
for (let t = 0; t <= DURATION; t += 0.5) {
  try { window.__drawAt(t); } catch (e) { errors.push({ t, msg: e.message }); }
}
```

A 54-scene, 18-minute video has ~2,230 sample points; zero errors is the target.

### 14.4 Audio + seek test

```js
await page.click('#posterPlay');
await page.waitForTimeout(2500);
const s = await page.evaluate(() => ({
  t: __audio.currentTime, paused: __audio.paused,
  ready: __audio.readyState, state: __state(),
}));
```

Check:

- `currentTime` advances at real time;
- `paused` is false;
- `readyState` is 4;
- `__state().playhead` is within ~0.05s of the audio;
- seek to 0, 600, 1000, and duration−5; the canvas follows and the audio does not throw.

### 14.5 Frame-time / performance

- Use `window.__drawAt(t)` in a loop to measure JS draw time per scene.
- The reference is <1ms per scene on a normal desktop.
- If a scene is >5ms, look for a per-frame gradient, huge shadowBlur, or thousands of text calls.
- Test rAF throughput in headless Chrome; if it is <30fps, cache the background and throttle DOM UI. The reference went from ~13fps to ~48fps in headless after caching the backdrop and throttling UI. A real GPU is faster, but the cache is still the right design.

### 14.6 Timeline gap check

Run the node script in §6.4. `gaps = 0` and `end ≈ audio.duration` (within 0.1s).

### 14.7 Mobile / portrait / fullscreen

- 390×844 portrait: the video is letterboxed; the player controls must fit. Scale the poster button down; hide the center chapter label on narrow screens.
- 844×390 landscape: the 16:9 video fills; text should be readable.
- Fullscreen: the canvas resizes and redraws; no blur, no stale frame.

### 14.8 Content review

Read the on-screen text as a viewer, not as the author:

- Does every label land on the word?
- Is every number correct?
- Is any text unreadable at 1080p?
- Does any scene reveal the conclusion before the narration?
- Does the final state hold long enough?
- Does any scene have a title-like header that is not the actual content? Remove it.

---

## 15. Performance rules

1. **Bake the background.** Base color + glow + grain + vignette into one offscreen canvas.
2. **Draw only when needed.** `playing || dirty`.
3. **Throttle DOM UI.** ~8 Hz, not 60.
4. **Cap dpr at 1.5.** 1080p design, 2880×1620 max internal.
5. **No per-frame `createRadialGradient`, `createPattern`, `filter`, or large `shadowBlur`.**
6. **No thousands of text calls.** A scene should have tens, not hundreds.
7. **Avoid re-measuring text every frame.** If a layout is static, compute it once in module scope or a cache.
8. **Use `ctx.save/restore` around alpha/transform changes.** A leaked `globalAlpha` can make an entire scene invisible.
9. **Use `strokePath` early-return for zero progress.** A zero-length round-cap line is a dot.
10. **Measure.** `__drawAt` loop; if a scene is slow, profile it before adding more.

---

## 16. Hard-won pitfalls

These are real bugs from the reference build. Put them in the checklist.

1. **`[hidden]` is weaker than a class with `display:grid`.** Add `[hidden] { display:none !important; }` or the error overlay will cover the whole app.
2. **A zero-progress arrow draws a dot.** Return early if `progress <= 0.001`.
3. **Filling patch gaps as squares makes polka dots.** Use dark grid lanes, not intersection squares.
4. **A label longer than its card is not a style.** Measure with `ctx.measureText` or shorten the copy.
5. **Icons placed at the right edge of a 680px card collide with long titles.** Remove the icon; text wins.
6. **Reference-line labels at the same y overlap.** Use a legend at the top with short samples, or stagger the labels.
7. **A big hero number can collide with a subtitle/underline.** Put the subtitle below the underline, not through it.
8. **A pill and a following text node can overlap.** Use the pill's returned `{x,w}` to place the text.
9. **Captions can sit on a dot grid.** Measure the grid's bottom and place the caption 50–70px below.
10. **Vertical text is never acceptable.** It is unreadable on phones and breaks the horizontal reading path.
11. **Ghost scaffolds can be too faint.** 0.10–0.20 alpha plus a dashed border; add faint labels if the scene would otherwise be empty.
12. **A scene can be blank for 2–3s after a cut.** Check `start + 0.4`; pull the base scaffold earlier.
13. **Audio elements created in JS are not in the DOM.** `document.querySelector('audio')` returns null; use `window.__audio` for QA.
14. **Autoplay is blocked without a gesture.** Keep the poster play button; don't try to autoplay on load.
15. **`00.6` is a syntax error.** Use `0.6`.
16. **Headless screenshots of 39 pages can crash the browser.** Load one page and call `__drawAt(t)` in a loop, or screenshot in small batches.
17. **Repeated full-screen radial gradients tank headless fps.** Cache the backdrop.
18. **`updateUI` every rAF is expensive.** Throttle it.
19. **`ctx.globalAlpha *= alpha` without restore leaks.** Always wrap in save/restore.
20. **A scene can be perfectly coded and still look bad.** Look at the stills.
21. **An audio file can be 50MB.** The server must support Range; preload auto is fine on localhost but do not assume instant remote loading.
22. **The player chrome can show a chapter title that looks like a scene title.** Keep it small and outside the canvas; hide it in fullscreen idle.
23. **A scene's last reveal needs a hold.** If the next scene starts immediately, the viewer never reads it.
24. **Do not put the final answer on screen before the narration says it.** The voiceover carries the suspense.
25. **A static hero shot is a skip risk.** A 4px sine drift is not motion. Use a push-in plus a focus/scan motif in the first 2s; lock onto the subject on the word that introduces it.

---

## 17. Definition of done

A video is done when all of these are true:

- [ ] 1920×1080, 16:9, no letterboxing inside the canvas.
- [ ] Duration matches the audio within 0.1s.
- [ ] 100% of scenes have a start and end; `gaps = 0`.
- [ ] Every label is ≥30px at 1080p (except axis ticks/credits).
- [ ] Every label is horizontal and readable on a phone.
- [ ] No scene title at the top-left.
- [ ] No text overflow or overlap at 1080p.
- [ ] Every scene has a base state at t=0.
- [ ] Every scene's final state holds ≥1.5s.
- [ ] The top-level thesis statement is landed and held.
- [ ] The paper is cited at the end.
- [ ] Full-timeline draw sweep: 0 errors.
- [ ] Audio play + seek at 0/600/1000/end: works.
- [ ] Frame-time benchmark: all scenes <5ms, ideally <1ms.
- [ ] Timeline gap check: 0 gaps.
- [ ] Contact sheet of all scene midpoints reviewed.
- [ ] Portrait mobile player does not overflow.
- [ ] README explains how to run, controls, stills, and the fact that no MP4 was rendered.
- [ ] Server is running on localhost; the URL is verified.

---

## 18. Copy-paste brief for the next video

Use this as the first message to the agent:

```text
Build a word-synced localhost explainer video from the supplied narration/audio.

Inputs:
- audio.wav
- voiceover_narration.txt
- visual_guide.txt
- paper/source

Deliverable:
- a live 1920x1080 preview at http://localhost:4173/
- no MP4 render
- capture stills at /preview/?capture=1&t=SECONDS&scale=2

Follow the production playbook in /home/jeevankumar/Videos/backup-skill/skill.md exactly.

Non-negotiables:
- faster-whisper word timestamps aligned to the known script
- every reveal keyed to a phrase with at()
- 54-ish scenes, 10-40s each, with ghost scaffolds
- Space Grotesk + Inter, fixed 1080p ramp, no essential text below 30px
- Dracula palette, semantic accent colors
- no scene titles, no paragraphs, 1-5 words per callout
- hold every final state 1.5-3s
- verify with stills at every scene midpoint and a full-timeline draw sweep
- README + start.sh

Before authoring, show me the scene map and numbers ledger.
Work in batches of 3-5 scenes and screenshot each batch.
```

---

## 19. Reference build

Use the Vision Encoder project as the working example:

```
/home/jeevankumar/Videos/vision-encoder/preview/
  js/kit.js
  js/app.js
  js/data/timeline.js
  js/scenes/*.js
  server.mjs
  style.css
  index.html
```

What to copy for a new video:

- `kit.js` (drawing system)
- `app.js` (audio clock, capture, idle UI)
- `style.css` (player chrome)
- `server.mjs` (Range support)
- `public/fonts/` (local fonts)
- the scene file structure and the `at()` pattern

What to rewrite:

- `js/data/timeline.js`
- all `js/scenes/*.js`
- `README.md`
- the narration/visual guide/audio

What not to copy blindly:

- the semantic colors of that paper (reassign them for the new topic);
- the bicycle photo (make a new motif unless the new video is about vision);
- the exact layout of the test cards (adapt the archetype);
- the 54-scene count (the new narration decides the count).

---

## 20. The intangible part

The reference works because of a hundred small decisions, not because of a single trick.

- **It is one continuous thought.** The photo becomes a patch; the patch becomes a vector; the vector becomes a token; the token becomes a model. The viewer is never asked to restart from scratch.
- **Every scene has a job.** Even the 3s transition scenes set up the next idea. Nothing is “a title card” or “a divider”.
- **The type is quiet.** It never shouts. The diagrams and the voice carry the energy. The biggest number is allowed to be big because everything else is restrained.
- **The negative space is doing work.** The empty frame is not wasted; it is the breathing room that makes the next object land.
- **The ghost scaffolds are invisible when they work.** The viewer feels the layout is always there, not that boxes pop in from nowhere.
- **The holds are generous.** The video trusts the viewer to read. That is the difference between a demo reel and an explainer.
- **The color is a language.** By the end, the viewer knows cyan is the pretrained encoder, green is the scratch encoder, orange is encoder-free, purple is in-fusion — without a legend.
- **The charts are honest.** Direct labels, real values, dashed references. No decorative axes, no invented data.
- **The last frame is the thesis.** “The part we were paying for was never the part doing the work.” Then the paper. Then the next idea. No clutter.
- **It was verified.** Not just coded. Screenshotted, read, corrected.

That is the “more”. Keep the rules. Keep the holds. Keep the quiet. Look at the frames.
