import {
  C, F, W, H, clamp, lerp, p, enter, easeInOut, easeOutCubic, card, text, line,
  arrow, strokePath, underline, measure, numberedChip, rr,
} from '../kit.js';
import {
  M, tag, chip, statement, gate, flow, pathFlow, thoughtRow, wordPill,
  relativeBar, probList, stat,
} from '../motifs.js';
import { at, start } from '../data/timeline.js';

const q = {
  smallGap: at('small gap in score', 20),
  widen: at('widen the gap', 20),
  winner: at('winner takes almost everything', 20),
  remember: at('remember that', 20),

  learn: at('how does the model learn', 21),
  answer: at('show it the right answer', 21),
  surprised: at('measure how surprised', 21),
  eightyFour: at('84 percent', 21),
  onePercent: at('one percent', 21),
  cross: at('cross-entropy loss', 21),

  key: at('which scores should move', 22),
  gradient: at('gradient', 22),
  simple: at('answer is simple', 22),
  every: at('for every word', 22),
  chance: at('chance you gave it', 22),
  minus: at('minus one', 22),

  add: at('add those up', 23),
  zero: at('always get zero', 23),
  push: at('every push toward', 23),
  tug: at('tug of war', 23),
  rememberRule: at('remember that rule', 23),
  breaking: at('rule breaking', 23),

  lastStep: at('one last step', 24),
  picks: at('picks a word', 24),
  writes: at('writes it down', 24),
  turns: at('turns it back into numbers', 24),
  token: at('token', 24),
  embedding: at('embedding', 24),
  loop: at('loop starts again', 24),
  chant: at('think score chances', 25),
  chantPick: at('pick a word', 25),
  chantFeed: at('feed it back', 25),

  twoWeak: at('two weak spots', 26),
  softmaxStep: at('softmax step', 26),
  pickStep: at('pick-a-word step', 26),
  decision: at('decision model', 27),
  reads: at('reads the question once', 27),
  stops: at('stops right after the chances', 27),
  hands: at('hands them back', 27),
  noPick: at('no picking', 27),
  noLoop: at('no looping', 27),
};

// ---------------------------------------------------------------- 14

const fourteen = {
  id: 's14-gap',
  title: 'Small score gap, big chance gap',
  start: start(20),
  end: start(21),
  draw(ctx, t) {
    const base = 0.92;
    const widen = easeInOut(p(t, q.widen, 1.15));
    const winnerA = p(t, q.winner, 0.6);
    const rememberA = p(t, q.remember, 0.6);

    const scores = [3, 1, 0];
    const scoreF = [lerp(0.58, 0.95, widen), lerp(0.22, 0.13, widen), lerp(0.08, 0.04, widen)];
    const chanceF = [lerp(0.84, 0.986, widen), lerp(0.11, 0.011, widen), lerp(0.04, 0.003, widen)];

    // Left card.
    card(ctx, 170, 300, 640, 400, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20, alpha: base * 0.9,
    });
    tag(ctx, 214, 354, 'scores', { color: M.logits, alpha: base * 0.9, size: 30 });
    ['A', 'B', 'C'].forEach((l, i) => {
      const yy = 410 + i * 82;
      text(ctx, l, 240, yy + 16, {
        size: 38, weight: 500, color: C.muted, baseline: 'middle', alpha: base,
      });
      relativeBar(ctx, 300, yy, 400, 32, scoreF[i], {
        color: M.logits, alpha: base, progress: p(t, q.smallGap + i * 0.1, 0.6),
      });
      text(ctx, String(scores[i]), 730, yy + 16, {
        size: 38, weight: 500, color: M.logits, align: 'right', baseline: 'middle',
        alpha: base * (1 - widen),
      });
    });

    // Gate motif in the middle.
    gate(ctx, 960, 500, 90, 250, {
      alpha: base * 0.9, open: 0.3 + 0.7 * widen, accent: M.gate, label: null,
    });
    text(ctx, 'softmax', 960, 664, {
      size: 30, weight: 400, color: C.muted, align: 'center', alpha: base,
    });

    // Right card.
    card(ctx, 1110, 300, 640, 400, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20, alpha: base * 0.9,
    });
    tag(ctx, 1154, 354, 'chances', { color: M.gate, alpha: base * 0.9, size: 30 });
    ['A', 'B', 'C'].forEach((l, i) => {
      const yy = 410 + i * 82;
      text(ctx, l, 1180, yy + 16, {
        size: 38, weight: 500, color: C.muted, baseline: 'middle', alpha: base,
      });
      relativeBar(ctx, 1240, yy, 380, 32, chanceF[i], {
        color: M.gate, alpha: base, progress: p(t, q.smallGap + 0.2 + i * 0.08, 0.6),
      });
      text(ctx, `${['84', '11', '4'][i]}%`, 1680, yy + 16, {
        size: 34, weight: 500, color: M.gate, align: 'right', baseline: 'middle',
        alpha: base * (1 - widen),
      });
    });

    if (winnerA > 0.001) {
      text(ctx, 'the winner takes almost everything', 960, 790, {
        size: 42, weight: 450, color: C.fg, align: 'center', alpha: winnerA, ls: -0.6,
      });
    }
    if (rememberA > 0.001) {
      tag(ctx, 960, 858, 'remember this', {
        color: M.logits, alpha: rememberA * 0.95, size: 32, align: 'center',
      });
    }
  },
};

// ---------------------------------------------------------------- 15

const fifteen = {
  id: 's15-loss',
  title: 'Surprise is the loss',
  start: start(21),
  end: start(22),
  draw(ctx, t) {
    const base = 0.92;
    const answerA = p(t, q.answer, 0.6);
    const leftA = p(t, q.eightyFour, 0.6);
    const rightA = p(t, q.onePercent, 0.6);
    const crossA = p(t, q.cross, 0.6);

    // The right answer.
    tag(ctx, 960, 220, 'the right answer', {
      color: C.dim, alpha: (0.16 + 0.84 * answerA) * 0.9, size: 30, align: 'center',
    });
    if (answerA < 0.99) {
      card(ctx, 870, 244, 180, 62, {
        fill: 'rgba(49,51,66,0.18)', stroke: 'rgba(80,250,123,0.28)', r: 31,
        lw: 1.3, dash: [7, 7], alpha: base * 0.18,
      });
    }
    if (answerA > 0.001) {
      wordPill(ctx, 872, 272, 'cat', { size: 44, alpha: answerA });
    }

    const cardY = 378;
    const cardH = 340;
    // Left scenario.
    const lGhost = 0.55 + 0.45 * leftA;
    card(ctx, 200, cardY, 720, cardH, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
      accent: C.green, accentW: 3, alpha: base * lGhost,
    });
    text(ctx, 'gave it 84%', 250, cardY + 64, {
      size: 38, weight: 400, color: C.muted, alpha: base * lGhost,
    });
    text(ctx, '84%', 250, cardY + 190, {
      size: 126, weight: 500, color: C.gate, alpha: leftA, ls: -4,
    });
    text(ctx, 'small surprise', 250, cardY + 258, {
      size: 36, weight: 400, color: C.green, alpha: leftA,
    });
    // surprise meter: 1 of 3
    for (let i = 0; i < 3; i++) {
      card(ctx, 250 + i * 92, cardY + 290, 76, 16, {
        fill: i === 0 ? C.green : 'rgba(248,248,242,0.10)',
        stroke: null, r: 8, alpha: leftA,
      });
    }

    // Right scenario.
    const rGhost = 0.55 + 0.45 * rightA;
    card(ctx, 1000, cardY, 720, cardH, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20,
      accent: C.red, accentW: 3, alpha: base * rGhost,
    });
    text(ctx, 'gave it 1%', 1050, cardY + 64, {
      size: 38, weight: 400, color: C.muted, alpha: base * rGhost,
    });
    text(ctx, '1%', 1050, cardY + 190, {
      size: 126, weight: 500, color: M.bug, alpha: rightA, ls: -4,
    });
    text(ctx, 'big surprise', 1050, cardY + 258, {
      size: 36, weight: 400, color: M.bug, alpha: rightA,
    });
    for (let i = 0; i < 3; i++) {
      card(ctx, 1050 + i * 92, cardY + 290, 76, 16, {
        fill: M.bug, stroke: null, r: 8, alpha: rightA,
      });
    }

    // The name of the number.
    if (crossA > 0.001) {
      text(ctx, 'cross-entropy loss', 960, 850, {
        size: 54, weight: 500, color: C.fg, align: 'center', alpha: crossA,
      });
      text(ctx, 'the surprise number is called', 960, 900, {
        size: 29, weight: 400, color: C.dim, align: 'center', alpha: crossA * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 16

const sixteen = {
  id: 's16-gradient',
  title: 'Chance minus one',
  start: start(22),
  end: start(23),
  draw(ctx, t) {
    const base = 0.92;
    const headA = p(t, q.key, 0.6);
    const gradHead = p(t, q.gradient, 0.6);
    const everyA = p(t, q.every, 0.6);
    const minusT = p(t, q.minus, 0.8);
    const simpleA = p(t, q.simple, 0.6);

    text(ctx, 'which scores should move?', 960, 220, {
      size: 46, weight: 450, color: C.fg, align: 'center', alpha: headA, ls: -0.6,
    });

    tag(ctx, 380, 304, 'chance', { color: M.gate, alpha: 0.95, size: 30 });
    tag(ctx, 1260, 304, 'gradient', {
      color: M.green, alpha: (0.18 + 0.82 * gradHead) * 0.95, size: 30,
    });

    const rows = [
      { label: 'cat', chance: 0.84, grad: 0.84, right: true },
      { label: 'dog', chance: 0.11, grad: 0.11, right: false },
      { label: 'sat', chance: 0.04, grad: 0.04, right: false },
    ];

    const zero = 1440;
    rows.forEach((r, i) => {
      const yy = 370 + i * 130;
      const a = base * (r.right ? 1 : 0.82);
      text(ctx, r.label, 250, yy + 18, {
        size: 38, weight: r.right ? 600 : 400, color: r.right ? C.fg : C.muted,
        baseline: 'middle', alpha: a,
      });
      if (r.right) {
        tag(ctx, 250, yy - 34, 'right word', { color: C.green, alpha: a * 0.9, size: 26 });
      }

      // chance bar — already known from the previous beat
      relativeBar(ctx, 380, yy, 480, 34, r.chance, {
        color: M.gate, alpha: a, progress: p(t, 188.5 + i * 0.08, 0.7),
      });

      // connector
      const connA = p(t, q.every + 0.25 + i * 0.08, 0.5);
      line(ctx, 900, yy + 17, 1080, yy + 17, {
        color: 'rgba(248,248,242,0.16)', width: 1.4, alpha: a * connA, rough: 0,
      });
      arrow(ctx, 1060, yy + 17, 1110, yy + 17, {
        color: 'rgba(248,248,242,0.3)', width: 1.4, progress: connA, head: 7,
      });

      // gradient arrow (signed, direction is the point)
      const gf = r.right ? -0.16 : r.grad;
      const gp = p(t, q.minus + i * 0.07, 0.65);
      const bw = Math.abs(gf) * 800 * gp;
      if (bw > 2) {
        arrow(ctx, zero, yy + 17, gf >= 0 ? zero + bw : zero - bw, yy + 17, {
          color: gf >= 0 ? M.green : M.bug, width: 4, progress: gp, head: 13,
        });
      }
      line(ctx, zero, yy - 8, zero, yy + 46, {
        color: 'rgba(248,248,242,0.2)', width: 1.2, rough: 0, alpha: a,
      });
    });

    if (minusT > 0.001) {
      text(ctx, '−1', 1060, 406, {
        size: 48, weight: 500, color: C.green, align: 'center', alpha: minusT,
      });
      text(ctx, 'the right word only', 1060, 444, {
        size: 25, weight: 400, color: C.dim, align: 'center', alpha: minusT * 0.9,
      });
    }

    if (simpleA > 0.001) {
      text(ctx, 'right word:  chance − 1', 960, 850, {
        size: 34, weight: 500, color: C.fg, align: 'center', alpha: simpleA,
      });
      text(ctx, 'the rest:  chance', 960, 898, {
        size: 30, weight: 400, color: C.muted, align: 'center', alpha: simpleA * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 17

const seventeen = {
  id: 's17-zero-sum',
  title: 'A tug of war with a fixed rope',
  start: start(23),
  end: start(24),
  draw(ctx, t) {
    const base = 0.92;
    const zeroA = p(t, q.zero, 0.6);
    const pushA = p(t, q.push, 0.7);
    const tugA = p(t, q.tug, 0.6);
    const rememberA = p(t, q.rememberRule, 0.6);
    const breakA = p(t, q.breaking, 0.8);

    // Rope.
    const rope = [[300, 520], [520, 530], [760, 536], [960, 538], [1160, 536], [1400, 530], [1620, 520]];
    const cut = 1320;
    const leftRope = rope.filter((pt) => pt[0] <= cut);
    const rightRope = rope.filter((pt) => pt[0] >= cut);
    if (breakA < 0.6) {
      strokePath(ctx, rope, {
        color: 'rgba(184,185,197,0.62)', width: 7, alpha: base, rough: 0.3,
      });
    } else {
      strokePath(ctx, leftRope, {
        color: 'rgba(184,185,197,0.62)', width: 7, alpha: base, rough: 0.3,
      });
      // The right side goes slack.
      const slackY = 520 + breakA * 54;
      strokePath(ctx, [[cut, slackY], [1450, slackY + 26], [1620, slackY + 8]], {
        color: 'rgba(184,185,197,0.4)', width: 6, alpha: base, rough: 0.3,
      });
    }

    // Twist marks.
    for (let x = 340; x < 1600; x += 46) {
      if (breakA > 0.5 && x > cut - 20 && x < cut + 30) continue;
      line(ctx, x - 8, 512, x + 8, 548, {
        color: 'rgba(49,51,66,0.85)', width: 3, alpha: base, rough: 0,
      });
    }

    // Center knot.
    ctx.save();
    ctx.globalAlpha = base;
    ctx.fillStyle = C.bg;
    ctx.beginPath();
    ctx.arc(960, 538, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(248,248,242,0.5)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Pull arrows.
    const pull = 0.55 + 0.45 * Math.sin(t * 1.2) * 0.4 + tugA * 0.15;
    // The words on each side of the rope.
    const wrongWords = [['dog', 400], ['sat', 600], ['the', 800]];
    wrongWords.forEach(([w, x]) => {
      text(ctx, w, x, 614, {
        size: 32, weight: 400, color: 'rgba(248,248,242,0.58)', align: 'center', alpha: base * 0.9,
      });
    });
    text(ctx, 'cat', 1500, 614, {
      size: 34, weight: 500, color: C.green, align: 'center', alpha: base,
    });

    for (const x of [450, 620, 790]) {
      arrow(ctx, x + 70, 666, x - 50, 666, {
        color: M.bug, width: 2.4, alpha: base * (0.55 + pushA * 0.35), head: 12, progress: 1,
      });
    }
    arrow(ctx, 1450, 666, 1570, 666, {
      color: C.green, width: 2.4, alpha: base * 0.85, head: 12, progress: 1,
    });
    tag(ctx, 620, 724, 'wrong words', { color: M.bug, alpha: base * 0.9, size: 30, align: 'center' });
    tag(ctx, 1500, 724, 'the right word', { color: C.green, alpha: base * 0.9, size: 30, align: 'center' });

    // Sum.
    if (zeroA > 0.001) {
      text(ctx, 'sum = 0', 960, 380, {
        size: 64, weight: 500, color: C.fg, align: 'center',
        alpha: zeroA * (1 - p(t, q.breaking, 0.4)),
      });
    }
    if (breakA > 0.4) {
      text(ctx, 'sum ≠ 0', 960, 380, {
        size: 64, weight: 500, color: M.bug, align: 'center', alpha: p(t, q.breaking + 0.1, 0.5),
      });
    }

    if (tugA > 0.001) {
      text(ctx, 'a fixed rope', 960, 792, {
        size: 34, weight: 400, color: C.muted, align: 'center', alpha: tugA * 0.95,
      });
    }
    if (rememberA > 0.001) {
      tag(ctx, 960, 850, 'remember this rule', {
        color: M.logits, alpha: rememberA * 0.9, size: 30, align: 'center',
      });
    }

    // The cut.
    if (breakA > 0.05) {
      const x = cut;
      strokePath(ctx, [[x - 18, 492], [x - 4, 522], [x + 14, 498], [x + 18, 540], [x + 2, 566], [x + 20, 592]], {
        color: M.bug, width: 3, alpha: breakA, rough: 0.8,
      });
      text(ctx, 'the rule breaks', 960, 930, {
        size: 42, weight: 500, color: M.bug, align: 'center', alpha: breakA,
      });
    }
  },
};

// ---------------------------------------------------------------- 18

const eighteen = {
  id: 's18-token',
  title: 'Token, embedding, feed it back',
  start: start(24),
  end: 227.4,
  draw(ctx, t) {
    const base = 0.92;
    const pickA = p(t, q.picks, 0.55);
    const writeA = p(t, q.writes, 0.55);
    const turnA = p(t, q.turns, 0.7);
    const tokenA = p(t, q.token, 0.5);
    const embA = p(t, q.embedding, 0.5);
    const loopA = p(t, q.loop, 0.8);
    const chantA = p(t, q.chant, 0.5);

    // Ghost scaffold for the parts not yet revealed.
    if (pickA < 0.99) {
      const gh = base * 0.24;
      card(ctx, 584, 428, 120, 64, {
        fill: 'rgba(49,51,66,0.2)', stroke: 'rgba(255,184,108,0.28)', r: 32,
        lw: 1.3, dash: [7, 7], alpha: gh,
      });
      card(ctx, 820, 398, 240, 136, {
        fill: 'rgba(49,51,66,0.2)', stroke: 'rgba(255,184,108,0.22)', r: 16,
        lw: 1.3, dash: [7, 7], alpha: gh,
      });
      card(ctx, 1180, 438, 360, 56, {
        fill: 'rgba(49,51,66,0.2)', stroke: 'rgba(189,147,249,0.25)', r: 8,
        lw: 1.3, dash: [7, 7], alpha: gh,
      });
      strokePath(ctx, [[1560, 510], [1560, 660], [300, 660], [300, 560]], {
        color: 'rgba(139,233,253,0.4)', width: 2, alpha: gh, rough: 0.2, dash: [8, 8],
      });
    }

    // Pipeline.
    card(ctx, 150, 390, 290, 150, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 18,
      accent: M.gate, accentW: 3, alpha: base,
    });
    text(ctx, 'model', 186, 464, { size: 40, weight: 500, color: C.fg, alpha: base });

    arrow(ctx, 450, 466, 566, 466, {
      color: 'rgba(248,248,242,0.34)', width: 2, progress: base, head: 9,
    });
    if (pickA > 0.001) {
      wordPill(ctx, 586, 430, 'cat', { size: 38, alpha: pickA });
      tag(ctx, 586, 522, 'picked', { color: C.dim, alpha: pickA * 0.8, size: 26 });
    }
    arrow(ctx, 700, 466, 802, 466, {
      color: 'rgba(248,248,242,0.34)', width: 2, progress: writeA, head: 9,
    });

    // Token card.
    if (writeA > 0.001) {
      card(ctx, 820, 398, 240, 136, {
        fill: C.surface2, stroke: 'rgba(255,184,108,0.42)', r: 16, lw: 1.6, alpha: writeA,
      });
      text(ctx, 'token', 940, 462, {
        size: 40, weight: 500, color: M.word, align: 'center', alpha: writeA,
      });
      text(ctx, 'written down', 940, 504, {
        size: 26, weight: 400, color: C.muted, align: 'center', alpha: writeA * 0.9,
      });
      if (tokenA > 0.001) {
        tag(ctx, 940, 350, 'the token', { color: C.dim, alpha: tokenA * 0.9, size: 28, align: 'center' });
      }
    }
    arrow(ctx, 1068, 466, 1160, 466, {
      color: 'rgba(248,248,242,0.34)', width: 2, progress: turnA, head: 9,
    });

    // Embedding.
    if (turnA > 0.001) {
      thoughtRow(ctx, 1180, 438, 360, 56, {
        cells: 12, color: M.thought, alpha: turnA, progress: turnA,
      });
      if (embA > 0.001) {
        tag(ctx, 1360, 528, 'the embedding', { color: C.dim, alpha: embA * 0.9, size: 28, align: 'center' });
      }
    }

    // Loop back.
    if (loopA > 0.001) {
      const pts = [[1560, 510], [1560, 660], [300, 660], [300, 560]];
      strokePath(ctx, pts, {
        color: 'rgba(139,233,253,0.55)', width: 2.4, alpha: loopA,
        progress: p(t, q.loop, 0.8), rough: 0.3,
      });
      arrow(ctx, 300, 620, 300, 566, {
        color: 'rgba(139,233,253,0.8)', width: 2.2, progress: p(t, q.loop + 0.5, 0.4), head: 11,
      });
      pathFlow(ctx, pts, {
        color: M.gate, alpha: loopA * 0.8, progress: p(t, q.loop, 0.8),
        n: 9, t, size: 4, speed: 0.1, seed: 6,
      });
      text(ctx, 'feed it back', 960, 716, {
        size: 34, weight: 400, color: C.muted, align: 'center', alpha: loopA * 0.95,
      });
    }

    // The five-word chain.
    const steps = ['think', 'score', 'chances', 'pick', 'feed'];
    const xs = [330, 645, 960, 1275, 1590];
    const cues = [q.chant, q.chant + 0.45, q.chant + 0.95, q.chantPick, q.chantFeed];
    if (chantA < 0.99) {
      steps.forEach((s, i) => {
        text(ctx, s, xs[i], 870, {
          size: 38, weight: 500, color: C.dim, align: 'center', alpha: base * 0.24 * (1 - chantA),
        });
      });
    }
    steps.forEach((s, i) => {
      const a = chantA * p(t, cues[i], 0.4);
      text(ctx, s, xs[i], 870, {
        size: 38, weight: 500, color: i === 2 ? M.gate : C.fg, align: 'center', alpha: a,
      });
      if (i < steps.length - 1) {
        const arrA = chantA * p(t, cues[i] + 0.2, 0.4);
        arrow(ctx, xs[i] + 64, 854, xs[i + 1] - 64, 854, {
          color: 'rgba(248,248,242,0.25)', width: 1.6, progress: arrA, head: 7,
        });
      }
    });
    if (chantA > 0.001) {
      text(ctx, 'one step, then the next', 960, 940, {
        size: 28, weight: 400, color: C.dim, align: 'center', alpha: chantA * 0.8,
      });
    }
  },
};

// ---------------------------------------------------------------- 19

const nineteen = {
  id: 's19-two-weak-spots',
  title: 'Two weak spots',
  start: 227.4,
  end: start(28),
  draw(ctx, t) {
    const base = 0.92;
    const pinA = p(t, q.twoWeak, 0.6);
    const softA = p(t, q.softmaxStep, 0.5);
    const pickA = p(t, q.pickStep, 0.5);
    const decisionA = p(t, q.decision, 0.8);
    const noA = p(t, q.noPick, 0.5);
    const loopA = p(t, q.noLoop, 0.5);
    const dim = 1 - 0.6 * decisionA;

    text(ctx, 'two weak spots', 960, 200, {
      size: 44, weight: 450, color: C.muted, align: 'center',
      alpha: p(t, q.twoWeak, 0.6) * (1 - decisionA) * 0.95, ls: -0.5,
    });

    // The normal loop.
    ctx.save();
    ctx.globalAlpha = dim;
    card(ctx, 150, 360, 260, 120, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 15, alpha: base,
    });
    text(ctx, 'text', 182, 426, { size: 36, weight: 500, color: C.fg, alpha: base });
    arrow(ctx, 416, 420, 492, 420, {
      color: 'rgba(248,248,242,0.32)', width: 1.8, progress: base, head: 8,
    });
    card(ctx, 500, 340, 260, 160, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.15)', r: 16,
      accent: M.gate, accentW: 3, alpha: base,
    });
    text(ctx, 'model', 534, 424, { size: 38, weight: 500, color: C.fg, alpha: base });
    arrow(ctx, 766, 420, 816, 420, {
      color: 'rgba(248,248,242,0.32)', width: 1.8, progress: base, head: 8,
    });
    gate(ctx, 884, 420, 120, 160, {
      alpha: base, open: 1, accent: M.gate,
      glow: softA > 0.2 ? 18 : 0,
    });
    text(ctx, 'softmax', 884, 540, {
      size: 28, weight: 400, color: softA > 0.2 ? M.gate : C.muted, align: 'center',
      alpha: base,
    });
    arrow(ctx, 948, 420, 1012, 420, {
      color: 'rgba(248,248,242,0.32)', width: 1.8, progress: base, head: 8,
    });
    wordPill(ctx, 1030, 392, 'cat', {
      size: 32, alpha: p(t, q.picks, 0.5),
    });
    // feed loop
    strokePath(ctx, [[1110, 480], [1110, 610], [300, 610], [300, 490]], {
      color: 'rgba(139,233,253,0.4)', width: 2, alpha: base, rough: 0.2,
    });
    arrow(ctx, 300, 570, 300, 494, {
      color: 'rgba(139,233,253,0.6)', width: 2, progress: base, head: 9,
    });
    ctx.restore();

    // Two red pins.
    if (pinA > 0.001) {
      const pulse = 0.7 + 0.3 * Math.sin(t * 2.4);
      ctx.save();
      ctx.globalAlpha = pinA;
      for (const [x, y] of [[884, 342], [1090, 372]]) {
        ctx.fillStyle = M.bug;
        ctx.beginPath();
        ctx.arc(x, y, 8 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = pinA * 0.22;
        ctx.beginPath();
        ctx.arc(x, y, 18 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = pinA;
      }
      ctx.restore();
      text(ctx, 'softmax', 884, 308, {
        size: 30, weight: 500, color: M.bug, align: 'center', alpha: pinA * 0.95,
      });
      text(ctx, 'the pick', 1110, 338, {
        size: 30, weight: 500, color: M.bug, align: 'center', alpha: pinA * 0.95,
      });
    }

    // Ghost branch, so the frame has a base before the decision is named.
    if (decisionA < 0.99) {
      const gh = base * 0.14 * (1 - decisionA);
      card(ctx, 1180, 240, 440, 170, {
        fill: 'rgba(49,51,66,0.2)', stroke: 'rgba(139,233,253,0.25)', r: 18,
        lw: 1.3, dash: [7, 7], alpha: gh,
      });
      arrow(ctx, 950, 420, 1170, 300, {
        color: 'rgba(139,233,253,0.4)', width: 1.8, progress: 1, head: 8, curve: -30,
      });
    }

    // The decision branch.
    if (decisionA > 0.001) {
      arrow(ctx, 950, 420, 1170, 300, {
        color: 'rgba(139,233,253,0.55)', width: 2.2, progress: decisionA, head: 10, curve: -30,
      });
      card(ctx, 1180, 240, 440, 170, {
        fill: C.surface, stroke: 'rgba(139,233,253,0.4)', r: 18,
        accent: M.gate, accentW: 3, alpha: decisionA,
      });
      text(ctx, 'decision model', 1220, 306, {
        size: 36, weight: 500, color: C.fg, alpha: decisionA,
      });
      text(ctx, 'reads once, stops at chances', 1220, 350, {
        size: 26, weight: 400, color: C.muted, alpha: decisionA * 0.9,
      });
      text(ctx, 'hands them back', 1220, 386, {
        size: 26, weight: 400, color: M.gate, alpha: decisionA * 0.9,
      });
      arrow(ctx, 1400, 420, 1400, 470, {
        color: 'rgba(139,233,253,0.6)', width: 2, progress: p(t, q.hands, 0.5), head: 9,
      });
      if (noA > 0.001) {
        chip(ctx, 1220, 540, 'no picking', {
          size: 30, color: M.gate, border: 'rgba(139,233,253,0.35)',
          bg: 'rgba(49,51,66,0.5)', alpha: noA,
        });
      }
      if (loopA > 0.001) {
        chip(ctx, 1440, 540, 'no looping', {
          size: 30, color: M.gate, border: 'rgba(139,233,253,0.35)',
          bg: 'rgba(49,51,66,0.5)', alpha: loopA,
        });
      }
    }
  },
};

export default [fourteen, fifteen, sixteen, seventeen, eighteen, nineteen];
