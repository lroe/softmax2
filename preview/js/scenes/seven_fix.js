import {
  C, F, W, H, clamp, lerp, p, enter, easeInOut, card, text, line, arrow,
  strokePath, underline, measure, bracket, rr,
} from '../kit.js';
import {
  M, tag, chip, statement, gate, wordPill, relativeBar, axes, lossCurve,
  thoughtRow, MONO,
} from '../motifs.js';
import { at, start } from '../data/timeline.js';

const q = {
  nowTest: at('now the test', 47),
  modular: at('modular addition', 47),
  seeds: at('five seeds', 47),
  bf16: at('B F sixteen', 47),
  standard: at('standard cross-entropy', 47),
  pct933: at('93.3', 47),
  fixed: at('fixed version', 47),
  fp32: at('F P thirty-two', 47),
  pct943: at('94.3', 47),
  fp64: at('F P sixty-four', 47),
  both: at('both hit', 47),
  precision: at('problem is precision', 47),
  math: at('math itself', 47),

  look: at('look at where', 48),
  stops: at('stops', 48),
  lead51: at('5.1', 48),
  justUnder: at('just under the cliff', 48),
  wall: at('hit the wall', 48),
  stalled: at('stalled', 48),

  secondBug: at('second bug', 49),
  distill: at('distillation', 49),
  student: at('small student', 49),
  copy: at('copy the chances', 49),
  teacher: at('big teacher', 49),
  matches: at('student matches', 49),
  gradZero: at('gradient should be zero', 49),
  standardCode: at('standard code computes', 49),
  lastDigits: at('last digits disagree', 49),
  identical: at('even when the two are identical', 49),
  leftover: at('leftover gradient', 49),
  six: at('six times ten', 49),
  matched: at('already matched', 49),
  drifting: at('keeps drifting', 49),
  cancellation: at('softmax cancellation', 49),

  fix: at("what's the fix", 50),
  neverAdd: at('never add one', 50),
  smallFns: at('functions made for small numbers', 50),
  softplus: at('softplus', 50),
  expm1: at('exp-m-one', 50),
  log1p: at('log-one-p', 50),
  calcMode: at('small-number mode', 50),
  rewrite: at('rewrites cross-entropy', 50),
  minusSum: at('minus the sum', 50),
  forces: at('forces the gradients', 50),
  accurate: at('stay accurate', 50),
  lead88: at('lead of 88', 50),

  check: at('check your own code', 51),
  textbook: at('textbook recipe', 51),
  numpy: at('plain NumPy', 51),
  fp32b: at('F P thirty-two', 51),
  run: at('run it', 52),
  sum: at('sum comes out', 52),
  three: at('three times ten', 52),
  training: at('training precision', 52),
  bug: at('you have the bug', 52),

  threeCaveats: at('three caveats', 53),
  preprint: at('preprint', 54),
  smallBench: at('small benchmark', 54),
  nobody: at('nobody has shown', 54),
  frontier: at('frontier-scale', 54),

  noFramework: at('no framework', 55),
  snippet: at('snippet', 55),
  fp64b: at('F P sixty-four', 55),
  never: at('never exposed', 55),
  atRisk: at('people at risk', 55),
  most: at('most of us', 55),

  followUp: at('follow-up paper', 56),
  robust: at('more robust', 56),
  earlier: at('earlier work', 56),
  adds: at('adds the second', 56),
  strong: at('strong lead', 56),
};

// ---------------------------------------------------------------- 32

const thirtyTwo = {
  id: 's32-test',
  title: 'The test results',
  start: start(47),
  end: start(48),
  draw(ctx, t) {
    const base = 0.9;
    const headA = p(t, q.nowTest, 0.6);
    const modularA = p(t, q.modular, 0.5);
    const seedsA = p(t, q.seeds, 0.5);
    const precisionA = p(t, q.precision, 0.6);
    const mathA = p(t, q.math, 0.6);

    text(ctx, 'modular addition', 960, 200, {
      size: 38, weight: 450, color: C.fg, align: 'center', alpha: modularA, ls: -0.4,
    });
    tag(ctx, 1210, 200, 'five seeds', { color: C.dim, alpha: seedsA * 0.9, size: 30 });
    tag(ctx, 700, 200, 'the test', { color: C.muted, alpha: headA * 0.9, size: 30, align: 'right' });

    // Legend.
    text(ctx, 'standard', 560, 275, { size: 26, weight: 400, color: M.bug, alpha: headA * 0.85 });
    card(ctx, 500, 262, 40, 8, { fill: M.bug, stroke: null, r: 4, alpha: headA * 0.8 });
    text(ctx, 'fixed', 880, 275, { size: 26, weight: 400, color: C.green, alpha: headA * 0.85 });
    card(ctx, 826, 262, 40, 8, { fill: C.green, stroke: null, r: 4, alpha: headA * 0.8 });

    const rows = [
      { label: 'BF16', cue: q.bf16, std: 0.933, fixed: 1.0, stdLab: '93.3%', cueStd: q.standard, cuePct: q.pct933, cueFixed: q.fixed },
      { label: 'FP32', cue: q.fp32, std: 0.943, fixed: 1.0, stdLab: '94.3%', cueStd: q.fp32, cuePct: q.pct943, cueFixed: q.pct943 + 0.55 },
      { label: 'FP64', cue: q.fp64, std: 1.0, fixed: 1.0, stdLab: '100%', cueStd: q.fp64, cuePct: q.both, cueFixed: q.both + 0.2 },
    ];

    const x0 = 530;
    const w = 1060;
    rows.forEach((r, i) => {
      const yy = 330 + i * 155;
      const e = p(t, r.cue, 0.6);
      text(ctx, r.label, 300, yy + 34, {
        size: 38, weight: 500, color: C.fg, alpha: base * (0.18 + 0.82 * e),
      });
      // ghost tracks
      card(ctx, x0, yy, w, 26, { fill: 'rgba(248,248,242,0.05)', stroke: null, r: 6, alpha: base * 0.35 });
      card(ctx, x0, yy + 34, w, 26, { fill: 'rgba(248,248,242,0.05)', stroke: null, r: 6, alpha: base * 0.35 });

      const sA = p(t, r.cueStd, 0.6);
      const fA = p(t, r.cueFixed, 0.6);
      card(ctx, x0, yy, Math.max(4, w * r.std * sA), 26, {
        fill: M.bug, stroke: null, r: 6, alpha: sA * 0.75,
      });
      card(ctx, x0, yy + 34, Math.max(4, w * r.fixed * fA), 26, {
        fill: C.green, stroke: null, r: 6, alpha: fA * 0.8,
      });

      text(ctx, r.stdLab, x0 + w + 18, yy + 14, {
        size: 30, weight: 500, color: M.bug, alpha: p(t, r.cuePct, 0.5), baseline: 'middle',
      });
      text(ctx, '100%', x0 + w + 18, yy + 48, {
        size: 30, weight: 500, color: C.green, alpha: fA, baseline: 'middle',
      });
    });

    if (precisionA > 0.001) {
      text(ctx, 'the problem is precision', 960, 866, {
        size: 40, weight: 450, color: C.fg, align: 'center', alpha: precisionA, ls: -0.5,
      });
    }
    if (mathA > 0.001) {
      tag(ctx, 960, 922, 'the math is fine', {
        color: C.green, alpha: mathA * 0.95, size: 30, align: 'center',
      });
    }
  },
};

// ---------------------------------------------------------------- 33

const thirtyThree = {
  id: 's33-stall',
  title: 'Stalled at the cliff',
  start: start(48),
  end: start(49),
  draw(ctx, t) {
    const base = 0.9;
    const lookA = p(t, q.look, 0.6);
    const stopA = p(t, q.stops, 0.5);
    const leadA = p(t, q.lead51, 0.5);
    const underA = p(t, q.justUnder, 0.6);
    const wallA = p(t, q.wall, 0.6);
    const stalledA = p(t, q.stalled, 0.6);

    tag(ctx, 300, 250, 'the BF16 run', { color: M.gate, alpha: lookA * 0.9, size: 32 });
    text(ctx, 'accuracy 93.3%', 1620, 250, {
      size: 30, weight: 400, color: C.muted, align: 'right', alpha: lookA * 0.85,
    });

    const x0 = 300;
    const x1 = 1500;
    const scale = (v) => x0 + (v / 10) * (x1 - x0);
    const y = 520;

    // Track.
    card(ctx, x0, y - 12, x1 - x0, 24, {
      fill: 'rgba(248,248,242,0.06)', stroke: null, r: 12, alpha: base * 0.8,
    });
    card(ctx, x0, y - 12, scale(5.5) - x0, 24, {
      fill: 'rgba(139,233,253,0.45)', stroke: null, r: 12, alpha: base * 0.85,
    });
    card(ctx, scale(5.5), y - 12, x1 - scale(5.5), 24, {
      fill: 'rgba(255,85,85,0.18)', stroke: null, r: 12, alpha: base * 0.85,
    });

    // The cliff.
    line(ctx, scale(5.5), y - 54, scale(5.5), y + 54, {
      color: M.bug, width: 3, alpha: p(t, q.justUnder, 0.6), rough: 0,
    });
    tag(ctx, scale(5.5) + 18, y - 80, 'cliff 5.5', {
      color: M.bug, alpha: p(t, q.justUnder, 0.6) * 0.95, size: 30,
    });

    // The stop.
    if (stopA > 0.001) {
      ctx.save();
      ctx.globalAlpha = stopA;
      ctx.fillStyle = M.logits;
      ctx.beginPath();
      ctx.arc(scale(5.1), y, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      text(ctx, '5.1', scale(5.1) - 24, y + 70, {
        size: 42, weight: 500, color: M.logits, align: 'right', alpha: leadA,
      });
      text(ctx, 'stop', scale(5.1) - 24, y + 106, {
        size: 27, weight: 400, color: C.muted, align: 'right', alpha: leadA * 0.9,
      });
    }

    if (underA > 0.001) {
      bracket(ctx, scale(5.1), scale(5.5), y - 46, {
        color: M.bug, width: 2, alpha: underA * 0.9, tick: 10,
      });
    }

    // The wall.
    if (wallA > 0.001) {
      ctx.save();
      ctx.globalAlpha = wallA;
      for (let i = 0; i < 8; i++) {
        line(ctx, scale(5.5) - 22 + i * 6, y - 100 + i * 12, scale(5.5) - 22 + i * 6, y + 100, {
          color: 'rgba(255,85,85,0.25)', width: 2, rough: 0,
        });
      }
      ctx.restore();
    }

    if (stalledA > 0.001) {
      text(ctx, 'stalled', 960, 780, {
        size: 78, weight: 500, color: M.bug, align: 'center', alpha: stalledA, ls: -3,
      });
      text(ctx, 'it hit the wall', 960, 850, {
        size: 32, weight: 400, color: C.muted, align: 'center', alpha: stalledA * 0.9,
      });
    }

    // Axis ticks.
    [0, 5, 10].forEach((v) => {
      text(ctx, String(v), scale(v), 650, {
        size: 28, weight: 400, color: C.dim, align: 'center', alpha: base * 0.7,
      });
    });
    text(ctx, 'lead', 1620, 650, { size: 28, color: C.dim, align: 'right', alpha: base * 0.7 });
  },
};

// ---------------------------------------------------------------- 34

const thirtyFour = {
  id: 's34-distillation',
  title: 'Distillation, same chances',
  start: start(49),
  end: 475.5,
  draw(ctx, t) {
    const base = 0.9;
    const headA = p(t, q.secondBug, 0.6);
    const distillA = p(t, q.distill, 0.5);
    const studentA = p(t, q.student, 0.55);
    const teacherA = p(t, q.teacher, 0.55);
    const matchA = p(t, q.matches, 0.6);
    const gradA = p(t, q.gradZero, 0.6);
    const codeA = p(t, q.standardCode, 0.6);
    const diffA = p(t, q.lastDigits, 0.6);
    const sameA = p(t, q.identical, 0.6);

    text(ctx, 'a second bug', 960, 200, {
      size: 44, weight: 500, color: M.bug, align: 'center', alpha: headA, ls: -0.8,
    });
    tag(ctx, 960, 252, 'it hits distillation', {
      color: C.muted, alpha: distillA * 0.9, size: 28, align: 'center',
    });

    // Teacher.
    card(ctx, 180, 290, 680, 320, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
      alpha: base * (0.18 + 0.82 * teacherA) * 0.9,
    });
    text(ctx, 'teacher', 220, 360, {
      size: 38, weight: 500, color: C.fg, alpha: base * (0.25 + 0.75 * teacherA),
    });
    text(ctx, 'the chances', 220, 404, {
      size: 28, weight: 400, color: C.muted, alpha: base * teacherA * 0.85,
    });
    thoughtRow(ctx, 220, 470, 600, 54, {
      cells: 18, color: M.gate, alpha: teacherA * 0.9, progress: p(t, q.teacher + 0.2, 0.7),
    });

    // Student.
    card(ctx, 1060, 290, 680, 320, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
      alpha: base * (0.18 + 0.82 * studentA) * 0.9,
    });
    text(ctx, 'student', 1100, 360, {
      size: 38, weight: 500, color: C.fg, alpha: base * (0.25 + 0.75 * studentA),
    });
    text(ctx, 'the chances', 1100, 404, {
      size: 28, weight: 400, color: C.muted, alpha: base * studentA * 0.85,
    });
    thoughtRow(ctx, 1100, 470, 600, 54, {
      cells: 18, color: M.gate, alpha: studentA * 0.9, progress: p(t, q.student + 0.2, 0.7),
    });

    if (matchA > 0.001) {
      text(ctx, '\u2248', 960, 520, {
        size: 84, weight: 400, color: C.correct, align: 'center', alpha: matchA,
      });
      text(ctx, 'identical', 960, 580, {
        size: 26, weight: 400, color: C.muted, align: 'center', alpha: matchA * 0.9,
      });
    }
    if (gradA > 0.001) {
      text(ctx, 'the gradient should be zero', 960, 676, {
        size: 38, weight: 450, color: C.fg, align: 'center', alpha: gradA * 0.95,
      });
    }

    // The last-digit disagreement.
    if (diffA > 0.001) {
      card(ctx, 600, 730, 760, 150, {
        fill: C.well, stroke: 'rgba(248,248,242,0.14)', r: 14, alpha: diffA,
      });
      text(ctx, 'teacher', 630, 776, {
        size: 24, weight: 400, color: C.dim, alpha: diffA * 0.9,
      });
      text(ctx, '…4567', 760, 776, {
        size: 28, weight: 500, color: M.gate, family: MONO, alpha: diffA,
      });
      text(ctx, 'student', 630, 834, {
        size: 24, weight: 400, color: C.dim, alpha: diffA * 0.9,
      });
      text(ctx, '…4568', 760, 834, {
        size: 28, weight: 500, color: M.bug, family: MONO, alpha: diffA,
      });
      text(ctx, 'last digits disagree', 1300, 806, {
        size: 28, weight: 400, color: M.bug, alpha: diffA * 0.95, align: 'right',
      });
    }
    if (sameA > 0.001) {
      tag(ctx, 960, 912, 'even when the two are identical', {
        color: M.bug, alpha: sameA * 0.9, size: 28, align: 'center',
      });
    }
  },
};

// ---------------------------------------------------------------- 35

const thirtyFive = {
  id: 's35-cancellation',
  title: 'Softmax cancellation',
  start: 475.5,
  end: start(50),
  draw(ctx, t) {
    const base = 0.9;
    const leftA = p(t, q.leftover, 0.6);
    const sixA = p(t, q.six, 0.6);
    const matchedA = p(t, q.matched, 0.6);
    const driftA = p(t, q.drifting, 0.8);
    const nameA = p(t, q.cancellation, 0.6);

    tag(ctx, 960, 220, 'the leftover gradient', {
      color: C.muted, alpha: leftA * 0.9, size: 30, align: 'center',
    });

    if (sixA < 0.99) {
      card(ctx, 280, 300, 1360, 300, {
        fill: 'rgba(49,51,66,0.28)', stroke: 'rgba(248,248,242,0.22)', r: 20,
        dash: [9, 9], alpha: base * 0.5,
      });
      text(ctx, '6 \u00d7 10\u207b\u2078', 960, 420, {
        size: 110, weight: 500, color: C.dim, align: 'center', alpha: 0.38, ls: -3,
      });
    }
    text(ctx, '6 \u00d7 10\u207b\u2078', 960, 420, {
      size: 110, weight: 500, color: M.word, align: 'center', alpha: sixA, ls: -3,
    });
    text(ctx, 'even when the student already matches the teacher', 960, 500, {
      size: 32, weight: 400, color: C.muted, align: 'center', alpha: sixA * 0.9,
    });

    // Ghost drift card.
    if (driftA < 0.99) {
      card(ctx, 280, 580, 520, 230, {
        fill: 'rgba(49,51,66,0.28)', stroke: 'rgba(248,248,242,0.22)', r: 18,
        dash: [8, 8], alpha: base * 0.4,
      });
    }
    // A drifting student vector.
    if (driftA > 0.001) {
      const dx = 70 * driftA;
      card(ctx, 280, 580, 520, 230, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 18,
        alpha: base * 0.8,
      });
      text(ctx, 'student', 316, 640, {
        size: 30, weight: 500, color: C.fg, alpha: base * 0.9,
      });
      text(ctx, 'matched', 760, 640, {
        size: 26, weight: 400, color: C.green, align: 'right', alpha: matchedA * 0.9,
      });
      // ghost position
      thoughtRow(ctx, 316, 690, 420, 40, {
        cells: 12, color: C.dim, alpha: 0.22, progress: 1,
      });
      thoughtRow(ctx, 316 + dx, 690, 420, 40, {
        cells: 12, color: M.word, alpha: driftA * 0.9, progress: 1,
      });
      arrow(ctx, 720, 710, 850, 710, {
        color: M.word, width: 2.4, progress: driftA, head: 11,
      });
      text(ctx, 'keeps drifting', 860, 720, {
        size: 32, weight: 400, color: M.word, alpha: driftA * 0.95,
      });
      tag(ctx, 316, 780, 'no reason to move', {
        color: M.dim, alpha: driftA * 0.8, size: 26,
      });
    }

    if (nameA > 0.001) {
      text(ctx, 'softmax cancellation', 1320, 680, {
        size: 44, weight: 500, color: M.fg, align: 'center', alpha: nameA, ls: -0.5,
      });
      const w = measure(ctx, 'softmax cancellation', 44, 500, F.display, -0.5);
      underline(ctx, 1320 - w / 2, 700, w, {
        color: M.word, width: 3, alpha: nameA * 0.85, progress: nameA,
      });
    }
  },
};

// ---------------------------------------------------------------- 36

const thirtySix = {
  id: 's36-fix',
  title: 'Never add one to the tiny number',
  start: start(50),
  end: start(51),
  draw(ctx, t) {
    const base = 0.9;
    const fixA = p(t, q.fix, 0.6);
    const neverA = p(t, q.neverAdd, 0.6);
    const fnsA = p(t, q.smallFns, 0.7);
    const spA = p(t, q.softplus, 0.5);
    const emA = p(t, q.expm1, 0.5);
    const lpA = p(t, q.log1p, 0.5);
    const modeA = p(t, q.calcMode, 0.6);
    const formA = p(t, q.rewrite, 0.6);
    const forceA = p(t, q.forces, 0.6);
    const accA = p(t, q.accurate, 0.6);
    const leadA = p(t, q.lead88, 0.6);

    tag(ctx, 200, 200, 'the fix', { color: C.muted, alpha: fixA * 0.9, size: 30 });
    text(ctx, 'never add one to the tiny number', 960, 268, {
      size: 44, weight: 450, color: C.fg, align: 'center', alpha: neverA, ls: -0.6,
    });

    const cards = [
      { x: 180, name: 'softplus', sub: 'log(1 + e\u02e3)', a: spA, color: M.thought },
      { x: 660, name: 'expm1', sub: 'e\u02e3 \u2212 1', a: emA, color: M.thought },
      { x: 1140, name: 'log1p', sub: 'log(1 + x)', a: lpA, color: M.thought },
    ];
    cards.forEach((c) => {
      const e = 0.18 + 0.82 * c.a;
      card(ctx, c.x, 330, 420, 170, {
        fill: C.surface, stroke: 'rgba(189,147,249,0.35)', r: 18,
        accent: c.color, accentW: 3, alpha: base * e,
      });
      text(ctx, c.name, c.x + 32, 392, {
        size: 38, weight: 500, color: C.fg, alpha: base * e,
      });
      text(ctx, c.sub, c.x + 32, 454, {
        size: 28, weight: 400, color: C.muted, family: MONO, alpha: base * e * 0.9,
      });
    });
    if (modeA > 0.001) {
      tag(ctx, 960, 548, 'the calculator\u2019s small-number mode', {
        color: C.dim, alpha: modeA * 0.9, size: 28, align: 'center',
      });
    }

    // The rewritten gradient.
    if (formA > 0.001) {
      card(ctx, 180, 600, 1120, 240, {
        fill: C.surface, stroke: 'rgba(80,250,123,0.25)', r: 20, alpha: base * formA * 0.9,
      });
      text(ctx, 'the right word\u2019s gradient', 220, 668, {
        size: 30, weight: 400, color: C.muted, alpha: formA * 0.9,
      });
      text(ctx, '= \u2212 sum of the others', 220, 728, {
        size: 46, weight: 500, color: C.fg, alpha: formA, ls: -0.6,
      });
      if (forceA > 0.001) {
        text(ctx, 'sum = 0', 220, 800, {
          size: 44, weight: 500, color: C.correct, alpha: forceA,
        });
      }
    }

    // Accuracy at lead 88.
    if (accA > 0.001) {
      text(ctx, '\u2248 88', 1560, 720, {
        size: 100, weight: 500, color: M.correct, align: 'center', alpha: accA * 0.95, ls: -3,
      });
      text(ctx, 'accurate to a lead of', 1560, 776, {
        size: 28, weight: 400, color: C.muted, align: 'center', alpha: accA * 0.9,
      });
      text(ctx, 'until float runs out', 1560, 820, {
        size: 26, weight: 400, color: C.dim, align: 'center', alpha: leadA * 0.8,
      });
    }
  },
};

// ---------------------------------------------------------------- 37

const thirtySeven = {
  id: 's37-numpy',
  title: 'The five-line test',
  start: start(51),
  end: start(53),
  draw(ctx, t) {
    const base = 0.9;
    const checkA = p(t, q.check, 0.6);
    const runA = p(t, q.run, 0.5);
    const sumA = p(t, q.sum, 0.5);
    const trainA = p(t, q.training, 0.6);
    const bugA = p(t, q.bug, 0.6);

    text(ctx, 'check your own loss', 960, 200, {
      size: 38, weight: 450, color: C.fg, align: 'center', alpha: checkA, ls: -0.4,
    });
    tag(ctx, 960, 244, 'plain NumPy \u00b7 FP32', {
      color: C.dim, alpha: p(t, q.numpy, 0.5) * 0.9, size: 28, align: 'center',
    });

    // Code block.
    card(ctx, 200, 300, 1180, 500, {
      fill: C.well, stroke: 'rgba(248,248,242,0.14)', r: 18, alpha: base * 0.95,
    });
    const code = [
      'import numpy as np',
      'z = np.array([9, -9, -9], dtype=np.float32)',
      'p = np.exp(z - z.max()); p /= p.sum()',
      'p[0] -= 1',
      'print(p.sum())',
    ];
    code.forEach((ln, i) => {
      const a = 0.16 + 0.84 * p(t, q.check + 0.05 + i * 0.1, 0.5);
      text(ctx, String(i + 1), 232, 368 + i * 72, {
        size: 24, family: MONO, color: C.faint, alpha: a * 0.7,
      });
      text(ctx, ln, 292, 368 + i * 72, {
        size: 32, weight: 500, family: MONO, color: i === 4 ? M.logits : C.fg, alpha: a,
      });
    });

    // Output.
    if (runA > 0.001) {
      card(ctx, 1420, 360, 320, 260, {
        fill: C.surface, stroke: 'rgba(255,85,85,0.35)', r: 18, alpha: base * runA * 0.9,
      });
      text(ctx, 'the sum', 1460, 420, {
        size: 28, weight: 400, color: C.muted, alpha: runA * 0.9,
      });
      text(ctx, '3e-8', 1460, 520, {
        size: 82, weight: 500, color: M.bug, family: MONO, alpha: sumA,
      });
      text(ctx, '\u2248 3 \u00d7 10\u207b\u2078', 1460, 578, {
        size: 28, weight: 400, color: M.bug, family: MONO, alpha: sumA,
      });
    }

    if (trainA > 0.001) {
      text(ctx, 'if your loss does this in your training precision', 960, 860, {
        size: 32, weight: 400, color: C.muted, align: 'center', alpha: trainA * 0.95,
      });
    }
    if (bugA > 0.001) {
      tag(ctx, 960, 930, 'you have the bug', {
        color: M.bug, alpha: bugA, size: 42, align: 'center',
      });
    }
  },
};

// ---------------------------------------------------------------- 38-40

function caveatList(ctx, active, alpha) {
  const la = 0.2 + 0.8 * alpha;
  const rows = [
    ['1', 'preprint'],
    ['2', 'not adopted'],
    ['3', 'still fails'],
  ];
  card(ctx, 150, 260, 440, 520, {
    fill: 'rgba(49,51,66,0.55)', stroke: 'rgba(248,248,242,0.12)', r: 18, alpha: la * 0.9,
  });
  rows.forEach((r, i) => {
    const yy = 330 + i * 130;
    const on = i + 1 === active;
    if (on) {
      card(ctx, 180, yy - 42, 380, 100, {
        fill: 'rgba(68,71,90,0.75)', stroke: 'rgba(139,233,253,0.32)', r: 12,
        lw: 1.4, alpha: la * 0.9,
      });
    }
    text(ctx, r[0], 206, yy + 8, {
      size: 30, weight: 600, family: MONO, color: on ? M.gate : C.dim, alpha: la * (on ? 1 : 0.6),
    });
    text(ctx, r[1], 250, yy + 8, {
      size: 34, weight: on ? 500 : 400, color: on ? C.fg : C.muted, alpha: la * (on ? 1 : 0.62),
    });
  });
}

const thirtyEight = {
  id: 's38-caveat-preprint',
  title: 'Caveat one: a preprint',
  start: start(53),
  end: start(55),
  draw(ctx, t) {
    const base = 0.9;
    const listA = p(t, q.threeCaveats, 0.6);
    const preA = p(t, q.preprint, 0.6);
    const benchA = p(t, q.smallBench, 0.6);
    const nobodyA = p(t, q.nobody, 0.6);
    const frontierA = p(t, q.frontier, 0.6);

    caveatList(ctx, 1, listA);

    // Preprint card.
    card(ctx, 700, 280, 480, 300, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.18)', r: 16, lw: 1.6,
      dash: [9, 9], alpha: base * (0.2 + 0.8 * preA) * 0.95,
    });
    text(ctx, 'preprint', 740, 390, {
      size: 54, weight: 500, color: C.fg, alpha: preA, ls: -1,
    });
    text(ctx, 'not peer reviewed', 740, 444, {
      size: 28, weight: 400, color: C.muted, alpha: preA * 0.9,
    });
    tag(ctx, 740, 510, 'the headline numbers', {
      color: C.dim, alpha: preA * benchA * 0.9, size: 26,
    });

    // Small benchmark card.
    card(ctx, 1240, 280, 480, 300, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 16, alpha: base * (0.2 + 0.8 * benchA) * 0.9,
    });
    text(ctx, 'small benchmark', 1280, 344, {
      size: 32, weight: 500, color: C.fg, alpha: benchA,
    });
    relativeBar(ctx, 1280, 400, 400, 24, 0.16, {
      color: M.logits, alpha: benchA, progress: p(t, q.smallBench, 0.7),
    });
    tag(ctx, 1280, 456, 'the headline scale', {
      color: C.dim, alpha: benchA * 0.8, size: 25,
    });

    // The missing frontier run.
    if (nobodyA > 0.001) {
      card(ctx, 1280, 490, 400, 56, {
        fill: 'rgba(30,31,41,0.7)', stroke: 'rgba(255,85,85,0.25)', r: 8,
        dash: [7, 7], alpha: nobodyA * 0.9,
      });
      text(ctx, 'frontier scale', 1320, 526, {
        size: 27, weight: 400, color: M.bug, alpha: nobodyA * 0.9,
      });
      text(ctx, '?', 1620, 530, {
        size: 44, weight: 500, color: M.bug, align: 'right', alpha: nobodyA,
      });
    }

    text(ctx, 'no frontier-scale run has been shown', 960, 690, {
      size: 34, weight: 400, color: C.muted, align: 'center', alpha: nobodyA * 0.95,
    });
    text(ctx, 'as far as I can tell', 960, 744, {
      size: 28, weight: 400, color: C.dim, align: 'center', alpha: frontierA * 0.9,
    });
  },
};

const thirtyNine = {
  id: 's39-caveat-adoption',
  title: 'Caveat two: not adopted',
  start: start(55),
  end: start(56),
  draw(ctx, t) {
    const base = 0.9;
    const listA = p(t, q.threeCaveats, 0.6);
    const noA = p(t, q.noFramework, 0.6);
    const snippetA = p(t, q.snippet, 0.6);
    const fp64A = p(t, q.fp64b, 0.6);
    const neverA = p(t, q.never, 0.6);
    const riskA = p(t, q.atRisk, 0.6);
    const mostA = p(t, q.most, 0.6);

    caveatList(ctx, 2, listA);

    // Framework chips.
    ['JAX', 'PyTorch', 'TensorFlow'].forEach((f, i) => {
      const x = 760 + i * 250;
      chip(ctx, x, 330, f, {
        size: 34, color: C.muted, border: 'rgba(248,248,242,0.2)',
        bg: 'rgba(49,51,66,0.6)', alpha: noA * (0.4 + 0.6 * p(t, q.noFramework + i * 0.1, 0.4)),
      });
    });
    tag(ctx, 760, 400, 'none has adopted it', {
      color: M.bug, alpha: noA * 0.95, size: 30,
    });

    // Today: a snippet.
    if (snippetA > 0.001) {
      card(ctx, 760, 460, 720, 150, {
        fill: C.well, stroke: 'rgba(255,184,108,0.3)', r: 14, alpha: base * snippetA * 0.9,
      });
      text(ctx, 'today, the fix is a snippet you paste in', 800, 526, {
        size: 30, weight: 400, color: C.fg, alpha: snippetA,
      });
      for (let i = 0; i < 3; i++) {
        line(ctx, 800, 556 + i * 14, 800 + 220 + i * 50, 556 + i * 14, {
          color: 'rgba(255,184,108,0.5)', width: 2, alpha: snippetA * 0.7, rough: 0,
        });
      }
    }

    // FP64 safe.
    if (fp64A > 0.001) {
      card(ctx, 760, 650, 520, 120, {
        fill: C.surface, stroke: 'rgba(80,250,123,0.35)', r: 16,
        accent: C.green, accentW: 3, alpha: base * fp64A * 0.9,
      });
      text(ctx, 'FP64', 800, 700, {
        size: 34, weight: 500, color: C.green, alpha: fp64A,
      });
      text(ctx, 'never exposed', 800, 742, {
        size: 28, weight: 400, color: C.muted, alpha: fp64A * neverA * 0.9,
      });
    }

    // At risk.
    if (riskA > 0.001) {
      card(ctx, 1320, 650, 420, 120, {
        fill: C.surface, stroke: 'rgba(255,184,108,0.4)', r: 16,
        accent: M.word, accentW: 3, alpha: base * riskA * 0.9,
      });
      text(ctx, 'BF16 / FP32 + Adam', 1360, 700, {
        size: 30, weight: 500, color: M.word, alpha: riskA,
      });
      text(ctx, 'most of us', 1360, 742, {
        size: 28, weight: 400, color: C.muted, alpha: riskA * mostA * 0.9,
      });
    }
  },
};

const forty = {
  id: 's40-caveat-followup',
  title: 'Caveat three: still fails',
  start: start(56),
  end: start(57),
  draw(ctx, t) {
    const base = 0.9;
    const listA = p(t, q.threeCaveats, 0.6);
    const followA = p(t, q.followUp, 0.6);
    const robustA = p(t, q.robust, 0.6);
    const earlierA = p(t, q.earlier, 0.6);
    const addsA = p(t, q.adds, 0.6);
    const strongA = p(t, q.strong, 0.6);

    caveatList(ctx, 3, listA);

    const y = 470;
    const x0 = 760;
    const x1 = 1660;
    line(ctx, x0, y, x1, y, {
      color: 'rgba(248,248,242,0.14)', width: 2, rough: 0, alpha: base * 0.7,
    });

    const nodes = [
      { x: 840, label: 'earlier work', sub: 'the first bug', a: earlierA, color: M.muted },
      { x: 1210, label: 'this paper', sub: 'the second bug + one fix', a: addsA, color: M.gate },
      { x: 1580, label: 'follow-up', sub: 'a more robust version', a: robustA, color: M.correct },
    ];
    nodes.forEach((n) => {
      ctx.save();
      ctx.globalAlpha = base * (0.2 + 0.8 * n.a);
      ctx.fillStyle = n.color;
      ctx.beginPath();
      ctx.arc(n.x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      text(ctx, n.label, n.x, y - 34, {
        size: 30, weight: 500, color: n.color, align: 'center',
        alpha: base * (0.25 + 0.75 * n.a),
      });
      text(ctx, n.sub, n.x, y + 52, {
        size: 26, weight: 400, color: C.muted, align: 'center',
        alpha: base * (0.2 + 0.8 * n.a),
      });
    });

    if (followA > 0.001) {
      text(ctx, 'the follow-up says this fix still fails on some inputs', 960, 640, {
        size: 30, weight: 400, color: C.muted, align: 'center', alpha: followA * 0.95,
      });
    }

    if (strongA > 0.001) {
      tag(ctx, 960, 760, 'a strong lead for now', {
        color: M.logits, alpha: strongA, size: 42, align: 'center',
      });
    }
  },
};

export default [thirtyTwo, thirtyThree, thirtyFour, thirtyFive, thirtySix, thirtySeven, thirtyEight, thirtyNine, forty];
