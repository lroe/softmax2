import {
  C, F, W, H, clamp, lerp, p, enter, easeOutCubic, easeInOut, card, text, line,
  arrow, strokePath, underline, measure, numberedChip, rr, count,
} from '../kit.js';
import {
  M, tag, chip, statement, gate, flow, pathFlow, thoughtRow, wordPill,
  stepTracker, relativeBar, probList, stat, scoreList,
} from '../motifs.js';
import { at, start } from '../data/timeline.js';

const q = {
  job: at('does one job', 13),
  reads: at('reads some text', 13),
  guesses: at('guesses the next word', 13),
  adds: at('adds that word', 13),
  again: at('guesses again', 13),
  whole: at("that's the whole loop", 13),

  inside: at('inside one guess', 14),
  threeSteps: at('three steps', 14),
  stepOne: at('step one', 15),
  thinks: at('the model thinks', 15),
  turns: at('turns your text', 15),
  thousands: at('thousands of them', 15),
  list: at('list is the', 15),
  hidden: at('hidden state', 15),

  stepTwo: at('step two', 16),
  scores: at('scores every word', 16),
  fifty: at('fifty thousand words', 16),
  fiftyScores: at('fifty thousand scores', 16),
  high: at('high score', 16),
  like: at('i like this word', 16),
  logits: at('logits', 16),

  stepThree: at('step three', 17),
  notChances: at('scores are not chances', 17),
  nine: at('score of nine', 17),
  minus9: at('minus nine', 17),
  ninety: at('ninety percent cat', 17),
  eight: at('eight percent dog', 17),
  machine: at('machine that turns', 17),
  softmax: at('that machine is softmax', 18),
  smallest: at('smallest example', 18),

  singers: at('three singers', 19),
  judges: at('judges give', 19),
  twoThings: at('softmax does two things', 19),
  first: at('first', 19),
  e: at('raising the number e', 19),
  second: at('second', 19),
  divide: at('divides by the total', 19),
  hundred: at('one hundred percent', 19),
  results: at('84', 19),
};

// ---------------------------------------------------------------- 09

const nine = {
  id: 's09-the-loop',
  title: 'The loop',
  start: 98.0,
  end: start(14),
  draw(ctx, t) {
    const base = 0.92;
    const readA = p(t, q.reads, 0.55);
    const guessA = p(t, q.guesses, 0.55);
    const addT = easeInOut(p(t, q.adds + 0.1, 0.9));
    const addA = p(t, q.adds, 0.5);
    const loopA = p(t, q.again, 0.8);
    const wholeA = p(t, q.whole, 0.55);

    // Ghost scaffold.
    const gh = base * 0.2;
    if (readA < 0.99) {
      card(ctx, 170, 460, 410, 170, {
        fill: 'rgba(49,51,66,0.25)', stroke: 'rgba(248,248,242,0.12)', r: 18,
        dash: [8, 8], alpha: gh,
      });
      card(ctx, 760, 440, 380, 200, {
        fill: 'rgba(49,51,66,0.25)', stroke: 'rgba(248,248,242,0.12)', r: 20,
        dash: [8, 8], alpha: gh,
      });
      card(ctx, 1350, 470, 230, 84, {
        fill: 'rgba(49,51,66,0.25)', stroke: 'rgba(255,184,108,0.25)', r: 42,
        dash: [8, 8], alpha: gh,
      });
      // ghost loop path
      strokePath(ctx, [[1480, 570], [1480, 740], [400, 740], [400, 640]], {
        color: 'rgba(139,233,253,0.4)', width: 2, alpha: gh, rough: 0.2, dash: [8, 8],
      });
      // ghost input words
      card(ctx, 202, 492, 88, 46, {
        fill: 'rgba(255,184,108,0.10)', stroke: 'rgba(255,184,108,0.22)', r: 23,
        alpha: gh * 1.3,
      });
      card(ctx, 312, 492, 82, 46, {
        fill: 'rgba(255,184,108,0.10)', stroke: 'rgba(255,184,108,0.22)', r: 23,
        alpha: gh * 1.3,
      });
    }

    // Text card.
    card(ctx, 170, 460, 410, 170, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.15)', r: 18, alpha: base * 0.95,
    });
    tag(ctx, 170, 426, 'text', { color: C.muted, alpha: base * 0.9, size: 30 });
    if (readA > 0.001) {
      wordPill(ctx, 202, 492, 'The', { size: 32, alpha: readA });
    }
    if (readA > 0.001) {
      wordPill(ctx, 312, 492, 'cat', { size: 32, alpha: readA * p(t, q.reads + 0.25, 0.4) });
    }
    if (addA > 0.001) {
      wordPill(ctx, 430, 492, 'sat', { size: 32, alpha: addA * 0.95 });
    }

    // Model.
    card(ctx, 760, 440, 380, 200, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 20,
      accent: M.gate, accentW: 3, alpha: base,
    });
    text(ctx, 'model', 800, 518, { size: 44, weight: 500, color: C.fg, alpha: base });
    text(ctx, 'one guess', 800, 570, { size: 30, weight: 400, color: C.muted, alpha: base * 0.9 });

    arrow(ctx, 588, 545, 742, 545, {
      color: 'rgba(248,248,242,0.5)', width: 2.2, progress: base, head: 10,
    });

    // The next word.
    tag(ctx, 1710, 426, 'next word', { color: M.word, align: 'right', alpha: guessA * 0.9, size: 30 });
    if (guessA > 0.001) {
      arrow(ctx, 1148, 545, 1330, 545, {
        color: 'rgba(248,248,242,0.5)', width: 2.2, progress: guessA, head: 10,
      });
      wordPill(ctx, 1360, 492, 'sat', { size: 38, alpha: guessA });
      tag(ctx, 1360, 600, 'guessed', { color: C.dim, alpha: guessA * 0.8, size: 27 });
    }

    // The copy that travels back into the input text.
    if (addT > 0.001 && addT < 0.999) {
      const x = lerp(1360, 430, addT);
      wordPill(ctx, x, 492, 'sat', { size: 32, alpha: Math.sin(addT * Math.PI) * 0.9 });
    }

    // The loop path.
    if (loopA > 0.001) {
      const pts = [[1480, 570], [1480, 740], [400, 740], [400, 640]];
      strokePath(ctx, pts, {
        color: 'rgba(139,233,253,0.75)', width: 2.8, alpha: loopA,
        progress: p(t, q.again, 0.8), rough: 0.3,
      });
      arrow(ctx, 400, 700, 400, 636, {
        color: 'rgba(139,233,253,0.8)', width: 2.2, progress: p(t, q.again + 0.55, 0.35), head: 12,
      });
      pathFlow(ctx, pts, {
        color: M.gate, alpha: loopA * 0.8, progress: p(t, q.again, 0.8),
        n: 10, t, size: 4.2, speed: 0.1, seed: 4,
      });
    }

    text(ctx, 'the whole loop', 960, 840, {
      size: 38, weight: 400, color: C.muted, align: 'center',
      alpha: wholeA * 0.95,
    });
  },
};

// ---------------------------------------------------------------- 10

const ten = {
  id: 's10-hidden-state',
  title: 'The thought is a long list of numbers',
  start: start(14),
  end: start(16) + 0.45,
  draw(ctx, t) {
    const base = p(t, q.inside - 0.2, 0.7);
    const stepA = p(t, q.stepOne, 0.5);
    const cardA = p(t, q.thinks, 0.6);
    const stripA = p(t, q.thousands, 1.2);
    const listA = p(t, q.list, 0.6);
    const hiddenA = p(t, q.hidden, 0.6);

    stepTracker(ctx, 1, { alpha: p(t, q.inside, 0.5) });

    // Input.
    card(ctx, 170, 330, 320, 120, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 16, alpha: base * 0.9,
    });
    wordPill(ctx, 202, 366, 'The', { size: 30, alpha: 0.2 + 0.8 * cardA });
    wordPill(ctx, 300, 366, 'cat', { size: 30, alpha: 0.2 + 0.8 * cardA * p(t, q.turns, 0.5) });

    // Model.
    card(ctx, 590, 310, 360, 160, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 20,
      accent: M.gate, accentW: 3, alpha: base,
    });
    text(ctx, 'model', 628, 380, { size: 40, weight: 500, color: C.fg, alpha: base });
    text(ctx, 'thinks', 628, 424, { size: 29, weight: 400, color: M.thought, alpha: cardA });
    arrow(ctx, 500, 390, 570, 390, {
      color: 'rgba(248,248,242,0.45)', width: 2, progress: base, head: 9,
    });
    arrow(ctx, 780, 472, 780, 512, {
      color: 'rgba(189,147,249,0.55)', width: 2.2, progress: p(t, q.thinks + 0.3, 0.6), head: 10,
    });

    // The thought strip.
    card(ctx, 240, 520, 1440, 130, {
      fill: C.well, stroke: 'rgba(189,147,249,0.30)', r: 14, lw: 1.4,
      alpha: base * 0.9,
    });
    thoughtRow(ctx, 272, 548, 1376, 74, {
      cells: 44, color: M.thought, alpha: 0.95, seed: 3,
      progress: stripA,
    });
    if (stripA < 0.7) {
      thoughtRow(ctx, 272, 548, 1376, 74, {
        cells: 44, color: C.dim, alpha: 0.22 * (1 - stripA / 0.7), seed: 3,
        progress: 0.6,
      });
    }

    text(ctx, 'the model\u2019s thought', 272, 500, {
      size: 32, weight: 400, color: M.muted, alpha: listA * 0.95,
    });
    tag(ctx, 1664, 500, 'thousands of numbers', {
      color: M.thought, alpha: p(t, q.thousands, 0.6) * 0.8, size: 29, align: 'right',
    });

    text(ctx, 'hidden state', 960, 742, {
      size: 52, weight: 500, color: C.fg, align: 'center', alpha: hiddenA,
    });
    const hw = measure(ctx, 'hidden state', 52, 500, F.display, 0);
    underline(ctx, 960 - hw / 2, 762, hw, {
      color: M.thought, width: 3, alpha: hiddenA * 0.85, progress: p(t, q.hidden + 0.1, 0.5),
    });
    text(ctx, 'researchers call it', 960, 812, {
      size: 30, weight: 400, color: C.dim, align: 'center', alpha: hiddenA * 0.9,
    });
  },
};

// ---------------------------------------------------------------- 11

const eleven = {
  id: 's11-logits',
  title: 'A score for every word',
  start: start(16) + 0.45,
  end: start(17),
  draw(ctx, t) {
    const base = p(t, q.stepTwo, 0.6);
    const rowsA = p(t, q.scores, 0.7);
    const fiftyA = p(t, q.fifty, 1.0);
    const fiftyScoresA = p(t, q.fiftyScores, 0.6);
    const highA = p(t, q.high, 0.6);
    const likeA = p(t, q.like, 0.5);
    const logitsA = p(t, q.logits, 0.6);

    stepTracker(ctx, 2, { alpha: p(t, q.stepTwo, 0.5) });

    // Scoreboard.
    card(ctx, 230, 300, 900, 500, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 18, alpha: base * 0.9,
    });
    tag(ctx, 274, 350, 'every word it knows', { color: C.muted, alpha: rowsA * 0.9, size: 29 });

    const rows = [
      { label: 'cat', f: 0.92 },
      { label: 'dog', f: 0.38 },
      { label: 'sat', f: 0.22 },
      { label: 'mat', f: 0.30 },
      { label: 'the', f: 0.08 },
      { label: 'a', f: 0.12 },
    ];
    if (rowsA < 0.99) {
      const gh = base * 0.16 * (1 - rowsA);
      rows.forEach((r, i) => {
        const yy = 400 + i * 62;
        text(ctx, r.label, 350, yy + 18, {
          size: 36, weight: 400, color: C.dim, align: 'right', baseline: 'middle', alpha: gh,
        });
        relativeBar(ctx, 390, yy, 600, 30, r.f, {
          color: 'rgba(241,250,140,0.5)', alpha: gh, progress: 0.8,
        });
      });
    }
    rows.forEach((r, i) => {
      const yy = 400 + i * 62;
      const isCat = i === 0;
      ctx.save();
      ctx.globalAlpha = rowsA * (isCat ? 1 : 0.82);
      text(ctx, r.label, 350, yy + 18, {
        size: 36, weight: isCat ? 600 : 400, color: isCat ? C.fg : C.muted,
        align: 'right', baseline: 'middle',
      });
      relativeBar(ctx, 390, yy, 600, 30, r.f, {
        color: isCat ? M.logits : 'rgba(241,250,140,0.45)',
        alpha: rowsA, progress: p(t, q.scores + i * 0.04, 0.55),
        dim: isCat ? 1 : 0.7,
      });
      if (isCat && highA > 0.001) {
        tag(ctx, 1040, yy + 15, likeA > 0.2 ? 'liked' : 'high', {
          color: M.correct, alpha: highA * 0.95, size: 28, dot: true,
        });
      }
      ctx.restore();
    });

    // The 50,000.
    text(ctx, '50,000', 1460, 470, {
      size: 120, weight: 500, color: C.fg, align: 'center', ls: -4,
      alpha: base * 0.14 * (1 - fiftyA),
    });
    if (fiftyA > 0.001) {
      const val = Math.round(50000 * fiftyA);
      text(ctx, val.toLocaleString('en-US'), 1460, 470, {
        size: 120, weight: 500, color: M.logits, align: 'center', ls: -4, alpha: 1,
      });
    }
    text(ctx, 'words', 1460, 520, { size: 34, weight: 400, color: C.muted, align: 'center', alpha: fiftyA });
    text(ctx, '50,000 scores', 1460, 582, {
      size: 32, weight: 400, color: M.logits, align: 'center', alpha: fiftyScoresA,
    });

    // Logits label.
    text(ctx, 'logits', 274, 880, {
      size: 56, weight: 500, color: C.fg, alpha: logitsA,
    });
    const lw = measure(ctx, 'logits', 56, 500, F.display, 0);
    underline(ctx, 274, 900, lw, { color: M.logits, width: 3, alpha: logitsA * 0.85 });
    text(ctx, 'the scores are called', 274, 936, {
      size: 27, weight: 400, color: C.dim, alpha: logitsA * 0.85,
    });
  },
};

// ---------------------------------------------------------------- 12

const twelve = {
  id: 's12-softmax-machine',
  title: 'A machine that turns scores into chances',
  start: start(17),
  end: start(19),
  draw(ctx, t) {
    const base = p(t, q.stepThree, 0.6);
    const notA = p(t, q.notChances, 0.6);
    const nineA = p(t, q.nine, 0.5);
    const minusA = p(t, q.minus9, 0.5);
    const chanceA = p(t, q.ninety, 0.7);
    const machineA = p(t, q.machine, 0.7);
    const softmaxA = p(t, q.softmax, 0.6);

    stepTracker(ctx, 3, { alpha: p(t, q.stepThree, 0.5) });
    text(ctx, 'a score is not a chance', 960, 236, {
      size: 46, weight: 450, color: C.muted, align: 'center',
      alpha: notA * 0.95, ls: -0.6,
    });

    // Scores.
    card(ctx, 200, 330, 420, 410, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 18, alpha: base * 0.9,
    });
    tag(ctx, 240, 380, 'a score', { color: M.logits, alpha: base * 0.9, size: 29 });
    if (nineA < 0.99) {
      const gh = base * 0.12 * (1 - nineA);
      text(ctx, '+9', 410, 520, {
        size: 110, weight: 500, color: M.logits, align: 'center', alpha: gh, ls: -4,
      });
      text(ctx, '−9', 410, 660, {
        size: 110, weight: 500, color: M.logits, align: 'center', alpha: gh * 0.8, ls: -4,
      });
    }
    if (nineA > 0.001) {
      text(ctx, '+9', 410, 520, {
        size: 110, weight: 500, color: M.logits, align: 'center', alpha: nineA, ls: -4,
      });
    }
    if (minusA > 0.001) {
      text(ctx, '−9', 410, 660, {
        size: 110, weight: 500, color: 'rgba(241,250,140,0.55)', align: 'center',
        alpha: minusA, ls: -4,
      });
    }
    text(ctx, 'what do you do with it?', 410, 714, {
      size: 28, weight: 400, color: C.dim, align: 'center',
      alpha: Math.max(nineA, minusA) * 0.9,
    });

    // Gate.
    gate(ctx, 960, 535, 210, 380, {
      alpha: base * 0.95, open: 0.15 + 0.85 * machineA, accent: M.gate, label: null,
    });
    if (machineA > 0.001) {
      tag(ctx, 960, 348, 'a machine', { color: C.muted, alpha: machineA * (1 - softmaxA) * 0.95, size: 28, align: 'center' });
    }
    text(ctx, 'softmax', 960, 776, {
      size: 56, weight: 500, color: C.fg, align: 'center', alpha: softmaxA,
    });
    const sw = measure(ctx, 'softmax', 56, 500, F.display, 0.2);
    underline(ctx, 960 - sw / 2, 796, sw, { color: M.gate, width: 3, alpha: softmaxA * 0.85 });

    // Chances.
    card(ctx, 1290, 330, 430, 410, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 18, alpha: base * 0.9,
    });
    tag(ctx, 1330, 380, 'chances', { color: M.gate, alpha: base * 0.9, size: 29 });
    if (chanceA < 0.99) {
      const gh = base * 0.14 * (1 - chanceA);
      relativeBar(ctx, 1418, 440, 260, 30, 0.9, { color: M.gate, alpha: gh, progress: 0.8 });
      relativeBar(ctx, 1418, 520, 260, 30, 0.08, { color: M.gate, alpha: gh, progress: 0.8 });
    }
    if (chanceA > 0.001) {
      const rows = [
        { label: 'cat', value: 0.90 },
        { label: 'dog', value: 0.08 },
      ];
      probList(ctx, 1330, 440, 350, rows, {
        alpha: chanceA, color: M.gate, rowH: 54, gap: 26,
        labelW: 88, size: 34, valueSize: 34, progress: p(t, q.ninety, 0.8),
      });
      text(ctx, 'and the rest', 1330, 640, {
        size: 28, weight: 400, color: C.dim, alpha: chanceA * 0.8,
      });
    }

    // Arrows through the machine.
    if (machineA > 0.001) {
      arrow(ctx, 630, 535, 846, 535, {
        color: 'rgba(248,248,242,0.35)', width: 2, progress: machineA, head: 10,
      });
      arrow(ctx, 1074, 535, 1280, 535, {
        color: 'rgba(248,248,242,0.35)', width: 2, progress: p(t, q.machine + 0.25, 0.6), head: 10,
      });
    }

    tag(ctx, 960, 900, 'the smallest example', {
      color: C.dim, alpha: p(t, q.smallest, 0.6) * 0.9, size: 30, align: 'center',
    });
  },
};

// ---------------------------------------------------------------- 13

const thirteen = {
  id: 's13-three-singers',
  title: 'Three singers',
  start: start(19),
  end: start(20),
  draw(ctx, t) {
    const base = p(t, q.singers - 0.2, 0.7);
    const judgeA = p(t, q.judges, 0.6);
    const twoA = p(t, q.twoThings, 0.55);
    const eA = p(t, q.e, 0.8);
    const divideA = p(t, q.divide, 0.7);
    const pctA = p(t, q.results, 0.8);

    text(ctx, 'softmax does two things', 960, 196, {
      size: 38, weight: 450, color: C.muted, align: 'center',
      alpha: twoA * 0.95,
    });

    const cols = [
      { x: 180, name: 'A', score: 3, e: 'e³ = 20.1', pct: '84%', color: M.gate },
      { x: 740, name: 'B', score: 1, e: 'e¹ = 2.7', pct: '11%', color: M.gate },
      { x: 1300, name: 'C', score: 0, e: 'e⁰ = 1.0', pct: '4%', color: M.gate },
    ];

    cols.forEach((c, i) => {
      const e = enter(t, q.singers + i * 0.18, 0.6, 0, 18);
      const w = 420;
      card(ctx, c.x, 300, w, 470, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
        alpha: base * e.a, accent: i === 0 && pctA > 0.5 ? C.cyan : null, accentW: 3,
      });
      text(ctx, `singer ${c.name}`, c.x + 34, 352, {
        size: 30, weight: 400, color: C.muted, alpha: e.a,
      });
      // score
      text(ctx, String(c.score), c.x + w / 2, 500, {
        size: 128, weight: 500, color: M.logits, align: 'center',
        alpha: (0.12 + 0.88 * judgeA) * e.a, ls: -5,
      });
      // exponent
      if (eA > 0.001) {
        text(ctx, c.e, c.x + w / 2, 574, {
          size: 36, weight: 400, color: C.fg, align: 'center', alpha: eA * e.a,
        });
      }
      // percent
      if (pctA > 0.001) {
        text(ctx, c.pct, c.x + w / 2, 700, {
          size: 78, weight: 500, color: c.color, align: 'center',
          alpha: pctA * e.a, ls: -2,
        });
      }
      // baseline
      line(ctx, c.x + 50, 636, c.x + w - 50, 636, {
        color: 'rgba(248,248,242,0.10)', width: 1.2, rough: 0, alpha: e.a,
      });
    });

    if (eA > 0.001) {
      text(ctx, 'raise e to the score', 960, 802, {
        size: 30, weight: 400, color: C.dim, align: 'center', alpha: eA * (1 - divideA) * 0.9,
      });
    }
    if (divideA > 0.001) {
      text(ctx, '\u00f7 23.8', 960, 802, {
        size: 38, weight: 500, color: M.gate, align: 'center', alpha: divideA,
      });
      text(ctx, 'the total', 960, 838, {
        size: 27, weight: 400, color: C.dim, align: 'center', alpha: divideA * 0.9,
      });
    }
    if (pctA > 0.5) {
      text(ctx, 'these are chances', 960, 900, {
        size: 30, weight: 400, color: C.muted, align: 'center',
        alpha: p(t, q.results + 0.4, 0.5) * 0.95,
      });
    }
  },
};

export default [nine, ten, eleven, twelve, thirteen];
