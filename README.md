# Softmax — live explainer preview

A word-synced, 1920×1080 animated explainer built from `script.txt` and `audio.wav`.
The deliverable is the **localhost preview**, not an MP4.

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
http://localhost:4173/preview/?capture=1&t=153&scale=2
```

`scale=2` renders a 3840×2160 still. In capture mode the player chrome is hidden.

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

## Verification

- 78 scenes, 0 timeline gaps, end 1194.88 s.
- Full-timeline draw sweep: 0 errors.
- Stills at every scene midpoint and `start + 0.4` reviewed in `shots/`.
- Type: primary labels 30–56 px at 1080p; axis/tertiary 24–28 px; hero 64–250 px.
- Mobile: 16:9 letterboxed player; controls fit at 390×844; landscape gives a readable size.
- QA art: `shots/final_mid_*.jpg`, `shots/final_start_*.jpg`, `shots/scenes/`, `shots/mobile_*.png`, and one 3840×2160 still (`shots/final_4k.jpg`).
- Narration only. No music, no SFX.

No MP4 was rendered.
