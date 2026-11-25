import {
  C, F, W, H, clamp, lerp, p, enter, easeInOut, card, text, line, arrow,
  strokePath, underline, measure, bracket, rr,
} from '../kit.js';
import {
  M, tag, chip, statement, gate, flow, wordPill, relativeBar, axes, lossCurve,
  stepTracker, MONO,
} from '../motifs.js';
import { at, start } from '../data/timeline.js';

const q = {
  together: at('put the two ideas together', 37),
  confident: at('gets confident', 38),
  leadBig: at('lead gets big', 38),
  tinyTinier: at('tiny numbers get tinier', 38),
  bottomBecomes: at('bottom line becomes', 38),
  roundsOne: at('rounds it to one', 38),
  chanceOne: at('chance becomes exactly one', 38),
  lossZero: at('loss becomes exactly zero', 38),
  gradZero: at('gradient on the right word', 38),

  wrongWords: at('wrong words', 39),
  neverAdded: at('never added one', 39),
  keepTiny: at('keep their tiny', 39),
  example: at("paper's example", 40),
  scores9: at('scores 9', 40),
  minus9: at('minus 9', 40),
  rightFirst: at('right answer is the first', 40),

  standard: at('standard code says', 41),
  lossIsZero: at('loss is zero', 41),
  noPush: at('no push', 41),
  truth: at('the truth is', 41),
  tinyLoss: at('tiny loss', 41),
  tinyPush: at('tiny, real push', 41),
  rope: at('rope in our tug', 41),
  cut: at('cut on one side', 41),
  noSum: at('no longer sum', 41),

  cliff: at('precision cliff', 42),
  bf16: at('B F sixteen', 42),
  lead55: at('5.5', 42),
  fp32: at('F P thirty-two', 42),
  lead166: at('16.6', 42),
  fp64: at('F P sixty-four', 42),
  lead367: at('36.7', 42),
  tooSmall: at('too small to matter', 43),
  adamMatter: at('Adam makes it matter', 44),

  adam: at('Adam is the default', 45),
  adamIdea: at('its idea is simple', 45),
  eachWeight: at('for each weight', 45),
  recent: at('recent gradients', 45),
  divide: at('divide by that', 45),
  quiet: at('quiet weights', 45),
  loud: at('loud weights', 45),
  usually: at('usually great', 45),
  errorTiny: at('error is tiny', 45),
  lopsided: at('lopsided', 45),
  sameWay: at('same way every step', 45),
  turnsUp: at('turns it up', 45),
  steady: at('steady push', 45),

  explains: at('explains the slingshot', 46),
  decay: at('weight decay', 46),
};

// ---------------------------------------------------------------- 26

const twentySix = {
  id: 's26-confidence-chain',
  title: 'The chain to zero',
  start: start(37) + 0.32,
  end: start(39),
  draw(ctx, t) {
    const base = 0.92;
    const r1 = p(t, q.confident, 0.5);
    const r2 = p(t, q.leadBig, 0.5);
    const r3 = p(t, q.tinyTinier, 0.5);
    const r4 = p(t, q.roundsOne, 0.5);
    const r5 = p(t, q.chanceOne, 0.5);
    const r6 = p(t, q.lossZero, 0.5);
    const r7 = p(t, q.gradZero, 0.6);

    tag(ctx, 960, 214, 'two ideas, one chain', {
      color: C.dim, alpha: p(t, q.together, 0.6) * 0.9, size: 30, align: 'center',
    });

    card(ctx, 160, 260, 960, 620, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 20, alpha: base * 0.85,
    });

    const rows = [
      { label: 'confident', value: '\u2191', color: M.logits, a: r1 },
      { label: 'lead', value: '\u2191', color: M.logits, a: r2 },
      { label: 'tiny terms', value: '\u2193', color: M.thought, a: r3 },
      { label: '1 + tiny', value: '\u2192 1', color: M.bug, a: r4 },
      { label: 'chance', value: '1', color: M.gate, a: r5 },
      { label: 'loss', value: '0', color: M.bug, a: r6 },
      { label: 'gradient', value: '0', color: M.bug, a: r7 },
    ];

    rows.forEach((r, i) => {
      const yy = 330 + i * 76;
      const a = 0.28 + 0.72 * r.a;
      text(ctx, r.label, 210, yy, {
        size: 34, weight: 400, color: i === 6 ? C.fg : C.muted, alpha: base * a,
      });
      text(ctx, r.value, 930, yy, {
        size: 44, weight: 500, color: r.color, align: 'right', alpha: base * a, ls: -0.5,
      });
      if (i < rows.length - 1) {
        line(ctx, 580, yy + 16, 580, yy + 62, {
          color: 'rgba(248,248,242,0.10)', width: 1.4, rough: 0, alpha: base * a * 0.7,
        });
        arrow(ctx, 580, yy + 46, 580, yy + 66, {
          color: 'rgba(248,248,242,0.18)', width: 1.2, progress: base * a * 0.8, head: 5,
        });
      }
    });

    // The punchline.
    if (r7 > 0.001) {
      text(ctx, '0', 1480, 660, {
        size: 250, weight: 500, color: M.bug, align: 'center', alpha: r7, ls: -8,
      });
      text(ctx, 'the right word\u2019s gradient', 1480, 736, {
        size: 34, weight: 400, color: C.muted, align: 'center', alpha: r7 * 0.95,
      });
      text(ctx, 'exactly zero', 1480, 792, {
        size: 38, weight: 500, color: M.bug, align: 'center', alpha: r7 * 0.95,
      });
      arrow(ctx, 1000, 690, 1310, 640, {
        color: 'rgba(255,85,85,0.5)', width: 2, progress: r7, head: 12, curve: -20,
      });
    }
  },
};

// ---------------------------------------------------------------- 27

const twentySeven = {
  id: 's27-wrong-words',
  title: 'The wrong words keep their values',
  start: start(39),
  end: start(41),
  draw(ctx, t) {
    const base = 0.9;
    const cardsA = p(t, q.wrongWords, 0.6);
    const neverA = p(t, q.neverAdded, 0.6);
    const tinyA = p(t, q.keepTiny, 0.6);
    const exampleA = p(t, q.example, 0.6);
    const scoreA = p(t, q.scores9, 0.6);
    const minusA = p(t, q.minus9, 0.6);
    const rightA = p(t, q.rightFirst, 0.6);

    const cols = [
      { x: 180, word: 'cat', score: 9, right: true, chance: 1.0, grad: '0' },
      { x: 760, word: 'dog', score: -9, right: false, chance: 0.004, grad: 'tiny' },
      { x: 1340, word: 'sat', score: -9, right: false, chance: 0.004, grad: 'tiny' },
    ];

    cols.forEach((c, i) => {
      const e = enter(t, q.wrongWords + i * 0.12, 0.55, 0, 16);
      if (e.a <= 0.001) return;
      card(ctx, c.x, 300, 400, 430, {
        fill: C.surface, stroke: c.right && rightA > 0.3 ? 'rgba(80,250,123,0.45)' : 'rgba(248,248,242,0.14)',
        r: 20, accent: c.right && rightA > 0.3 ? C.green : null, accentW: 3, alpha: base * e.a,
      });
      text(ctx, c.word, c.x + 34, 362, {
        size: 44, weight: 500, color: C.fg, alpha: e.a,
      });
      if (c.right) {
        tag(ctx, c.x + 366, 350, 'right answer', {
          color: C.green, alpha: rightA * 0.9, size: 26, align: 'right',
        });
      }
      // score appears with the paper example
      const scoreVis = c.right ? scoreA : minusA;
      text(ctx, String(c.score), c.x + 34, 450, {
        size: 66, weight: 500, color: M.logits, alpha: e.a * scoreVis, ls: -2,
      });
      tag(ctx, c.x + 34, 490, 'score', {
        color: C.dim, alpha: e.a * exampleA * 0.8, size: 25,
      });

      // chance
      text(ctx, 'chance', c.x + 34, 548, {
        size: 28, weight: 400, color: C.muted, alpha: e.a * 0.9,
      });
      relativeBar(ctx, c.x + 140, 536, 230, 22, c.chance, {
        color: M.gate, alpha: e.a, progress: p(t, q.wrongWords + 0.2, 0.7),
      });
      if (c.right) {
        text(ctx, '1', c.x + 388, 548, {
          size: 28, weight: 500, color: M.gate, align: 'right', alpha: e.a * p(t, q.wrongWords + 0.5, 0.5),
        });
      } else if (neverA > 0.001) {
        tag(ctx, c.x + 34, 596, 'never added 1', {
          color: M.bug, alpha: neverA * 0.85, size: 24,
        });
      }

      // gradient row
      text(ctx, 'gradient', c.x + 34, 660, {
        size: 28, weight: 400, color: C.muted, alpha: e.a * 0.9,
      });
      if (c.right) {
        text(ctx, '0', c.x + 388, 660, {
          size: 34, weight: 500, color: M.bug, align: 'right', alpha: e.a * tinyA,
        });
      } else if (tinyA > 0.001) {
        ctx.save();
        ctx.globalAlpha = e.a * tinyA;
        ctx.fillStyle = M.correct;
        ctx.beginPath();
        ctx.arc(c.x + 150, 650, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        text(ctx, 'tiny, real value', c.x + 174, 660, {
          size: 25, weight: 400, color: M.correct, alpha: e.a * tinyA,
        });
      }
    });

    tag(ctx, 960, 220, 'the paper\u2019s example', {
      color: C.dim, alpha: exampleA * 0.9, size: 30, align: 'center',
    });
  },
};

// ---------------------------------------------------------------- 28

const twentyEight = {
  id: 's28-standard-vs-truth',
  title: 'Standard code vs the truth',
  start: start(41),
  end: start(42),
  draw(ctx, t) {
    const base = 0.9;
    const stdA = p(t, q.standard, 0.6);
    const zeroA = p(t, q.lossIsZero, 0.5);
    const pushA = p(t, q.noPush, 0.5);
    const truthA = p(t, q.truth, 0.6);
    const tinyLossA = p(t, q.tinyLoss, 0.5);
    const tinyPushA = p(t, q.tinyPush, 0.5);
    const ropeA = p(t, q.rope, 0.7);
    const cutA = p(t, q.cut, 0.7);
    const sumA = p(t, q.noSum, 0.6);

    text(ctx, 'scores 9 \u00b7 \u22129 \u00b7 \u22129', 960, 220, {
      size: 32, weight: 400, color: C.muted, align: 'center', alpha: 0.9,
    });

    // Standard.
    card(ctx, 180, 270, 720, 370, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
      accent: C.red, accentW: 3, alpha: base * 0.92,
    });
    tag(ctx, 220, 330, 'standard code', { color: M.bug, alpha: 0.9, size: 30 });
    text(ctx, 'loss = 0', 220, 456, {
      size: 62, weight: 500, color: M.bug, alpha: zeroA, ls: -2,
    });
    text(ctx, 'right word: no push', 220, 526, {
      size: 32, weight: 400, color: C.muted, alpha: pushA,
    });
    card(ctx, 220, 566, 420, 16, {
      fill: 'rgba(248,248,242,0.10)', stroke: null, r: 8, alpha: pushA,
    });

    // Truth.
    card(ctx, 1020, 270, 720, 370, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
      accent: C.green, accentW: 3, alpha: base * 0.92,
    });
    tag(ctx, 1060, 330, 'the truth', { color: M.correct, alpha: 0.9, size: 30 });
    text(ctx, 'loss = tiny', 1060, 456, {
      size: 62, weight: 500, color: M.correct, alpha: tinyLossA, ls: -2,
    });
    text(ctx, 'right word: tiny push', 1060, 526, {
      size: 32, weight: 400, color: C.muted, alpha: tinyPushA,
    });
    card(ctx, 1060, 566, 44, 16, {
      fill: M.correct, stroke: null, r: 8, alpha: tinyPushA,
    });

    // Ghost rope.
    if (ropeA < 0.99) {
      line(ctx, 280, 780, 1660, 780, {
        color: 'rgba(184,185,197,0.35)', width: 5, alpha: base * 0.28, rough: 0,
      });
    }
    // The rope, cut.
    if (ropeA > 0.001) {
      const y = 780;
      const cut = 1140;
      strokePath(ctx, [[280, y], [500, y + 8], [800, y + 2], [1080, y + 6]], {
        color: 'rgba(184,185,197,0.6)', width: 6, alpha: ropeA, rough: 0.2,
      });
      strokePath(ctx, [[1200, y + 8], [1440, y + 2], [1660, y + 8]], {
        color: 'rgba(184,185,197,0.4)', width: 6, alpha: ropeA, rough: 0.2,
      });
      for (let x = 320; x < 1640; x += 52) {
        if (x > cut - 20 && x < cut + 40) continue;
        line(ctx, x - 8, y - 6, x + 8, y + 14, {
          color: 'rgba(49,51,66,0.85)', width: 2.6, alpha: ropeA, rough: 0,
        });
      }
      if (cutA > 0.01) {
        strokePath(ctx, [[cut - 14, y - 50], [cut, y - 8], [cut + 18, y - 32], [cut + 10, y + 22], [cut + 26, y + 52]], {
          color: M.bug, width: 3, alpha: cutA, rough: 0.8,
        });
        text(ctx, 'sum \u2260 0', 960, 920, {
          size: 52, weight: 500, color: M.bug, align: 'center', alpha: sumA,
        });
      }
    }
  },
};

// ---------------------------------------------------------------- 29

const twentyNine = {
  id: 's29-precision-cliff',
  title: 'The precision cliff',
  start: start(42),
  end: start(45),
  draw(ctx, t) {
    const base = 0.9;
    const headA = p(t, 378.3, 0.6);
    const tooA = p(t, q.tooSmall, 0.6);
    const adamA = p(t, q.adamMatter, 0.6);

    text(ctx, 'the precision cliff', 960, 218, {
      size: 50, weight: 450, color: C.fg, align: 'center', alpha: headA, ls: -0.6,
    });

    const rows = [
      { label: 'BF16', lead: 5.5, cue: q.bf16, num: q.lead55, color: M.gate },
      { label: 'FP32', lead: 16.6, cue: q.fp32, num: q.lead166, color: M.thought },
      { label: 'FP64', lead: 36.7, cue: q.fp64, num: q.lead367, color: M.correct },
    ];
    const x0 = 500;
    const x1 = 1600;
    const scale = (v) => x0 + (v / 40) * (x1 - x0);

    rows.forEach((r, i) => {
      const yy = 320 + i * 150;
      const e = p(t, r.cue, 0.6);
      if (e <= 0.001) {
        // ghost track
        line(ctx, x0, yy, x1, yy, {
          color: 'rgba(248,248,242,0.10)', width: 10, alpha: base * 0.34, rough: 0,
        });
        text(ctx, r.label, 300, yy + 10, {
          size: 36, weight: 400, color: C.dim, alpha: base * 0.34,
        });
        return;
      }
      text(ctx, r.label, 300, yy + 10, {
        size: 38, weight: 500, color: C.fg, alpha: e,
      });
      // track
      line(ctx, x0, yy, x1, yy, {
        color: 'rgba(248,248,242,0.12)', width: 10, alpha: e * 0.8, rough: 0,
      });
      // safe zone
      line(ctx, x0, yy, scale(r.lead), yy, {
        color: 'rgba(139,233,253,0.55)', width: 8, alpha: e * 0.75, rough: 0,
      });
      // bug zone
      ctx.save();
      ctx.globalAlpha = e * 0.16;
      ctx.fillStyle = M.bug;
      ctx.fillRect(scale(r.lead), yy - 9, x1 - scale(r.lead), 18);
      ctx.restore();
      // cliff edge
      line(ctx, scale(r.lead), yy - 30, scale(r.lead), yy + 30, {
        color: M.bug, width: 3, alpha: e, rough: 0,
      });
      text(ctx, String(r.lead), scale(r.lead) + 14, yy + 48, {
        size: 34, weight: 500, color: M.bug, alpha: p(t, r.num, 0.5),
      });
      tag(ctx, scale(r.lead) - 14, yy - 38, 'cliff', {
        color: M.bug, alpha: e * 0.8, size: 24, align: 'right',
      });
    });

    // Lead axis.
    axes(ctx, x0, 760, 1100, 40, { alpha: base * 0.5, size: 26 });
    [0, 10, 20, 30, 40].forEach((v) => {
      const x = scale(v);
      line(ctx, x, 800, x, 812, { color: 'rgba(248,248,242,0.2)', width: 1.2, rough: 0, alpha: base * 0.6 });
      text(ctx, String(v), x, 842, {
        size: 26, weight: 400, color: C.dim, align: 'center', alpha: base * 0.7,
      });
    });
    text(ctx, 'lead', 1620, 806, { size: 28, color: C.dim, alpha: base * 0.7 });

    if (tooA > 0.001) {
      text(ctx, '5.5 sounds too small to matter', 960, 892, {
        size: 34, weight: 400, color: C.muted, align: 'center', alpha: tooA * 0.95,
      });
    }
    if (adamA > 0.001) {
      text(ctx, 'but Adam makes it matter', 960, 948, {
        size: 44, weight: 500, color: M.word, align: 'center', alpha: adamA,
      });
    }
  },
};

// ---------------------------------------------------------------- 30

const thirty = {
  id: 's30-adam',
  title: 'Adam turns it up',
  start: start(45),
  end: start(46),
  draw(ctx, t) {
    const base = 0.9;
    const headA = p(t, q.adam, 0.6);
    const quietA = p(t, q.quiet, 0.6);
    const loudA = p(t, q.loud, 0.6);
    const usuallyA = p(t, q.usually, 0.6);
    const errorA = p(t, q.errorTiny, 0.6);
    const lopsA = p(t, q.lopsided, 0.6);
    const sameA = p(t, q.sameWay, 0.6);
    const turnA = p(t, q.turnsUp, 0.7);
    const steadyA = p(t, q.steady, 0.6);
    const dim = 1 - 0.35 * errorA;

    text(ctx, 'Adam', 960, 206, {
      size: 48, weight: 500, color: C.fg, align: 'center', alpha: headA, ls: -0.8,
    });
    text(ctx, 'the default optimizer', 960, 252, {
      size: 28, weight: 400, color: C.muted, align: 'center',
      alpha: p(t, q.adamIdea, 0.6) * 0.9,
    });

    // Quiet card.
    const qGhost = 0.18 + 0.82 * quietA;
    card(ctx, 170, 300, 740, 300, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20, alpha: base * qGhost * 0.9 * dim,
    });
    tag(ctx, 210, 356, 'quiet weight', { color: C.muted, alpha: (0.22 + 0.78 * quietA) * 0.9, size: 30 });
    const qbars = [20, 30, 24, 36];
    qbars.forEach((h, i) => {
      card(ctx, 250 + i * 70, 520 - h, 34, h, {
        fill: 'rgba(184,185,197,0.45)', stroke: null, r: 4, alpha: qGhost * dim,
      });
    });
    arrow(ctx, 580, 470, 780, 470, {
      color: C.green, width: 3, progress: quietA, head: 14,
    });
    tag(ctx, 596, 530, 'big steps', { color: C.green, alpha: quietA * 0.9, size: 28 });

    // Loud card.
    const lGhost = 0.18 + 0.82 * loudA;
    card(ctx, 1010, 300, 740, 300, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20, alpha: base * lGhost * 0.9 * dim,
    });
    tag(ctx, 1050, 356, 'loud weight', { color: C.muted, alpha: (0.22 + 0.78 * loudA) * 0.9, size: 30 });
    const lbars = [80, 104, 92, 116];
    lbars.forEach((h, i) => {
      card(ctx, 1090 + i * 70, 520 - h, 34, h, {
        fill: 'rgba(184,185,197,0.55)', stroke: null, r: 4, alpha: lGhost * dim,
      });
    });
    arrow(ctx, 1400, 470, 1480, 470, {
      color: M.muted, width: 3, progress: loudA, head: 14,
    });
    tag(ctx, 1416, 530, 'small steps', { color: C.muted, alpha: loudA * 0.9, size: 28 });

    if (usuallyA > 0.001) {
      tag(ctx, 960, 648, 'usually great', {
        color: C.green, alpha: usuallyA * (1 - 0.8 * errorA) * 0.95, size: 30, align: 'center',
      });
    }

    // The bug: tiny, lopsided, same direction.
    if (errorA > 0.001) {
      text(ctx, 'but here the error is tiny', 960, 700, {
        size: 32, weight: 400, color: C.muted, align: 'center', alpha: errorA * 0.95,
      });
      // six tiny pushes
      for (let i = 0; i < 6; i++) {
        const x = 330 + i * 95;
        const a = errorA * (0.5 + 0.5 * p(t, q.sameWay + i * 0.08, 0.4));
        arrow(ctx, x, 790, x + 58, 790, {
          color: M.bug, width: 2.6, alpha: a, head: 9,
        });
      }
      text(ctx, 'same direction every step', 620, 850, {
        size: 28, weight: 400, color: C.muted, align: 'center', alpha: sameA * 0.9,
      });
      if (turnA > 0.001) {
        arrow(ctx, 1060, 800, 1440, 800, {
          color: M.bug, width: 5, progress: turnA, head: 18,
        });
        text(ctx, 'Adam turns it up', 1250, 748, {
          size: 30, weight: 400, color: M.bug, align: 'center', alpha: turnA * 0.95,
        });
        text(ctx, 'steady push', 1250, 870, {
          size: 42, weight: 500, color: M.bug, align: 'center', alpha: steadyA,
        });
      }
    }
  },
};

// ---------------------------------------------------------------- 31

const thirtyOne = {
  id: 's31-explains',
  title: 'The paper explains both',
  start: start(46),
  end: start(47),
  draw(ctx, t) {
    const base = 0.9;
    const curveA = p(t, q.explains, 1.1);
    const decayA = p(t, q.decay, 0.9);

    text(ctx, 'the paper explains', 300, 250, {
      size: 30, weight: 400, color: C.dim, alpha: p(t, q.explains, 0.6) * 0.9,
    });
    axes(ctx, 300, 300, 1080, 440, {
      alpha: base * 0.7, xLabel: 'training', yLabel: 'loss', size: 26,
    });
    if (curveA < 0.98) {
      lossCurve(ctx, 300, 300, 1080, 440, {
        kind: 'sling', color: 'rgba(248,248,242,0.5)', width: 2.6, alpha: 0.35,
        progress: 1,
      });
    }
    lossCurve(ctx, 300, 300, 1080, 440, {
      kind: 'sling', color: M.gate, width: 3, alpha: 0.9, progress: curveA,
      markers: [[0.335, 0.67], [0.5, 0.78]],
    });
    if (decayA > 0.001) {
      lossCurve(ctx, 300, 300, 1080, 440, {
        kind: 'never', color: 'rgba(255,184,108,0.7)', width: 2.2,
        alpha: 0.8, progress: decayA,
      });
      tag(ctx, 1430, 690, 'fails to grok', {
        color: M.word, alpha: decayA * 0.95, size: 30, align: 'right',
      });
      tag(ctx, 1430, 736, 'with weight decay', {
        color: M.word, alpha: decayA * 0.9, size: 28, align: 'right',
      });
    }
    tag(ctx, 1430, 360, 'slingshot spikes', {
      color: M.bug, alpha: curveA * 0.95, size: 30, align: 'right',
    });
  },
};

export default [twentySix, twentySeven, twentyEight, twentyNine, thirty, thirtyOne];
