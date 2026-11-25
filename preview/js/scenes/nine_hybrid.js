import {
  C, F, W, H, clamp, lerp, p, enter, easeInOut, card, text, line, arrow,
  strokePath, underline, measure, rr, icon, bracket,
} from '../kit.js';
import {
  M, tag, chip, statement, gate, leak, flow, pathFlow, thoughtRow, wordPill,
  relativeBar, axes, stat, tool, MONO,
} from '../motifs.js';
import { at, start } from '../data/timeline.js';

const q = {
  works: at("here's how it works", 70),
  normal: at('normal language model', 70),
  special: at('special token', 70),
  silent: at('going silent', 70),
  mode: at('latent mode', 70),
  top: at('top-layer thought', 70),
  straight: at('straight back in', 70),
  noSoftmax: at('no softmax', 70),
  noDict: at('no dictionary', 70),
  tens: at('tens, even hundreds', 70),
  end: at('end marker', 70),
  toolCall: at('tool call', 70),

  adapter: at('tiny adapter', 71),
  hybrid: at('HybridLink', 71),
  correction: at('small correction', 71),
  tenM: at('ten million', 71),
  fourB: at('four-billion', 71),
  math: at('Math five hundred', 71),
  pct714: at('71.4', 71),
  pct882: at('88.2', 71),

  memory: at("then there's memory", 72),
  kv: at('K V cache', 72),
  normalAgent: at('normal agent', 72),
  history: at('whole history', 72),
  noText: at('no text version', 72),
  keep: at('keeps its notes alive', 72),
  nothing: at('nothing is lost', 72),

  warning: at('one warning', 73),
  engines: at('serving engines', 73),
  extended: at('extended the training', 73),
  drop: at('drop this into your server', 73),

  hard: at('training this is the hard part', 74),
  two: at('two problems', 74),
  problem1: at('problem one', 75),
  snowball: at('errors snowball', 75),
  snaps: at('every output snaps', 75),
  noDict75: at('no dictionary', 75),
  small: at('small error becomes', 75),
  hundred: at('hundred silent steps', 75),
  mush: at('turns to mush', 75),
  train: at('train the model on its own', 75),
  billion14: at('14-billion', 75),
  pct738: at('73.8', 75),
  pct842: at('84.2', 75),

  problem2: at('problem two', 76),
  grpo: at('G R P O', 76),
  likely: at('how likely each choice', 76),
  softmax: at('softmax', 76),
  skip: at('skip softmax', 76),
  rlBreak: at('does R L break', 76),

  deterministic: at('silent steps are deterministic', 77),
  exactlyOne: at('exactly one', 77),
  multiply: at('multiply by one', 77),
  chances: at('only need chances', 77),
  replay: at('replay the exact same', 77),
  factor: at('hybrid policy factorization', 77),
  rollout: at('exact rollout replay', 77),

  which: at('which steps go silent', 78),
  entropy: at('entropy is low', 78),
  tools: at('tool calls', 78),
  noReward: at('no reward for going quiet', 78),
  only: at('only correct answers', 78),
  own: at('on its own', 78),
};

// ---------------------------------------------------------------- 48

const fortyEight = {
  id: 's48-how-it-works',
  title: 'Think in latent, act in text',
  start: start(70),
  end: 699.0,
  draw(ctx, t) {
    const base = 0.9;
    const normalA = p(t, q.normal, 0.6);
    const tokenA = p(t, q.special, 0.5);
    const loopA = p(t, q.mode, 0.7);
    const topA = p(t, q.top, 0.6);
    const gateA = p(t, q.noSoftmax, 0.6);
    const dictA = p(t, q.noDict, 0.6);
    const tensA = p(t, q.tens, 0.6);
    const endA = p(t, q.end, 0.6);
    const toolA = p(t, q.toolCall, 0.6);

    tag(ctx, 200, 220, 'here\u2019s how it works', { color: C.dim, alpha: p(t, q.works, 0.6) * 0.9, size: 30 });

    // Question.
    card(ctx, 140, 430, 260, 100, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 15, alpha: base * 0.9,
    });
    text(ctx, 'question', 174, 490, { size: 34, weight: 500, color: C.fg, alpha: base });
    arrow(ctx, 406, 480, 492, 480, {
      color: 'rgba(248,248,242,0.32)', width: 1.8, progress: base, head: 8,
    });

    // Language model.
    card(ctx, 500, 390, 360, 180, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 18,
      accent: M.gate, accentW: 3, alpha: base,
    });
    text(ctx, 'language model', 532, 466, {
      size: 34, weight: 500, color: C.fg, alpha: 0.2 + 0.8 * normalA,
    });
    text(ctx, 'one pass per step', 532, 510, {
      size: 26, weight: 400, color: C.muted, alpha: 0.2 + 0.8 * normalA * 0.85,
    });

    // Silent token.
    if (tokenA > 0.001) {
      arrow(ctx, 864, 480, 920, 480, {
        color: 'rgba(248,248,242,0.3)', width: 1.8, progress: tokenA, head: 8,
      });
      chip(ctx, 930, 480, '<silent>', {
        size: 30, color: M.thought, border: 'rgba(189,147,249,0.45)',
        bg: 'rgba(49,51,66,0.6)', alpha: tokenA,
      });
      tag(ctx, 930, 540, 'the token that goes silent', {
        color: C.dim, alpha: tokenA * 0.85, size: 25,
      });
    }

    // The latent loop above the model.
    if (loopA > 0.001) {
      const pts = [[570, 390], [570, 288], [800, 288], [800, 390]];
      strokePath(ctx, pts, {
        color: 'rgba(189,147,249,0.6)', width: 2.6, alpha: loopA,
        progress: p(t, q.mode, 0.7), rough: 0.3,
      });
      pathFlow(ctx, pts, {
        color: M.thought, alpha: loopA * 0.9, progress: p(t, q.mode, 0.7),
        n: 11, t, size: 5, speed: 0.12, seed: 4,
      });
      arrow(ctx, 800, 340, 800, 392, {
        color: 'rgba(189,147,249,0.8)', width: 2.2, progress: p(t, q.straight, 0.4), head: 11,
      });
      tag(ctx, 685, 250, 'latent mode', {
        color: M.thought, alpha: loopA * 0.95, size: 30, align: 'center',
      });
      tag(ctx, 685, 330, 'top-layer thought', {
        color: C.muted, alpha: topA * 0.9, size: 24, align: 'center',
      });
    }

    if (tensA > 0.001) {
      text(ctx, 'tens, even hundreds of silent steps', 685, 622, {
        size: 28, weight: 400, color: C.muted, align: 'center', alpha: tensA * 0.9,
      });
    }

    // The skipped machinery.
    if (gateA > 0.001) {
      gate(ctx, 1080, 700, 96, 150, {
        alpha: 0.35, open: 0.8, accent: M.gate, label: null,
      });
      line(ctx, 1040, 650, 1120, 750, {
        color: M.bug, width: 3, alpha: gateA * 0.9, rough: 0.4,
      });
      tag(ctx, 1080, 820, 'no softmax', {
        color: M.bug, alpha: gateA * 0.9, size: 26, align: 'center',
      });
    }
    if (dictA > 0.001) {
      tag(ctx, 1290, 700, 'no dictionary', {
        color: M.bug, alpha: dictA * 0.9, size: 26,
      });
    }

    // End marker and tool call.
    if (endA > 0.001) {
      arrow(ctx, 1130, 480, 1180, 480, {
        color: 'rgba(248,248,242,0.3)', width: 1.8, progress: endA, head: 8,
      });
      card(ctx, 1190, 426, 240, 108, {
        fill: C.surface, stroke: 'rgba(80,250,123,0.35)', r: 15,
        accent: C.green, accentW: 3, alpha: endA,
      });
      text(ctx, 'end marker', 1222, 488, {
        size: 32, weight: 500, color: C.green, alpha: endA,
      });
    }
    if (toolA > 0.001) {
      arrow(ctx, 1434, 480, 1474, 480, {
        color: 'rgba(248,248,242,0.3)', width: 1.8, progress: toolA, head: 8,
      });
      wordPill(ctx, 1486, 448, 'tool call', { size: 32, alpha: toolA });
      tag(ctx, 1486, 540, 'back in text', {
        color: C.dim, alpha: toolA * 0.85, size: 25,
      });
    }
  },
};

// ---------------------------------------------------------------- 49

const fortyNine = {
  id: 's49-hybridlink',
  title: 'HybridLink',
  start: 699.0,
  end: 720.4,
  draw(ctx, t) {
    const base = 0.9;
    const adapterA = p(t, q.adapter, 0.6);
    const corrA = p(t, q.correction, 0.6);
    const statA = p(t, q.tenM, 0.6);
    const barsA = p(t, q.math, 0.6);
    const firstA = p(t, q.pct714, 0.6);
    const secondA = p(t, q.pct882, 0.6);

    // Thought space.
    card(ctx, 150, 320, 560, 310, {
      fill: C.surface, stroke: 'rgba(189,147,249,0.28)', r: 18, alpha: base * 0.9,
    });
    tag(ctx, 190, 374, 'thought space', { color: M.thought, alpha: base * 0.9, size: 29 });
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        rr(ctx, 210 + i * 78, 410 + j * 44, 56, 30, 4);
        ctx.strokeStyle = 'rgba(189,147,249,0.45)';
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = base * 0.8;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // Input space.
    card(ctx, 1210, 320, 560, 310, {
      fill: C.surface, stroke: 'rgba(139,233,253,0.28)', r: 18, alpha: base * 0.9,
    });
    tag(ctx, 1250, 374, 'input space', { color: M.gate, alpha: base * 0.9, size: 29 });
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 4; j++) {
        rr(ctx, 1268 + i * 78, 410 + j * 44, 56, 30, 4);
        ctx.strokeStyle = 'rgba(139,233,253,0.4)';
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = base * 0.8;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // Adapter.
    card(ctx, 840, 320, 210, 310, {
      fill: C.surface2, stroke: 'rgba(248,248,242,0.18)', r: 18,
      accent: M.correct, accentW: 3, alpha: base * (0.2 + 0.8 * adapterA),
    });
    text(ctx, 'HybridLink', 872, 400, {
      size: 30, weight: 500, color: C.fg, alpha: base * adapterA,
    });
    text(ctx, '+ \u03b4', 910, 500, {
      size: 56, weight: 500, color: C.green, align: 'center', alpha: corrA,
    });
    if (statA > 0.001) {
      text(ctx, '10M params', 910, 568, {
        size: 26, weight: 400, color: C.muted, align: 'center', alpha: statA,
      });
      text(ctx, 'on a 4B model', 910, 602, {
        size: 24, weight: 400, color: C.dim, align: 'center', alpha: statA * 0.9,
      });
    }
    arrow(ctx, 718, 470, 832, 470, {
      color: 'rgba(248,248,242,0.3)', width: 1.8, progress: adapterA, head: 8,
    });
    arrow(ctx, 1058, 470, 1200, 470, {
      color: 'rgba(248,248,242,0.3)', width: 1.8, progress: adapterA, head: 8,
    });

    // MATH-500 bars.
    if (barsA > 0.001) {
      tag(ctx, 300, 708, 'MATH-500', { color: C.muted, alpha: barsA * 0.9, size: 28 });
      text(ctx, 'no alignment', 660, 776, {
        size: 28, weight: 400, color: C.muted, align: 'right', alpha: barsA,
      });
      relativeBar(ctx, 700, 754, 800, 34, 0.714, {
        color: 'rgba(184,185,197,0.6)', alpha: barsA, progress: firstA,
      });
      text(ctx, '71.4%', 1516, 772, {
        size: 32, weight: 500, color: C.muted, alpha: firstA, baseline: 'middle',
      });

      text(ctx, 'with HybridLink', 660, 870, {
        size: 28, weight: 400, color: C.muted, align: 'right', alpha: barsA,
      });
      relativeBar(ctx, 700, 848, 800, 34, 0.882, {
        color: C.green, alpha: barsA, progress: secondA,
      });
      text(ctx, '88.2%', 1516, 866, {
        size: 32, weight: 500, color: C.green, alpha: secondA, baseline: 'middle',
      });
    }
  },
};

// ---------------------------------------------------------------- 50

const fifty = {
  id: 's50-memory',
  title: 'Keep the notes alive',
  start: 720.4,
  end: start(73),
  draw(ctx, t) {
    const base = 0.9;
    const kvA = p(t, 720.7, 0.6);
    const normalA = p(t, q.normalAgent, 0.6);
    const histA = p(t, q.history, 0.6);
    const noTextA = p(t, q.noText, 0.6);
    const keepA = p(t, q.keep, 0.6);
    const nothingA = p(t, q.nothing, 0.6);

    text(ctx, 'the KV cache', 960, 220, {
      size: 42, weight: 500, color: C.fg, align: 'center', alpha: kvA, ls: -0.5,
    });
    text(ctx, 'the notes a model keeps while it reads', 960, 268, {
      size: 28, weight: 400, color: C.muted, align: 'center', alpha: kvA * 0.9,
    });

    // Normal row.
    tag(ctx, 200, 382, 'normal agent', { color: C.dim, alpha: normalA * 0.95, size: 30 });
    card(ctx, 200, 410, 220, 90, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 14, alpha: base * 0.9,
    });
    text(ctx, 'question', 232, 464, { size: 30, weight: 500, color: C.fg, alpha: base });
    arrow(ctx, 426, 455, 476, 455, { color: 'rgba(248,248,242,0.3)', width: 1.6, progress: base, head: 7 });
    card(ctx, 482, 410, 160, 90, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 14, alpha: base * 0.9,
    });
    text(ctx, 'tool', 522, 464, { size: 30, weight: 500, color: C.fg, alpha: base });
    arrow(ctx, 648, 455, 698, 455, { color: 'rgba(248,248,242,0.3)', width: 1.6, progress: base, head: 7 });

    if (histA > 0.001) {
      card(ctx, 706, 420, 760, 70, {
        fill: 'rgba(255,184,108,0.10)', stroke: 'rgba(255,184,108,0.35)', r: 10,
        alpha: histA * 0.9,
      });
      for (let i = 0; i < 12; i++) {
        line(ctx, 730 + i * 58, 442, 754 + i * 58, 442, {
          color: M.word, width: 3, alpha: histA * 0.55, rough: 0,
        });
        line(ctx, 730 + i * 58, 464, 748 + i * 58, 464, {
          color: M.word, width: 3, alpha: histA * 0.4, rough: 0,
        });
      }
      tag(ctx, 1086, 388, 'paste the whole history back in', {
        color: M.word, alpha: histA * 0.9, size: 25, align: 'center',
      });
    }

    // Hybrid row.
    tag(ctx, 200, 652, 'this agent', { color: M.thought, alpha: keepA * 0.95, size: 30 });
    card(ctx, 200, 682, 220, 90, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 14, alpha: base * 0.9,
    });
    text(ctx, 'question', 232, 736, { size: 30, weight: 500, color: C.fg, alpha: base });
    arrow(ctx, 426, 727, 476, 727, { color: 'rgba(248,248,242,0.3)', width: 1.6, progress: base, head: 7 });
    card(ctx, 482, 682, 160, 90, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 14, alpha: base * 0.9,
    });
    text(ctx, 'tool', 522, 736, { size: 30, weight: 500, color: C.fg, alpha: base });
    arrow(ctx, 648, 727, 698, 727, { color: 'rgba(248,248,242,0.3)', width: 1.6, progress: base, head: 7 });

    if (keepA > 0.001) {
      for (let i = 0; i < 3; i++) {
        card(ctx, 710, 692 + i * 20, 160, 70, {
          fill: i === 2 ? 'rgba(189,147,249,0.18)' : C.surface,
          stroke: 'rgba(189,147,249,0.35)', r: 10, lw: 1.2, alpha: keepA * 0.9,
        });
      }
      text(ctx, 'notes stay alive', 900, 736, {
        size: 30, weight: 400, color: M.thought, alpha: keepA * 0.95,
      });
    }

    if (noTextA > 0.001) {
      text(ctx, 'silent thoughts have no text to paste', 1086, 560, {
        size: 28, weight: 400, color: M.bug, align: 'center', alpha: noTextA * 0.9,
      });
    }

    if (nothingA > 0.001) {
      bracket(ctx, 706, 1480, 600, {
        color: C.green, width: 2, alpha: nothingA * 0.9, tick: 12,
      });
      tag(ctx, 1090, 640, 'nothing is lost', {
        color: C.green, alpha: nothingA * 0.95, size: 30, align: 'center',
      });
    }
  },
};

// ---------------------------------------------------------------- 51

const fiftyOne = {
  id: 's51-warning',
  title: 'Not in your server tomorrow',
  start: start(73),
  end: start(74),
  draw(ctx, t) {
    const base = 0.9;
    const warnA = p(t, q.warning, 0.6);
    const enginesA = p(t, q.engines, 0.6);
    const extA = p(t, q.extended, 0.6);
    const dropA = p(t, q.drop, 0.6);

    tag(ctx, 180, 220, 'a warning for builders', {
      color: M.word, alpha: warnA * 0.95, size: 30,
    });

    // Serving stack.
    for (let i = 0; i < 3; i++) {
      card(ctx, 180, 310 + i * 100, 540, 76, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 12,
        alpha: base * (0.2 + 0.8 * enginesA),
      });
      text(ctx, 'serving engine', 214, 356 + i * 100, {
        size: 30, weight: 500, color: C.muted, alpha: base * (0.2 + 0.8 * enginesA),
      });
    }
    if (enginesA > 0.001) {
      line(ctx, 220, 340, 680, 546, {
        color: M.bug, width: 4, alpha: enginesA * 0.65, rough: 0.4,
      });
      tag(ctx, 180, 620, 'not supported', { color: M.bug, alpha: enginesA * 0.95, size: 30 });
    }

    // Code crate.
    card(ctx, 1000, 320, 540, 280, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 18,
      accent: M.correct, accentW: 3, alpha: base * (0.2 + 0.8 * extA),
    });
    text(ctx, 'HybridAgent code', 1040, 400, {
      size: 36, weight: 500, color: C.fg, alpha: base * (0.2 + 0.8 * extA),
    });
    for (let i = 0; i < 3; i++) {
      line(ctx, 1040, 442 + i * 22, 1040 + 240 + i * 40, 442 + i * 22, {
        color: 'rgba(139,233,253,0.45)', width: 2, alpha: base * extA * 0.7, rough: 0,
      });
    }
    if (extA > 0.001) {
      tag(ctx, 1040, 540, 'they extended the stack themselves', {
        color: C.muted, alpha: extA * 0.9, size: 26,
      });
      tag(ctx, 1480, 400, 'public', { color: C.green, alpha: extA * 0.95, size: 28, align: 'right' });
    }

    if (dropA > 0.001) {
      text(ctx, 'you can\u2019t drop this into your server tomorrow', 960, 820, {
        size: 46, weight: 500, color: M.bug, align: 'center', alpha: dropA, ls: -0.6,
      });
    }
  },
};

// ---------------------------------------------------------------- 52

const fiftyTwo = {
  id: 's52-snowball',
  title: 'Errors snowball',
  start: start(74),
  end: start(76),
  draw(ctx, t) {
    const base = 0.9;
    const hardA = p(t, q.hard, 0.6);
    const twoA = p(t, q.two, 0.5);
    const p1A = p(t, q.problem1, 0.6);
    const snapA = p(t, q.snaps, 0.6);
    const noDictA = p(t, q.noDict75, 0.6);
    const smallA = p(t, q.small, 0.6);
    const hundredA = p(t, q.hundred, 0.6);
    const mushA = p(t, q.mush, 0.7);
    const trainA = p(t, q.train, 0.6);
    const b14A = p(t, q.billion14, 0.5);
    const barA = p(t, q.pct738, 0.6);
    const bar2A = p(t, q.pct842, 0.6);

    text(ctx, 'training is the hard part', 960, 210, {
      size: 42, weight: 450, color: C.fg, align: 'center', alpha: hardA, ls: -0.5,
    });
    tag(ctx, 960, 260, 'two problems', { color: C.dim, alpha: twoA * 0.9, size: 28, align: 'center' });
    tag(ctx, 180, 300, 'problem one · errors snowball', {
      color: M.bug, alpha: p1A * 0.95, size: 29,
    });

    // Text: snaps to words.
    card(ctx, 170, 350, 700, 300, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 18, alpha: base * 0.85,
    });
    text(ctx, 'text', 210, 410, { size: 34, weight: 500, color: M.word, alpha: base });
    const nodes = [280, 390, 500, 610, 720];
    if (snapA > 0.001) {
      strokePath(ctx, [[260, 500], [330, 470], [410, 510], [490, 470], [570, 510], [650, 475], [740, 500]], {
        color: 'rgba(255,184,108,0.7)', width: 2.4, alpha: snapA, rough: 0.4,
      });
      ['the', 'cat', 'sat', 'on', 'it'].forEach((w, i) => {
        text(ctx, w, nodes[i], 560, {
          size: 28, weight: 400, color: C.muted, align: 'center', alpha: snapA * 0.9,
        });
      });
      ctx.save();
      ctx.globalAlpha = snapA;
      ctx.fillStyle = M.bug;
      ctx.beginPath();
      ctx.arc(410, 510, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      text(ctx, 'every step snaps to a word', 210, 620, {
        size: 26, weight: 400, color: C.muted, alpha: snapA * 0.9,
      });
    }

    // Latent: diverges.
    card(ctx, 1050, 350, 700, 300, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 18, alpha: base * 0.85,
    });
    text(ctx, 'latent', 1090, 410, { size: 34, weight: 500, color: M.thought, alpha: base });
    if (noDictA > 0.001) {
      const amp = 8 + 46 * p(t, q.hundred, 0.8);
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const f = i / 20;
        pts.push([1100 + f * 560, 500 + Math.sin(f * 8.5) * amp * f]);
      }
      strokePath(ctx, pts, {
        color: 'rgba(189,147,249,0.7)', width: 2.4, alpha: noDictA, rough: 0.3,
      });
      ctx.save();
      ctx.globalAlpha = mushA;
      for (let i = 0; i < 26; i++) {
        const a = (i * 2.399) % (Math.PI * 2);
        const r = 12 + (i % 7) * 7;
        ctx.fillStyle = M.thought;
        ctx.beginPath();
        ctx.arc(1610 + Math.cos(a) * r, 500 + Math.sin(a) * r, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      text(ctx, 'no dictionary to snap to', 1090, 620, {
        size: 26, weight: 400, color: C.muted, alpha: noDictA * 0.9,
      });
      if (hundredA > 0.001) {
        tag(ctx, 1620, 580, '100 steps', {
          color: M.bug, alpha: hundredA * 0.9, size: 26, align: 'right',
        });
      }
      if (mushA > 0.4) {
        text(ctx, 'mush', 1620, 420, {
          size: 30, weight: 500, color: M.bug, align: 'right', alpha: mushA * 0.9,
        });
      }
    }

    // The fix and the numbers.
    if (trainA > 0.001) {
      text(ctx, 'the fix: train on its own silent thoughts', 960, 700, {
        size: 30, weight: 400, color: C.muted, align: 'center', alpha: trainA * 0.95,
      });
    }
    if (b14A > 0.001) {
      tag(ctx, 300, 748, 'MATH-500 · 14B', { color: C.dim, alpha: b14A * 0.9, size: 26 });
      relativeBar(ctx, 560, 744, 900, 30, 0.738, {
        color: 'rgba(184,185,197,0.6)', alpha: b14A, progress: barA,
      });
      text(ctx, '73.8%', 1478, 760, {
        size: 30, weight: 500, color: C.muted, alpha: barA, baseline: 'middle',
      });
      relativeBar(ctx, 560, 814, 900, 30, 0.842, {
        color: C.green, alpha: b14A, progress: bar2A,
      });
      text(ctx, '84.2%', 1478, 830, {
        size: 30, weight: 500, color: C.green, alpha: bar2A, baseline: 'middle',
      });
      text(ctx, 'trained on its own thoughts', 560, 890, {
        size: 26, weight: 400, color: C.muted, alpha: bar2A * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 53

const fiftyThree = {
  id: 's53-rl-question',
  title: 'Does RL break?',
  start: start(76),
  end: start(77),
  draw(ctx, t) {
    const base = 0.9;
    const p2A = p(t, q.problem2, 0.6);
    const grpoA = p(t, q.grpo, 0.5);
    const likelyA = p(t, 788.4, 0.6);
    const softA = p(t, q.softmax, 0.6);
    const skipA = p(t, q.skip, 0.6);
    const breakA = p(t, q.rlBreak, 0.6);

    tag(ctx, 180, 220, 'problem two', { color: M.bug, alpha: p2A * 0.95, size: 30 });
    text(ctx, 'reinforcement learning needs chances', 960, 280, {
      size: 36, weight: 450, color: C.fg, align: 'center', alpha: likelyA * 0.95,
    });

    // GRPO card.
    card(ctx, 230, 350, 520, 320, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 18, alpha: base * (0.2 + 0.8 * grpoA),
    });
    text(ctx, 'GRPO', 270, 420, { size: 38, weight: 500, color: C.fg, alpha: 0.25 + 0.75 * grpoA });
    if (likelyA > 0.001) {
      const rows = [
        { label: 'cat', value: 0.72 },
        { label: 'dog', value: 0.19 },
        { label: 'sat', value: 0.09 },
      ];
      rows.forEach((r, i) => {
        text(ctx, r.label, 290, 490 + i * 52, {
          size: 28, weight: 400, color: C.muted, alpha: likelyA,
        });
        relativeBar(ctx, 380, 474 + i * 52, 300, 26, r.value, {
          color: M.gate, alpha: likelyA, progress: p(t, q.likely + i * 0.08, 0.5),
        });
      });
      tag(ctx, 270, 640, 'needs the chances', { color: M.gate, alpha: likelyA * 0.9, size: 26 });
    }

    // Silent card.
    card(ctx, 1170, 350, 520, 320, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 18, alpha: base * (0.2 + 0.8 * skipA),
    });
    text(ctx, 'silent step', 1210, 420, { size: 38, weight: 500, color: C.fg, alpha: 0.25 + 0.75 * skipA });
    if (skipA > 0.001) {
      gate(ctx, 1410, 540, 110, 180, { alpha: 0.3, open: 0.8, accent: M.gate });
      line(ctx, 1350, 470, 1470, 610, { color: M.bug, width: 3, alpha: skipA * 0.85, rough: 0.4 });
      tag(ctx, 1210, 640, 'no softmax · no chance', { color: M.bug, alpha: skipA * 0.9, size: 26 });
    }

    text(ctx, '?', 960, 560, {
      size: 130, weight: 500, color: M.logits, align: 'center', alpha: breakA * 0.9,
    });
    if (breakA > 0.001) {
      text(ctx, 'does RL break?', 960, 860, {
        size: 58, weight: 500, color: C.fg, align: 'center', alpha: breakA, ls: -1,
      });
    }
  },
};

// ---------------------------------------------------------------- 54

const fiftyFour = {
  id: 's54-probability-one',
  title: 'Probability one',
  start: start(77),
  end: start(78),
  draw(ctx, t) {
    const base = 0.9;
    const detA = p(t, q.deterministic, 0.6);
    const oneA = p(t, q.exactlyOne, 0.6);
    const multA = p(t, q.multiply, 0.6);
    const chancesA = p(t, q.chances, 0.6);
    const replayA = p(t, q.replay, 0.7);
    const factorA = p(t, q.factor, 0.6);
    const rollA = p(t, q.rollout, 0.6);

    text(ctx, 'silent steps are deterministic', 960, 220, {
      size: 40, weight: 450, color: C.fg, align: 'center', alpha: detA, ls: -0.5,
    });

    // Three silent steps, each ×1.
    for (let i = 0; i < 3; i++) {
      const x = 280 + i * 300;
      card(ctx, x, 330, 210, 90, {
        fill: 'rgba(189,147,249,0.10)', stroke: 'rgba(189,147,249,0.4)', r: 14,
        alpha: base * (0.2 + 0.8 * detA),
      });
      text(ctx, 'silent', x + 105, 386, {
        size: 30, weight: 500, color: M.thought, align: 'center', alpha: 0.25 + 0.75 * detA,
      });
      if (i < 2) {
        text(ctx, '\u00d7 1', x + 255, 388, {
          size: 32, weight: 500, color: C.green, align: 'center', alpha: multA,
        });
      }
    }
    if (oneA > 0.001) {
      text(ctx, 'p = 1', 1390, 420, {
        size: 76, weight: 500, color: C.green, align: 'center', alpha: oneA, ls: -2,
      });
      text(ctx, 'nothing changes', 1390, 476, {
        size: 28, weight: 400, color: C.muted, align: 'center', alpha: oneA * 0.9,
      });
    }

    // Text tokens still need chances.
    if (chancesA > 0.001) {
      card(ctx, 240, 580, 560, 220, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 18, alpha: base * chancesA * 0.9,
      });
      text(ctx, 'text token', 280, 646, {
        size: 32, weight: 500, color: C.fg, alpha: chancesA,
      });
      relativeBar(ctx, 420, 630, 320, 26, 0.72, {
        color: M.gate, alpha: chancesA, progress: p(t, q.chances + 0.2, 0.6),
      });
      text(ctx, '0.72', 760, 646, {
        size: 28, weight: 500, color: M.gate, alpha: chancesA, baseline: 'middle',
      });
      text(ctx, 'only the text tokens need a chance', 280, 730, {
        size: 26, weight: 400, color: C.muted, alpha: chancesA * 0.9,
      });
    }

    if (replayA > 0.001) {
      const pts = [[830, 690], [1200, 690], [1200, 580], [840, 580]];
      strokePath(ctx, pts, {
        color: 'rgba(139,233,253,0.55)', width: 2.2, alpha: replayA, rough: 0.2,
      });
      arrow(ctx, 1180, 640, 1198, 590, {
        color: 'rgba(139,233,253,0.8)', width: 2, progress: replayA, head: 9,
      });
      pathFlow(ctx, pts, {
        color: M.gate, alpha: replayA * 0.8, progress: 1, n: 7, t, size: 4, speed: 0.1, seed: 2,
      });
      text(ctx, 'replay the same silent thoughts', 1020, 760, {
        size: 28, weight: 400, color: C.gate, align: 'center', alpha: replayA * 0.95,
      });
    }

    if (factorA > 0.001) {
      text(ctx, 'hybrid policy factorization', 960, 860, {
        size: 42, weight: 500, color: C.fg, align: 'center', alpha: factorA, ls: -0.5,
      });
    }
    if (rollA > 0.001) {
      tag(ctx, 960, 916, 'exact rollout replay', {
        color: M.gate, alpha: rollA * 0.95, size: 28, align: 'center',
      });
    }
  },
};

// ---------------------------------------------------------------- 55

const fiftyFive = {
  id: 's55-which-steps',
  title: 'Which steps go silent',
  start: start(78),
  end: 849.6,
  draw(ctx, t) {
    const base = 0.9;
    const whichA = p(t, q.which, 0.6);
    const entA = p(t, q.entropy, 0.6);
    const toolsA = p(t, q.tools, 0.6);
    const rewardA = p(t, q.noReward, 0.6);
    const onlyA = p(t, q.only, 0.6);
    const driftA = p(t, q.own, 0.8);

    tag(ctx, 180, 220, 'which steps go silent?', {
      color: C.muted, alpha: whichA * 0.9, size: 30,
    });

    // Steps and entropy.
    const rows = [
      { label: 'step 1', e: 0.18, silent: true },
      { label: 'step 2', e: 0.62, silent: false },
      { label: 'step 3', e: 0.15, silent: true },
      { label: 'step 4', e: 0.21, silent: true },
      { label: 'tool call', e: 0.72, silent: false },
      { label: 'key choice', e: 0.66, silent: false },
    ];
    rows.forEach((r, i) => {
      const yy = 300 + i * 78;
      const a = base * p(t, q.which + i * 0.06, 0.4);
      text(ctx, r.label, 210, yy + 22, {
        size: 30, weight: 400, color: C.muted, alpha: a,
      });
      relativeBar(ctx, 380, yy, 340, 26, r.e, {
        color: r.e > 0.4 ? M.word : M.thought, alpha: a, progress: p(t, q.which + 0.2, 0.6),
      });
      const tagA = r.silent ? entA : toolsA;
      if (tagA > 0.001) {
        tag(ctx, 780, yy + 16, r.silent ? 'silent' : 'text', {
          color: r.silent ? M.thought : M.word, alpha: tagA * 0.9, size: 25,
        });
      }
    });

    // Rewards.
    if (rewardA > 0.001) {
      card(ctx, 1080, 300, 620, 300, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 18, alpha: base * rewardA * 0.85,
      });
      text(ctx, 'RL rewards', 1120, 364, {
        size: 32, weight: 500, color: C.fg, alpha: rewardA,
      });
      if (onlyA > 0.001) {
        ['correct answer', 'format', 'tool use'].forEach((r, i) => {
          chip(ctx, 1120, 426 + i * 54, r, {
            size: 26, color: C.green, border: 'rgba(80,250,123,0.3)',
            bg: 'rgba(49,51,66,0.5)', alpha: onlyA,
          });
        });
        text(ctx, 'no reward for going quiet', 1120, 580, {
          size: 26, weight: 400, color: M.bug, alpha: onlyA * 0.9,
        });
      }
    }

    // Drift toward silence.
    if (driftA > 0.001) {
      const dw = 1100;
      card(ctx, 300, 840, dw, 16, {
        fill: 'rgba(248,248,242,0.08)', stroke: null, r: 8, alpha: base * 0.8,
      });
      const f = 0.15 + 0.7 * driftA;
      card(ctx, 300, 840, dw * f, 16, {
        fill: M.thought, stroke: null, r: 8, alpha: base * 0.85,
      });
      text(ctx, 'all text', 300, 812, { size: 26, color: C.word, alpha: driftA * 0.8 });
      text(ctx, 'mostly silent', 1400, 812, { size: 26, color: M.thought, alpha: driftA * 0.8, align: 'right' });
      text(ctx, 'nobody paid it to go quiet', 960, 916, {
        size: 30, weight: 400, color: C.muted, align: 'center', alpha: driftA * 0.95,
      });
    }
  },
};

export default [fortyEight, fortyNine, fifty, fiftyOne, fiftyTwo, fiftyThree, fiftyFour, fiftyFive];
