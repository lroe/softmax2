import {
  C, F, W, H, clamp, lerp, p, enter, easeInOut, card, text, line, arrow,
  strokePath, underline, measure, rr, icon,
} from '../kit.js';
import {
  M, tag, chip, statement, gate, leak, flow, pathFlow, thoughtRow, wordPill,
  relativeBar, axes, pageStack, painting, tool, MONO,
} from '../motifs.js';
import { at, start } from '../data/timeline.js';

const q = {
  second: at('second weak spot', 57),
  pick: at('pick-a-word', 57),
  why: at('why does a model', 58),
  writeThought: at('write down every thought', 58),
  nobody: at('nobody asked', 58),

  reasoning: at('reasoning model thinks', 59),
  writes: at('it writes', 59),
  pages: at('page after page', 59),
  thinking: at('that text is the thinking', 59),
  works: at('it works', 59),
  writeMore: at('write more', 59),
  price: at('price', 59),
  trip: at('one full trip', 59),

  eachWord: at('at each word', 60),
  rich: at('rich thought', 60),
  thousands: at('thousands of numbers', 60),
  squeezes: at('squeezes it', 60),
  tens: at('tens of thousands', 60),
  turned: at('turned back into numbers', 60),

  paint: at('describing a painting', 61),
  dictionary: at('one word from a dictionary', 61),

  skip: at('skip the squeeze', 62),
  feed: at('feed it straight back', 62),
  own: at('own language', 62),
  latent: at('latent reasoning', 62),
  hidden: at('latent just means hidden', 62),
  paper2024: at('2024 paper', 63),
  coconut: at('Coconut', 63),
  faster: at('faster', 63),
  room: at('hold far more', 63),

  problems: at('three problems', 64),
  tools: at('no tools', 65),
  search: at('search the web', 65),
  read: at("can't read it", 66),
  blackBox: at('black box', 66),
  mismatch: at('a mismatch', 67),
  space: at('different space', 67),
  shaky: at('shaky', 67),

  brutal: at('numbers are brutal', 68),
  gaia: at('Gaia', 68),
  eightB: at('8-billion', 68),
  coconutScores: at('Coconut scores', 68),
  three9: at('3.9', 68),
  normalAgent: at('normal text agent', 68),
  range: at('32 to 39', 68),
  silence: at('silence alone', 68),
  act: at('act in the world', 68),

  hybrid: at('Hybrid Reasoning Agents', 69),
  stanford: at('Stanford', 69),
  together: at('Together AI', 69),
  uiuc: at('U I U C', 69),
  meta: at('Meta', 69),
  thinkLatent: at('think in latent', 69),
  actText: at('act in text', 69),
};

// ---------------------------------------------------------------- 41

const fortyOne = {
  id: 's41-pick',
  title: 'The pick-a-word step',
  start: start(57),
  end: start(59),
  draw(ctx, t) {
    const base = 0.9;
    const secondA = p(t, q.second, 0.6);
    const pickA = p(t, q.pick, 0.5);
    const whyA = p(t, q.why, 0.6);
    const writeA = p(t, q.writeThought, 0.5);
    const nobodyA = p(t, q.nobody, 0.6);

    tag(ctx, 190, 220, 'the second weak spot', {
      color: M.bug, alpha: secondA * 0.9, size: 30,
    });
    text(ctx, 'the pick-a-word step', 190, 290, {
      size: 46, weight: 450, color: C.fg, alpha: pickA, ls: -0.6,
    });

    // Thought goes in, one word comes out.
    if (p(t, q.second + 0.2, 0.7) < 0.99) {
      thoughtRow(ctx, 260, 470, 460, 60, {
        cells: 18, color: C.dim, alpha: base * 0.2, progress: 0.7,
      });
    }
    thoughtRow(ctx, 260, 470, 460, 60, {
      cells: 18, color: M.thought, alpha: base * 0.85, progress: p(t, q.second + 0.2, 0.7),
    });
    gate(ctx, 870, 500, 180, 320, {
      alpha: base * 0.9, open: 0.9, accent: M.gate, label: null,
    });
    text(ctx, 'softmax', 870, 700, {
      size: 32, weight: 400, color: C.muted, align: 'center', alpha: base * 0.85,
    });
    arrow(ctx, 730, 500, 772, 500, {
      color: 'rgba(248,248,242,0.3)', width: 2, progress: base, head: 9,
    });
    wordPill(ctx, 1040, 464, 'cat', { size: 40, alpha: p(t, q.pick + 0.3, 0.5) });
    tag(ctx, 1040, 560, 'one word', { color: C.dim, alpha: pickA * 0.85, size: 27 });

    // The other words, thrown away.
    ['dog', 'sat', 'the', 'mat'].forEach((w, i) => {
      text(ctx, w, 1080 + i * 82, 630, {
        size: 30, weight: 400, color: C.muted, alpha: base * 0.3,
      });
    });

    if (whyA > 0.001) {
      text(ctx, 'why?', 1540, 500, {
        size: 120, weight: 500, color: M.thought, align: 'center', alpha: whyA, ls: -4,
      });
    }
    if (writeA > 0.001) {
      text(ctx, 'why write down every thought?', 960, 810, {
        size: 40, weight: 450, color: C.fg, align: 'center', alpha: writeA * 0.95,
      });
    }
    if (nobodyA > 0.001) {
      text(ctx, 'for a long time, nobody asked', 960, 870, {
        size: 30, weight: 400, color: C.muted, align: 'center', alpha: nobodyA * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 42

const fortyTwo = {
  id: 's42-writing',
  title: 'Page after page',
  start: start(59),
  end: start(60),
  draw(ctx, t) {
    const base = 0.9;
    const pagesA = p(t, q.writes, 0.6);
    const thinkingA = p(t, q.thinking, 0.6);
    const worksA = p(t, q.works, 0.5);
    const priceA = p(t, q.price, 0.6);
    const tripA = p(t, q.trip, 0.6);

    tag(ctx, 200, 220, 'reasoning models write', { color: C.muted, alpha: pagesA * 0.9, size: 30 });

    pageStack(ctx, 200, 310, 430, 520, 5, {
      alpha: 0.2 + 0.8 * pagesA, color: M.word, progress: p(t, q.pages, 1.2), lines: 11,
    });
    tag(ctx, 200, 880, 'page after page', { color: M.word, alpha: pagesA * 0.9, size: 30 });

    // One word, one full trip.
    card(ctx, 920, 340, 330, 150, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 18,
      accent: M.gate, accentW: 3, alpha: base,
    });
    text(ctx, 'model', 956, 420, { size: 38, weight: 500, color: C.fg, alpha: base });
    wordPill(ctx, 790, 384, 'word', { size: 30, alpha: tripA });
    arrow(ctx, 870, 410, 912, 410, {
      color: 'rgba(248,248,242,0.3)', width: 1.8, progress: tripA, head: 8,
    });
    if (tripA < 0.99) {
      strokePath(ctx, [[1260, 430], [1470, 430], [1470, 650], [720, 650], [720, 440]], {
        color: 'rgba(139,233,253,0.3)', width: 2, alpha: base * 0.18, rough: 0.2, dash: [8, 8],
      });
    }
    if (tripA > 0.001) {
      strokePath(ctx, [[1260, 430], [1470, 430], [1470, 650], [720, 650], [720, 440]], {
        color: 'rgba(139,233,253,0.55)', width: 2.4, alpha: tripA, rough: 0.3,
      });
      arrow(ctx, 720, 610, 720, 444, {
        color: 'rgba(139,233,253,0.8)', width: 2.2, progress: p(t, q.trip + 0.4, 0.4), head: 11,
      });
      pathFlow(ctx, [[1470, 430], [1470, 650], [720, 650], [720, 440]], {
        color: M.gate, alpha: tripA * 0.8, progress: 1, n: 8, t, size: 4, speed: 0.1, seed: 3,
      });
      text(ctx, '1 word = 1 full trip', 960, 740, {
        size: 42, weight: 500, color: M.gate, align: 'center', alpha: tripA, ls: -0.5,
      });
    }

    if (thinkingA > 0.001) {
      text(ctx, 'the text is the thinking', 960, 840, {
        size: 34, weight: 400, color: C.muted, align: 'center',
        alpha: thinkingA * (1 - 0.5 * priceA) * 0.9,
      });
    }
    if (worksA > 0.001) {
      tag(ctx, 960, 890, 'it works', {
        color: C.green, alpha: worksA * 0.95, size: 30, align: 'center',
      });
    }
    if (priceA > 0.001) {
      text(ctx, 'but there is a price', 960, 950, {
        size: 34, weight: 400, color: M.word, align: 'center', alpha: priceA * 0.95,
      });
    }
  },
};

// ---------------------------------------------------------------- 43

const fortyThree = {
  id: 's43-squeeze',
  title: 'One word from a dictionary',
  start: start(60),
  end: start(62),
  draw(ctx, t) {
    const base = 0.9;
    const thingA = p(t, q.squeezes, 0.6);
    const tensA = p(t, q.tens, 0.6);
    const paintA = p(t, q.paint, 0.7);
    const dictA = p(t, q.dictionary, 0.6);
    const dim = 1 - p(t, q.paint, 0.5);

    // Phase one: the squeeze.
    ctx.save();
    ctx.globalAlpha = dim;
    if (p(t, q.rich, 0.8) < 0.99) {
      thoughtRow(ctx, 260, 410, 620, 70, {
        cells: 24, color: C.dim, alpha: 0.2, progress: 0.7,
      });
    }
    tag(ctx, 260, 360, 'a rich thought', { color: M.thought, alpha: base * 0.9, size: 30 });
    thoughtRow(ctx, 260, 410, 620, 70, {
      cells: 24, color: M.thought, alpha: 0.95, progress: p(t, q.rich, 0.8),
    });
    gate(ctx, 980, 450, 160, 300, {
      alpha: 0.9, open: 0.9, accent: M.gate, label: null,
    });
    line(ctx, 886, 445, 898, 445, {
      color: 'rgba(248,248,242,0.4)', width: 2, progress: thingA, rough: 0,
    });
    wordPill(ctx, 1090, 420, 'cat', { size: 36, alpha: p(t, q.squeezes + 0.3, 0.5) });
    text(ctx, 'thousands of numbers', 260, 530, {
      size: 30, weight: 400, color: C.muted, alpha: p(t, q.thousands, 0.6) * 0.9,
    });
    if (tensA > 0.001) {
      text(ctx, 'one pick from tens of thousands', 1090, 560, {
        size: 30, weight: 400, color: C.muted, alpha: tensA * 0.9,
      });
      text(ctx, 'then back to numbers', 1090, 604, {
        size: 28, weight: 400, color: C.dim, alpha: p(t, q.turned, 0.6) * 0.9,
      });
    }
    ctx.restore();

    // Phase two: the painting and the dictionary.
    if (paintA > 0.001) {
      painting(ctx, 500, 280, 560, 440, {
        alpha: paintA, progress: paintA, label: null,
      });
      tag(ctx, 500, 770, 'a painting', { color: C.muted, alpha: paintA * 0.9, size: 28 });

      // Dictionary words.
      const words = ['warm', 'dusk', 'hill', 'quiet', 'orange'];
      words.forEach((w, i) => {
        const yy = 330 + i * 78;
        const a = dictA * p(t, q.dictionary + i * 0.08, 0.4);
        text(ctx, w, 1240, yy, {
          size: 34, weight: i === 0 ? 500 : 400,
          color: i === 0 ? M.word : C.muted, alpha: a,
        });
        if (i < words.length - 1) {
          line(ctx, 1240, yy + 22, 1640, yy + 22, {
            color: 'rgba(248,248,242,0.08)', width: 1.2, rough: 0, alpha: a * 0.8,
          });
        }
      });
      if (dictA > 0.5) {
        wordPill(ctx, 1360, 330, 'warm', { size: 32, alpha: dictA });
        text(ctx, 'one word', 1360, 400, {
          size: 26, weight: 400, color: C.dim, align: 'center', alpha: dictA * 0.9,
        });
      }
      text(ctx, 'describing a painting', 960, 870, {
        size: 44, weight: 450, color: C.fg, align: 'center', alpha: paintA,
      });
      text(ctx, 'by picking one word from a dictionary', 960, 926, {
        size: 30, weight: 400, color: C.muted, align: 'center', alpha: dictA * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 44

const fortyFour = {
  id: 's44-latent',
  title: 'Latent reasoning',
  start: start(62),
  end: start(64),
  draw(ctx, t) {
    const base = 0.9;
    const skipA = p(t, q.skip, 0.6);
    const feedA = p(t, q.feed, 0.7);
    const ownA = p(t, q.own, 0.6);
    const latentA = p(t, q.latent, 0.6);
    const hiddenA = p(t, q.hidden, 0.6);
    const coconutA = p(t, q.coconut, 0.6);
    const fasterA = p(t, q.faster, 0.5);
    const roomA = p(t, q.room, 0.5);

    // Model.
    card(ctx, 760, 430, 400, 200, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 22,
      accent: M.thought, accentW: 3, alpha: base,
    });
    text(ctx, 'model', 800, 508, { size: 44, weight: 500, color: C.fg, alpha: base });
    text(ctx, 'no words', 800, 558, { size: 30, weight: 400, color: M.thought, alpha: feedA });

    // The gate that is skipped.
    gate(ctx, 1380, 510, 170, 310, {
      alpha: base * (0.55 - 0.35 * skipA), open: 0.9, accent: M.gate, label: null,
    });
    text(ctx, 'softmax', 1380, 700, {
      size: 28, weight: 400, color: C.dim, align: 'center', alpha: base * (0.6 - 0.3 * skipA),
    });
    text(ctx, 'skipped', 1380, 760, {
      size: 30, weight: 500, color: M.bug, align: 'center', alpha: skipA * 0.95,
    });

    // The looping thought.
    if (feedA < 0.99) {
      strokePath(ctx, [[860, 430], [860, 270], [1060, 270], [1060, 430]], {
        color: 'rgba(189,147,249,0.4)', width: 2, alpha: base * 0.18, rough: 0.2, dash: [8, 8],
      });
      thoughtRow(ctx, 760, 680, 600, 54, {
        cells: 16, color: C.dim, alpha: base * 0.16, progress: 1,
      });
    }
    if (feedA > 0.001) {
      const pts = [[860, 430], [860, 270], [1060, 270], [1060, 430]];
      strokePath(ctx, pts, {
        color: 'rgba(189,147,249,0.55)', width: 2.4, alpha: feedA,
        progress: p(t, q.feed, 0.8), rough: 0.3,
      });
      pathFlow(ctx, pts, {
        color: M.thought, alpha: feedA * 0.9, progress: p(t, q.feed, 0.8),
        n: 10, t, size: 5, speed: 0.12, seed: 5,
      });
      arrow(ctx, 1060, 350, 1060, 432, {
        color: 'rgba(189,147,249,0.8)', width: 2.2, progress: p(t, q.feed + 0.4, 0.3), head: 11,
      });
      thoughtRow(ctx, 760, 680, 600, 54, {
        cells: 16, color: M.thought, alpha: feedA * 0.9, progress: 1,
      });
      text(ctx, 'the thought goes straight back in', 960, 790, {
        size: 30, weight: 400, color: C.muted, align: 'center', alpha: feedA * 0.95,
      });
    }

    if (ownA > 0.001) {
      text(ctx, 'its own language', 960, 200, {
        size: 40, weight: 450, color: M.thought, align: 'center', alpha: ownA,
      });
    }
    if (latentA > 0.001) {
      text(ctx, 'latent reasoning', 960, 880, {
        size: 44, weight: 500, color: C.fg, align: 'center', alpha: latentA, ls: -0.5,
      });
    }
    if (hiddenA > 0.001) {
      tag(ctx, 960, 936, 'latent = hidden', {
        color: C.dim, alpha: hiddenA * 0.9, size: 28, align: 'center',
      });
    }

    // Coconut.
    if (coconutA > 0.001) {
      card(ctx, 1180, 760, 560, 160, {
        fill: C.surface, stroke: 'rgba(189,147,249,0.35)', r: 18,
        accent: M.thought, accentW: 3, alpha: base * coconutA * 0.9,
      });
      text(ctx, 'Coconut · 2024', 1216, 820, {
        size: 34, weight: 500, color: C.fg, alpha: coconutA,
      });
      text(ctx, 'faster', 1216, 870, {
        size: 28, weight: 400, color: C.green, alpha: coconutA * fasterA,
      });
      text(ctx, 'more room per thought', 1216, 908, {
        size: 28, weight: 400, color: C.muted, alpha: coconutA * roomA,
      });
    }
  },
};

// ---------------------------------------------------------------- 45

const fortyFive = {
  id: 's45-three-problems',
  title: 'Three problems',
  start: start(64),
  end: start(68),
  draw(ctx, t) {
    const base = 0.9;
    const threeA = p(t, q.problems, 0.6);
    const toolA = p(t, q.tools, 0.6);
    const readA = p(t, q.read, 0.6);
    const misA = p(t, q.mismatch, 0.6);
    const shakeA = p(t, q.shaky, 0.6);

    text(ctx, 'three problems', 960, 220, {
      size: 42, weight: 450, color: C.muted, align: 'center', alpha: threeA * 0.95,
    });

    const xs = [180, 700, 1220];
    const w = 480;
    const h = 450;

    // Card 1: no tools.
    card(ctx, xs[0], 300, w, h, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
      accent: M.bug, accentW: 3, alpha: base * (0.28 + 0.72 * toolA),
    });
    tool(ctx, xs[0] + w / 2 - 45, 380, 90, { color: C.muted, alpha: toolA * 0.9 });
    if (toolA > 0.001) {
      line(ctx, xs[0] + 190, 380, xs[0] + 290, 460, {
        color: M.bug, width: 4, alpha: p(t, q.tools + 0.4, 0.4), rough: 0,
      });
    }
    text(ctx, 'no tools', xs[0] + 34, 610, {
      size: 40, weight: 500, color: C.fg, alpha: toolA,
    });
    text(ctx, 'silent thoughts can\u2019t search or run code', xs[0] + 34, 662, {
      size: 27, weight: 400, color: C.muted, alpha: toolA * 0.9,
    });

    // Card 2: can't read it.
    card(ctx, xs[1], 300, w, h, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
      accent: M.word, accentW: 3, alpha: base * (0.28 + 0.72 * readA),
    });
    thoughtRow(ctx, xs[1] + 40, 410, 400, 50, {
      cells: 12, color: M.thought, alpha: (0.18 + 0.82 * readA) * 0.9, progress: readA,
    });
    icon(ctx, 'lock', xs[1] + w / 2 - 40, 360, 80, { color: C.fg, alpha: readA * 0.9, width: 3 });
    text(ctx, 'can\u2019t read it', xs[1] + 34, 610, {
      size: 40, weight: 500, color: C.fg, alpha: readA,
    });
    text(ctx, 'a vector is a black box', xs[1] + 34, 662, {
      size: 27, weight: 400, color: C.muted, alpha: readA * p(t, q.blackBox, 0.5) * 0.9,
    });

    // Card 3: mismatch.
    card(ctx, xs[2], 300, w, h, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
      accent: M.correct, accentW: 3, alpha: base * (0.28 + 0.72 * misA),
    });
    // two grids, offset
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        rr(ctx, xs[2] + 90 + i * 40, 360 + j * 34, 28, 24, 4);
        ctx.strokeStyle = 'rgba(139,233,253,0.45)';
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = misA;
        ctx.stroke();
      }
    }
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        rr(ctx, xs[2] + 150 + i * 40, 440 + j * 34, 28, 24, 4);
        ctx.strokeStyle = 'rgba(189,147,249,0.55)';
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = misA;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    text(ctx, 'a mismatch', xs[2] + 34, 610, {
      size: 40, weight: 500, color: C.fg, alpha: misA,
    });
    text(ctx, 'a different space', xs[2] + 34, 662, {
      size: 27, weight: 400, color: C.muted, alpha: misA * p(t, q.space, 0.5) * 0.9,
    });
    if (shakeA > 0.001) {
      tag(ctx, xs[2] + w - 34, 700, 'shaky', {
        color: M.bug, alpha: shakeA * 0.95, size: 28, align: 'right',
      });
    }
  },
};

// ---------------------------------------------------------------- 46

const fortySix = {
  id: 's46-gaia',
  title: 'Gaia collapses without text',
  start: start(68),
  end: start(69),
  draw(ctx, t) {
    const base = 0.9;
    const gaiaA = p(t, q.gaia, 0.6);
    const bA = p(t, q.eightB, 0.5);
    const cocoA = p(t, q.coconutScores, 0.5);
    const valA = p(t, q.three9, 0.5);
    const normA = p(t, q.normalAgent, 0.5);
    const rangeA = p(t, q.range, 0.6);
    const silenceA = p(t, q.silence, 0.6);

    text(ctx, 'Gaia', 960, 220, {
      size: 46, weight: 500, color: C.fg, align: 'center', alpha: 0.3 + 0.7 * gaiaA, ls: -0.6,
    });
    tag(ctx, 960, 270, 'a hard agent benchmark', {
      color: C.dim, alpha: (0.3 + 0.7 * bA) * 0.9, size: 28, align: 'center',
    });
    chip(ctx, 220, 220, '8B', {
      size: 28, color: M.logits, border: 'rgba(241,250,140,0.35)',
      bg: 'rgba(49,51,66,0.5)', alpha: 0.3 + 0.7 * bA,
    });

    const x0 = 460;
    const x1 = 1600;
    const scale = (v) => x0 + (v / 40) * (x1 - x0);

    // Ghost bars set the layout before the values land.
    card(ctx, x0, 378, scale(3.9) - x0, 44, {
      fill: 'rgba(255,85,85,0.22)', stroke: null, r: 8, alpha: base * 0.3,
    });
    card(ctx, scale(32), 514, scale(39) - scale(32), 44, {
      fill: 'rgba(80,250,123,0.18)', stroke: null, r: 8, alpha: base * 0.3,
    });

    // Ghost axis.
    line(ctx, x0, 620, x1, 620, {
      color: 'rgba(248,248,242,0.14)', width: 1.4, rough: 0, alpha: base * 0.7,
    });
    [0, 10, 20, 30, 40].forEach((v) => {
      line(ctx, scale(v), 620, scale(v), 634, {
        color: 'rgba(248,248,242,0.18)', width: 1.2, rough: 0, alpha: base * 0.6,
      });
      text(ctx, String(v), scale(v), 668, {
        size: 26, weight: 400, color: C.dim, align: 'center', alpha: base * 0.65,
      });
    });

    // Coconut bar.
    text(ctx, 'Coconut', 430, 400, {
      size: 34, weight: 500, color: C.fg, align: 'right', alpha: 0.3 + 0.7 * cocoA,
    });
    if (cocoA > 0.001) {
      card(ctx, x0, 378, Math.max(4, (scale(3.9) - x0) * p(t, q.three9, 0.7)), 44, {
        fill: M.bug, stroke: null, r: 8, alpha: cocoA * 0.85,
      });
      text(ctx, '3.9', scale(3.9) + 18, 402, {
        size: 44, weight: 500, color: M.bug, alpha: valA, baseline: 'middle',
      });
    }

    // Text agent bar, 32-39.
    text(ctx, 'text agent + RL', 430, 540, {
      size: 34, weight: 500, color: C.fg, align: 'right', alpha: 0.3 + 0.7 * normA,
    });
    if (normA > 0.001) {
      const r0 = scale(32);
      const r1 = scale(39);
      card(ctx, r0, 514, Math.max(4, (r1 - r0) * p(t, q.range, 0.7)), 44, {
        fill: M.correct, stroke: null, r: 8, alpha: normA * 0.85,
      });
      // end caps to read as a range
      line(ctx, r0, 500, r0, 572, { color: M.correct, width: 2, rough: 0, alpha: rangeA * 0.8 });
      line(ctx, r1, 500, r1, 572, { color: M.correct, width: 2, rough: 0, alpha: rangeA * 0.8 });
      text(ctx, '32\u201339', r1 + 18, 538, {
        size: 44, weight: 500, color: M.correct, alpha: rangeA, baseline: 'middle',
      });
    }

    if (silenceA > 0.001) {
      text(ctx, 'silence alone collapses', 960, 850, {
        size: 46, weight: 500, color: M.bug, align: 'center', alpha: silenceA, ls: -0.7,
      });
      text(ctx, 'the moment it has to act', 960, 906, {
        size: 30, weight: 400, color: C.muted, align: 'center',
        alpha: p(t, q.act, 0.6) * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 47

const fortySeven = {
  id: 's47-hybrid-idea',
  title: 'Think in latent, act in text',
  start: start(69),
  end: start(70),
  draw(ctx, t) {
    const base = 0.9;
    const titleA = p(t, q.hybrid, 0.6);
    const labsA = p(t, q.stanford, 0.5);
    const thinkA = p(t, q.thinkLatent, 0.6);
    const actA = p(t, q.actText, 0.6);

    text(ctx, 'Hybrid Reasoning Agents', 960, 220, {
      size: 46, weight: 500, color: C.fg, align: 'center', alpha: titleA, ls: -0.6,
    });
    const labs = ['Stanford', 'Together AI', 'UIUC', 'Meta'];
    labs.forEach((l, i) => {
      const a = labsA * p(t, q.stanford + i * 0.14, 0.4);
      text(ctx, l, 770 + i * 130, 280, {
        size: 26, weight: 400, color: C.muted, align: 'center', alpha: a,
      });
    });

    // Left: latent.
    card(ctx, 180, 340, 700, 470, {
      fill: C.surface, stroke: 'rgba(189,147,249,0.3)', r: 22,
      accent: M.thought, accentW: 3, alpha: base * (0.3 + 0.7 * thinkA),
    });
    text(ctx, 'think in latent', 220, 430, {
      size: 44, weight: 500, color: C.fg, alpha: 0.25 + 0.75 * thinkA,
    });
    thoughtRow(ctx, 220, 500, 620, 64, {
      cells: 20, color: M.thought, alpha: thinkA * 0.9, progress: p(t, q.thinkLatent + 0.2, 0.7),
    });
    if (thinkA > 0.2) {
      strokePath(ctx, [[520, 640], [520, 690], [700, 690], [700, 640]], {
        color: 'rgba(189,147,249,0.55)', width: 2.2, alpha: thinkA * 0.8, rough: 0.2,
      });
      text(ctx, 'no words', 520, 736, {
        size: 28, weight: 400, color: M.thought, align: 'center', alpha: thinkA * 0.85,
      });
    }

    // Right: text.
    card(ctx, 1040, 340, 700, 470, {
      fill: C.surface, stroke: 'rgba(255,184,108,0.3)', r: 22,
      accent: M.word, accentW: 3, alpha: base * (0.3 + 0.7 * actA),
    });
    text(ctx, 'act in text', 1080, 430, {
      size: 44, weight: 500, color: C.fg, alpha: 0.25 + 0.75 * actA,
    });
    if (actA > 0.2) {
      wordPill(ctx, 1080, 510, 'tool', { size: 32, alpha: actA });
      wordPill(ctx, 1210, 510, 'call', { size: 32, alpha: actA * 0.9 });
      tool(ctx, 1440, 490, 70, { color: C.muted, alpha: actA * 0.9 });
      text(ctx, 'only when it needs a tool', 1080, 620, {
        size: 28, weight: 400, color: C.muted, alpha: actA * 0.9,
      });
    }

    // Center line.
    if (thinkA > 0.2 && actA > 0.2) {
      line(ctx, 900, 560, 1020, 560, {
        color: 'rgba(248,248,242,0.25)', width: 1.6, rough: 0, alpha: 0.8,
      });
    }

    text(ctx, 'say what matters, think the rest in silence', 960, 900, {
      size: 34, weight: 400, color: C.muted, align: 'center',
      alpha: Math.min(thinkA, actA) * 0.95,
    });
  },
};

export default [fortyOne, fortyTwo, fortyThree, fortyFour, fortyFive, fortySix, fortySeven];
