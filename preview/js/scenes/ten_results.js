import {
  C, F, W, H, clamp, lerp, p, enter, easeInOut, card, text, line, arrow,
  strokePath, underline, measure, rr, icon,
} from '../kit.js';
import {
  M, tag, chip, statement, gate, thoughtRow, wordPill, relativeBar, stat, MONO,
} from '../motifs.js';
import { at, start } from '../data/timeline.js';

const q = {
  results: at('now the results', 79),
  eleven: at('11 benchmarks', 79),
  three: at('three model sizes', 79),
  ten: at('10 percent better', 79),
  tokens: at('35 to 55', 79),
  faster: at('1.8 to 2.6', 79),
  cheaper: at('2.7 to 3.7', 79),
  gaia: at('Gaia at 14', 79),
  v524: at('52.4', 79),
  kimi: at('Kimi', 79),
  v417: at('41.7', 79),
  luna: at('Luna', 79),
  v379: at('37.9', 79),
  estimate: at('estimates', 79),

  test: at('the test I promised', 80),
  real: at('silence real', 80),
  eightB: at('8 billion', 80),
  v846: at('84.6', 80),
  block: at('block silent', 80),
  v804: at('80.4', 80),
  noise: at('random noise', 80),
  v664: at('66.4', 80),
  other: at('different problem', 80),
  v448: at('44.8', 80),
  random: at('random words', 80),
  v412: at('41.2', 80),
  noiseHurts: at('noise hurts less', 81),
  wrongThoughts: at('wrong thoughts', 81),
  extra: at('extra computing time', 81),
  content: at('content of the thoughts', 81),
  uses: at('actually uses', 81),

  readHeader: at('can you read them', 82),
  nearest: at('nearest word', 82),
  messy: at('messy but readable', 82),
  linesUp: at('lines up', 82),
  proxy: at('a proxy', 82),
  debug: at('debugging tool', 82),

  safety: at('safety angle', 83),
  fragile: at('fragile window', 83),
  move: at('move thinking into silence', 83),
  enough: at('enough', 83),
  monitors: at('outside monitors', 83),
  v4349: at('43 to 49', 83),
  asWell: at('about as well', 83),
  enoughSafety: at('enough for safety', 83),
  unknown: at('anyone knows', 83),

  others: at('not just this paper', 84),
  tokenAssorted: at('Token Assorted', 84),
  vital: at('VITAL', 84),
  gating: at('gating head', 84),
  teams: at('several teams', 84),

  caveat: at('one last caveat', 85),
  qwen: at('Qwen', 85),
  range: at('four to fourteen', 85),
  research: at('this is research', 85),
  frontier: at('no frontier lab', 85),
  code: at('code is public', 85),
};

// ---------------------------------------------------------------- 56

const fiftySix = {
  id: 's56-results',
  title: 'The results',
  start: 849.6,
  end: start(80),
  draw(ctx, t) {
    const base = 0.9;
    const headA = p(t, q.eleven, 0.6);
    const threeA = p(t, q.three, 0.5);
    const gaiaA = p(t, q.gaia, 0.6);
    const noteA = p(t, q.estimate, 0.6);

    text(ctx, 'across 11 benchmarks and three model sizes', 960, 210, {
      size: 34, weight: 450, color: C.fg, align: 'center', alpha: headA, ls: -0.3,
    });
    tag(ctx, 960, 252, 'agent benchmarks · relative to its own baseline', {
      color: C.dim, alpha: threeA * 0.85, size: 25, align: 'center',
    });

    const tiles = [
      { x: 150, value: '\u2248 10%', label: 'better on average', color: C.green, cue: q.ten },
      { x: 550, value: '35\u201355%', label: 'fewer tokens', color: M.thought, cue: q.tokens },
      { x: 950, value: '1.8\u20132.6\u00d7', label: 'faster', color: M.gate, cue: q.faster },
      { x: 1350, value: '2.7\u20133.7\u00d7', label: 'cheaper per question', color: M.word, cue: q.cheaper },
    ];
    tiles.forEach((tile, i) => {
      const e = p(t, tile.cue - 0.1, 0.55);
      if (e < 0.5) {
        card(ctx, tile.x, 300, 380, 190, {
          fill: 'rgba(58,61,78,0.5)', stroke: 'rgba(248,248,242,0.25)', r: 18,
          lw: 1.4, dash: [8, 8], alpha: base * 0.5,
        });
      }
      card(ctx, tile.x, 300, 380, 190, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 18,
        alpha: base * (0.35 + 0.65 * e),
      });
      text(ctx, tile.value, tile.x + 30, 400, {
        size: 56, weight: 500, color: tile.color, alpha: e, ls: -2,
      });
      text(ctx, tile.label, tile.x + 30, 452, {
        size: 28, weight: 400, color: C.muted, alpha: e * 0.95,
      });
    });

    // Gaia comparison.
    if (gaiaA > 0.001) {
      text(ctx, 'Gaia \u00b7 14B', 200, 590, {
        size: 32, weight: 500, color: C.fg, alpha: gaiaA,
      });
      const x0 = 700;
      const x1 = 1450;
      const scale = (v) => x0 + (v / 60) * (x1 - x0);
      const rows = [
        { label: 'this agent', v: 52.4, cue: q.v524, color: C.green },
        { label: 'Kimi K3', v: 41.7, cue: q.v417, color: 'rgba(184,185,197,0.65)' },
        { label: 'GPT-5.6 Luna', v: 37.9, cue: q.v379, color: 'rgba(184,185,197,0.65)' },
      ];
      // Ghost tracks.
      rows.forEach((r, i) => {
        card(ctx, x0, 640 + i * 80, x1 - x0, 26, {
          fill: 'rgba(248,248,242,0.05)', stroke: null, r: 6, alpha: base * 0.4,
        });
      });
      rows.forEach((r, i) => {
        const yy = 640 + i * 80;
        text(ctx, r.label, 660, yy + 15, {
          size: 28, weight: 400, color: C.muted, align: 'right', alpha: gaiaA * 0.95,
        });
        const e = p(t, r.cue - 0.1, 0.6);
        card(ctx, x0, yy, Math.max(4, (scale(r.v) - x0) * e), 26, {
          fill: r.color, stroke: null, r: 6, alpha: gaiaA * (i === 0 ? 0.9 : 0.65),
        });
        text(ctx, String(r.v), scale(r.v) + 16, yy + 15, {
          size: 32, weight: 500, color: i === 0 ? C.green : C.muted,
          alpha: p(t, r.cue, 0.5), baseline: 'middle',
        });
      });
      if (noteA > 0.001) {
        text(ctx, 'cost estimates leave out prompt reading and tool runs', 960, 930, {
          size: 26, weight: 400, color: C.dim, align: 'center', alpha: noteA * 0.85,
        });
      }
    }
  },
};

// ---------------------------------------------------------------- 57

const fiftySeven = {
  id: 's57-ablation',
  title: 'Is the silence real thinking?',
  start: start(80),
  end: start(82),
  draw(ctx, t) {
    const base = 0.9;
    const headA = p(t, q.test, 0.6);
    const realA = p(t, q.real, 0.6);
    const bA = p(t, q.eightB, 0.6);
    const noiseA = p(t, q.noiseHurts, 0.6);
    const contentA = p(t, q.content, 0.6);
    const usesA = p(t, q.uses, 0.6);

    text(ctx, 'is the silence real thinking, or filler?', 960, 200, {
      size: 38, weight: 450, color: C.fg, align: 'center', alpha: headA, ls: -0.4,
    });
    tag(ctx, 960, 246, 'MATH-500 \u00b7 8B', {
      color: C.dim, alpha: bA * 0.9, size: 28, align: 'center',
    });
    tag(ctx, 960, 288, 'the authors messed with the silent thoughts', {
      color: C.muted, alpha: realA * 0.8, size: 26, align: 'center',
    });

    const rows = [
      { label: 'baseline', v: 84.6, cue: q.v846, color: M.gate },
      { label: 'block silent mode', v: 80.4, cue: q.v804, color: M.word },
      { label: 'add heavy noise', v: 66.4, cue: q.v664, color: M.logits },
      { label: 'other problem', v: 44.8, cue: q.v448, color: M.thought },
      { label: 'random words', v: 41.2, cue: q.v412, color: M.bug },
    ];
    const x0 = 720;
    const x1 = 1460;
    rows.forEach((r, i) => {
      const yy = 350 + i * 100;
      const e = p(t, r.cue - 0.1, 0.6);
      text(ctx, r.label, 680, yy + 16, {
        size: 30, weight: 400, color: C.muted, align: 'right',
        alpha: base * (0.34 + 0.66 * e),
      });
      card(ctx, x0, yy, x1 - x0, 28, {
        fill: 'rgba(248,248,242,0.05)', stroke: null, r: 6, alpha: base * 0.65,
      });
      card(ctx, x0, yy, Math.max(4, (x1 - x0) * (r.v / 100) * e), 28, {
        fill: r.color, stroke: null, r: 6, alpha: base * e * 0.85,
      });
      text(ctx, String(r.v), 1480, yy + 16, {
        size: 34, weight: 500, color: r.color, alpha: e, baseline: 'middle',
      });
    });

    if (noiseA > 0.001) {
      text(ctx, 'noise hurts less than wrong thoughts', 960, 876, {
        size: 34, weight: 400, color: C.muted, align: 'center',
        alpha: noiseA * (1 - 0.8 * contentA) * 0.95,
      });
    }
    if (contentA > 0.001) {
      text(ctx, 'the content of the thoughts', 960, 900, {
        size: 48, weight: 500, color: C.green, align: 'center', alpha: contentA, ls: -0.6,
      });
      text(ctx, 'not the extra compute', 960, 952, {
        size: 30, weight: 400, color: C.muted, align: 'center', alpha: usesA * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 58

const fiftyEight = {
  id: 's58-read',
  title: 'A messy but readable stream',
  start: start(82),
  end: start(83),
  draw(ctx, t) {
    const base = 0.9;
    const readA = p(t, q.readHeader, 0.6);
    const mapA = p(t, q.nearest, 0.7);
    const messyA = p(t, q.messy, 0.6);
    const proxyA = p(t, q.proxy, 0.6);
    const debugA = p(t, q.debug, 0.6);

    text(ctx, 'can you read the silent thoughts?', 960, 210, {
      size: 38, weight: 450, color: C.fg, align: 'center', alpha: readA, ls: -0.4,
    });

    // Thought cells.
    thoughtRow(ctx, 300, 340, 1320, 64, {
      cells: 30, color: M.thought, alpha: base * 0.9, progress: p(t, q.readHeader + 0.2, 0.8),
    });
    tag(ctx, 300, 310, 'silent steps', { color: M.thought, alpha: readA * 0.9, size: 28 });

    // Nearest words.
    const words = ['the', 'so', 'wait', 'if', 'then', 'no'];
    const xs = [330, 540, 750, 960, 1170, 1380];
    words.forEach((w, i) => {
      const a = messyA * p(t, q.messy + i * 0.08, 0.4);
      text(ctx, w, xs[i], 560, {
        size: 38, weight: 500, color: M.word, align: 'center', alpha: a,
      });
      if (mapA > 0.001) {
        line(ctx, 300 + i * 240 + 60, 410, xs[i], 524, {
          color: 'rgba(189,147,249,0.28)', width: 1.4, alpha: mapA * 0.8, rough: 0.2,
        });
      }
    });
    tag(ctx, 300, 500, 'nearest word', { color: C.dim, alpha: mapA * 0.9, size: 26 });

    if (messyA > 0.001) {
      text(ctx, 'a messy but readable stream', 960, 700, {
        size: 40, weight: 450, color: C.fg, align: 'center', alpha: messyA, ls: -0.5,
      });
    }
    if (proxyA > 0.001) {
      text(ctx, 'a proxy, not proof', 960, 780, {
        size: 38, weight: 500, color: M.bug, align: 'center', alpha: proxyA,
      });
    }
    if (debugA > 0.001) {
      text(ctx, 'a debugging tool, and nothing more', 960, 860, {
        size: 30, weight: 400, color: C.muted, align: 'center', alpha: debugA * 0.95,
      });
    }
  },
};

// ---------------------------------------------------------------- 59

const fiftyNine = {
  id: 's59-safety',
  title: 'The safety angle',
  start: start(83),
  end: start(84),
  draw(ctx, t) {
    const base = 0.9;
    const headA = p(t, q.safety, 0.6);
    const windowA = p(t, q.fragile, 0.6);
    const closeT = p(t, q.move, 1.4);
    const enoughA = p(t, q.enough, 0.6);
    const monitorA = p(t, q.monitors, 0.6);
    const statA = p(t, q.v4349, 0.6);
    const wellA = p(t, q.asWell, 0.6);
    const safetyA = p(t, q.enoughSafety, 0.6);
    const unknownA = p(t, q.unknown, 0.6);

    tag(ctx, 180, 220, 'the safety angle', { color: M.word, alpha: headA * 0.95, size: 30 });

    // The window.
    card(ctx, 280, 320, 720, 400, {
      fill: C.well, stroke: 'rgba(248,248,242,0.18)', r: 16, lw: 1.6, alpha: base * (0.2 + 0.8 * windowA),
    });
    // visible text lines
    for (let i = 0; i < 7; i++) {
      const lineA = windowA * (1 - 0.8 * closeT * (i / 6));
      line(ctx, 320, 380 + i * 42, 320 + 280 + (i * 37) % 260, 380 + i * 42, {
        color: M.word, width: 3.2, alpha: lineA * 0.55, rough: 0,
      });
    }
    // the shutter
    if (closeT > 0.001) {
      const sw = 720 * 0.6 * closeT;
      card(ctx, 1000 - sw, 320, sw, 400, {
        fill: 'rgba(30,31,41,0.9)', stroke: 'rgba(248,248,242,0.1)', r: 16, alpha: closeT,
      });
      text(ctx, 'silent', 1000 - sw / 2, 530, {
        size: 30, weight: 400, color: M.thought, align: 'center', alpha: closeT * 0.85,
      });
    }
    text(ctx, 'the visible text', 300, 760, {
      size: 28, weight: 400, color: C.muted, alpha: windowA * 0.85,
    });
    text(ctx, 'a fragile window into the thinking', 300, 806, {
      size: 28, weight: 400, color: M.word, alpha: windowA * 0.9,
    });

    // Monitor.
    if (monitorA > 0.001) {
      icon(ctx, 'eye', 1130, 430, 120, { color: M.gate, alpha: monitorA * 0.95, width: 3 });
      text(ctx, 'monitor', 1190, 580, {
        size: 30, weight: 400, color: M.gate, align: 'center', alpha: monitorA * 0.9,
      });
      line(ctx, 1090, 490, 1000, 530, {
        color: 'rgba(139,233,253,0.3)', width: 1.6, alpha: monitorA * 0.7, rough: 0.2,
      });
    }

    // Stats.
    if (statA > 0.001) {
      text(ctx, '43\u201349%', 1360, 380, {
        size: 64, weight: 500, color: C.green, alpha: statA, ls: -2,
      });
      text(ctx, 'fewer visible tokens', 1360, 430, {
        size: 28, weight: 400, color: C.muted, alpha: statA * 0.95,
      });
      text(ctx, 'a monitor still caught failures', 1360, 500, {
        size: 26, weight: 400, color: C.muted, alpha: wellA * 0.9,
      });
      tag(ctx, 1360, 556, 'about as well as text-only', {
        color: C.green, alpha: wellA * 0.95, size: 26,
      });
    }
    if (enoughA > 0.001) {
      text(ctx, 'the text that remains', 1360, 640, {
        size: 28, weight: 400, color: C.dim, alpha: enoughA * 0.9,
      });
    }
    if (safetyA > 0.001) {
      text(ctx, 'is that enough for safety?', 960, 890, {
        size: 42, weight: 450, color: C.fg, align: 'center', alpha: safetyA, ls: -0.5,
      });
    }
    if (unknownA > 0.001) {
      text(ctx, 'no one knows yet', 960, 950, {
        size: 30, weight: 400, color: M.bug, align: 'center', alpha: unknownA * 0.95,
      });
    }
  },
};

// ---------------------------------------------------------------- 60

const sixty = {
  id: 's60-others',
  title: 'Several teams, one idea',
  start: start(84),
  end: start(85),
  draw(ctx, t) {
    const base = 0.9;
    const othersA = p(t, q.others, 0.6);
    const tokenA = p(t, q.tokenAssorted, 0.6);
    const vitalA = p(t, q.vital, 0.6);
    const gatingA = p(t, q.gating, 0.5);
    const teamsA = p(t, q.teams, 0.6);

    text(ctx, 'it\u2019s not just this paper', 960, 220, {
      size: 38, weight: 450, color: C.fg, align: 'center', alpha: othersA, ls: -0.4,
    });

    // Token Assorted.
    card(ctx, 180, 310, 720, 380, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
      accent: M.thought, accentW: 3, alpha: base * (0.2 + 0.8 * tokenA),
    });
    text(ctx, 'Token Assorted', 220, 390, {
      size: 36, weight: 500, color: C.fg, alpha: tokenA,
    });
    text(ctx, 'early reasoning steps become compressed latent codes', 220, 440, {
      size: 26, weight: 400, color: C.muted, alpha: tokenA * 0.9,
    });
    if (tokenA > 0.2) {
      ['the', 'cat', 'sat'].forEach((w, i) => {
        wordPill(ctx, 240 + i * 130, 520, w, { size: 26, alpha: tokenA });
      });
      arrow(ctx, 620, 540, 700, 540, {
        color: 'rgba(189,147,249,0.5)', width: 2, progress: tokenA, head: 9,
      });
      thoughtRow(ctx, 720, 516, 130, 48, {
        cells: 5, color: M.thought, alpha: tokenA * 0.9, progress: tokenA,
      });
    }

    // VITAL.
    card(ctx, 1020, 310, 720, 380, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
      accent: M.word, accentW: 3, alpha: base * (0.2 + 0.8 * vitalA),
    });
    text(ctx, 'VITAL', 1060, 390, {
      size: 36, weight: 500, color: C.fg, alpha: vitalA,
    });
    text(ctx, 'a gating head chooses at every position', 1060, 440, {
      size: 26, weight: 400, color: C.muted, alpha: vitalA * 0.9,
    });
    if (gatingA > 0.2) {
      for (let i = 0; i < 3; i++) {
        const x = 1080 + i * 200;
        chip(ctx, x, 530, i === 1 ? 'silent' : 'speak', {
          size: 26, color: i === 1 ? M.thought : M.word,
          border: i === 1 ? 'rgba(189,147,249,0.4)' : 'rgba(255,184,108,0.4)',
          bg: 'rgba(49,51,66,0.5)', alpha: gatingA,
        });
      }
    }

    if (teamsA > 0.001) {
      text(ctx, 'several teams landed on the same idea within a year', 960, 800, {
        size: 38, weight: 450, color: C.fg, align: 'center', alpha: teamsA, ls: -0.4,
      });
      text(ctx, 'the idea is in the air', 960, 856, {
        size: 28, weight: 400, color: C.muted, align: 'center', alpha: teamsA * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 61

const sixtyOne = {
  id: 's61-caveat',
  title: 'One last caveat',
  start: start(85),
  end: start(86),
  draw(ctx, t) {
    const base = 0.9;
    const caveatA = p(t, q.caveat, 0.6);
    const qwenA = p(t, q.qwen, 0.6);
    const rangeA = p(t, q.range, 0.5);
    const researchA = p(t, q.research, 0.6);
    const frontierA = p(t, q.frontier, 0.6);
    const codeA = p(t, q.code, 0.6);

    tag(ctx, 180, 220, 'one last caveat', { color: M.word, alpha: caveatA * 0.95, size: 30 });

    card(ctx, 240, 320, 600, 300, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
      accent: M.thought, accentW: 3, alpha: base * (0.2 + 0.8 * qwenA),
    });
    text(ctx, 'Qwen3', 280, 410, { size: 46, weight: 500, color: C.fg, alpha: qwenA });
    if (rangeA > 0.001) {
      text(ctx, '4B \u2013 14B', 280, 500, {
        size: 64, weight: 500, color: M.thought, alpha: rangeA, ls: -2,
      });
    }
    if (researchA > 0.001) {
      tag(ctx, 280, 560, 'research', { color: C.dim, alpha: researchA * 0.9, size: 28 });
    }

    if (frontierA > 0.001) {
      text(ctx, 'no frontier lab has said it ships this', 980, 400, {
        size: 36, weight: 450, color: C.fg, alpha: frontierA, ls: -0.3,
      });
      line(ctx, 980, 430, 1620, 430, {
        color: 'rgba(255,85,85,0.35)', width: 2, alpha: frontierA * 0.8, rough: 0,
      });
    }
    if (codeA > 0.001) {
      text(ctx, 'the code is public if you want to try it', 980, 520, {
        size: 32, weight: 400, color: C.muted, alpha: codeA * 0.95,
      });
      tag(ctx, 980, 580, 'code public', { color: C.green, alpha: codeA * 0.95, size: 28 });
    }
  },
};

export default [fiftySix, fiftySeven, fiftyEight, fiftyNine, sixty, sixtyOne];
