import {
  C, F, W, H, clamp, p, enter, easeOutCubic, card, text, line, arrow,
  strokePath, underline, measure, numberedChip, rr,
} from '../kit.js';
import {
  M, tag, chip, statement, gate, leak, flow, pathFlow, scoreList, thoughtRow,
  wordPill, stat, axes, lossCurve,
} from '../motifs.js';
import { at, start } from '../data/timeline.js';

const q = {
  connected: at('two stories are connected', 6),
  twoThings: at('does two things', 6),
  scores: at('turns scores into chances', 6),
  picks: at('picks one word', 6),
  throws: at('throws everything else away', 6),

  questions: at('two questions', 7),
  one: at('one', 8),
  solid: at('how solid is it', 8),
  two: at('two', 9),
  squeezed: at('squeezed into a single word', 9),
  lose: at('how much do we lose', 9),

  three: at('three papers answer both', 10),
  newPapers: at('three new papers', 5),
  gate: at('gate between', 10),
  leaks: at('gate leaks', 10),
  push: at('push way too much', 10),

  test: at('one test in the second paper', 11),
  real: at('real or just filler', 11),
  table: at('show you the table', 11),
  zero: at('start from zero', 12),
  loop: at('without seeing the loop', 12),
};

// ---------------------------------------------------------------- 05

const five = {
  id: 's05-one-word',
  title: 'Scores into chances, then one word',
  start: start(6) + 0.44,
  end: start(7),
  draw(ctx, t) {
    const base = p(t, q.connected - 0.1, 0.8);
    const scoresA = p(t, q.twoThings, 0.6);
    const chancesA = p(t, q.scores, 0.6);
    const pickA = p(t, q.picks, 0.55);
    const throwA = p(t, q.throws, 0.7);
    const dim = 1 - 0.55 * throwA;

    // Ghost gate anchors the frame.
    gate(ctx, 980, 492, 250, 400, {
      alpha: base * 0.9, open: 0.15 + 0.85 * chancesA, accent: M.gate, label: null,
    });
    if (scoresA < 0.99) {
      const gh = base * 0.32 * (1 - scoresA);
      tag(ctx, 200, 318, 'scores', { color: M.logits, alpha: gh, size: 32 });
      tag(ctx, 1160, 318, 'chances', { color: M.gate, alpha: gh, size: 32 });
      tag(ctx, 1520, 318, 'one word', { color: M.word, alpha: gh, size: 32 });
      scoreList(ctx, 200, 372, 600, [
        { label: 'cat', value: 8.2 }, { label: 'dog', value: 1.1 },
        { label: 'sat', value: -2.4 }, { label: 'the', value: -4.9 },
      ], {
        max: 10, alpha: gh, progress: 0.7, rowH: 56, gap: 14,
        labelSize: 36, valueSize: 34, zeroFrac: 0.56, halfFrac: 0.42,
      });
      text(ctx, 'softmax', 980, 780, {
        size: 56, weight: 500, color: C.fg, align: 'center', alpha: gh,
      });
      card(ctx, 1398, 448, 120, 64, {
        fill: 'rgba(49,51,66,0.2)', stroke: 'rgba(255,184,108,0.28)', r: 32,
        lw: 1.3, dash: [7, 7], alpha: gh * 1.4,
      });
    }

    // Left: scores.
    tag(ctx, 200, 318, 'scores', { color: M.logits, alpha: scoresA * 0.95, size: 32 });
    if (scoresA > 0.001) {
      const rows = [
        { label: 'cat', value: 8.2 },
        { label: 'dog', value: 1.1 },
        { label: 'sat', value: -2.4 },
        { label: 'the', value: -4.9 },
      ];
      scoreList(ctx, 200, 372, 600, rows, {
        max: 10, alpha: scoresA, progress: p(t, q.twoThings + 0.1, 0.7),
        rowH: 56, gap: 14, labelSize: 36, valueSize: 34,
        zeroFrac: 0.56, halfFrac: 0.42,
      });
    }

    // The gate label arrives on "softmax".
    text(ctx, 'softmax', 980, 780, {
      size: 56, weight: 500, color: C.fg, align: 'center',
      alpha: p(t, q.scores, 0.55),
    });
    const w = measure(ctx, 'softmax', 56, 500, F.display, 0.2);
    underline(ctx, 980 - w / 2, 800, w, {
      color: M.gate, width: 3, alpha: p(t, q.scores, 0.55) * 0.9,
    });

    // The chance band leaving the gate.
    if (chancesA > 0.001) {
      tag(ctx, 1160, 318, 'chances', { color: M.gate, alpha: chancesA * 0.95, size: 32 });
      for (let i = 0; i < 5; i++) {
        const h = [82, 54, 40, 30, 22][i];
        const qq = p(t, q.scores + 0.15 + i * 0.06, 0.5);
        if (qq <= 0) continue;
        const x = 1120 + i * 34;
        const y = 492 - h / 2;
        rr(ctx, x, y + (1 - qq) * 12, 24, h * qq, 5);
        ctx.fillStyle = M.gate;
        ctx.globalAlpha = chancesA * qq * (0.9 - i * 0.12);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // The pick.
    if (pickA > 0.001) {
      tag(ctx, 1520, 318, 'one word', { color: M.word, alpha: pickA * 0.95, size: 32 });
      wordPill(ctx, 1400, 450, 'cat', { alpha: pickA, size: 42 });
      ctx.save();
      ctx.globalAlpha = pickA;
      ctx.fillStyle = M.correct;
      ctx.beginPath();
      ctx.arc(1514, 432, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      tag(ctx, 1400, 540, 'picked', { color: M.correct, alpha: pickA * 0.9, size: 28 });
    }

    // Everything else is thrown away.
    const others = ['dog', 'sat', 'the', 'a'];
    others.forEach((w2, i) => {
      const e = enter(t, q.twoThings + 0.2 + i * 0.07, 0.5, 0, 10);
      if (e.a <= 0.001) return;
      const drift = throwA * (26 + i * 9);
      text(ctx, w2, 1160 + i * 100, 640 + drift, {
        size: 34, weight: 400, color: C.muted,
        alpha: e.a * (1 - throwA * 0.82) * dim,
      });
    });
    if (throwA > 0.001) {
      tag(ctx, 1160, 726, 'thrown away', {
        color: M.bug, alpha: throwA * 0.9, size: 30,
      });
    }

    // A single connecting line from the gate to the pick.
    arrow(ctx, 1120, 492, 1378, 492, {
      color: 'rgba(248,248,242,0.30)', width: 2, progress: pickA, head: 10,
    });
  },
};

// ---------------------------------------------------------------- 06

const six = {
  id: 's06-two-questions',
  title: 'Two questions',
  start: start(7),
  end: start(10) + 0.32,
  draw(ctx, t) {
    const row1A = (0.35 + 0.65 * p(t, q.one - 0.2, 0.6)) * (1 - 0.55 * p(t, q.two - 0.2, 0.5));
    const row2A = 0.35 + 0.65 * p(t, q.two - 0.2, 0.6);
    const crack = p(t, q.solid, 0.6);
    const squeeze = p(t, q.squeezed, 0.8);
    const lose = p(t, q.lose, 0.6);

    line(ctx, 300, 590, 1620, 590, {
      color: 'rgba(248,248,242,0.10)', width: 1.2, rough: 0, alpha: 0.8,
    });

    // Row one.
    ctx.save();
    ctx.globalAlpha = row1A;
    numberedChip(ctx, 300, 430, 1, { color: M.gate, size: 58 });
    text(ctx, 'softmax sits inside every model', 370, 420, {
      size: 50, weight: 500, color: C.fg, alpha: row1A,
    });
    text(ctx, 'how solid is it?', 370, 480, {
      size: 44, weight: 500, color: M.gate, alpha: row1A,
    });
    // mini gate on the right
    gate(ctx, 1460, 432, 150, 240, {
      alpha: row1A * 0.95, open: 1, accent: M.gate, crack,
    });
    text(ctx, '?', 1620, 452, {
      size: 58, weight: 400, color: crack > 0.2 ? M.bug : C.dim,
      alpha: row1A * (0.4 + crack * 0.6),
    });
    if (crack > 0.01) {
      tag(ctx, 1460, 580, 'a leak at the edge', {
        color: M.bug, alpha: crack * 0.85, size: 28, align: 'center',
      });
    }
    ctx.restore();

    // Row two.
    ctx.save();
    ctx.globalAlpha = row2A;
    numberedChip(ctx, 300, 710, 2, { color: M.thought, size: 58 });
    text(ctx, 'one word per thought', 370, 700, {
      size: 50, weight: 500, color: C.fg, alpha: row2A,
    });
    text(ctx, 'how much do we lose?', 370, 760, {
      size: 44, weight: 500, color: M.thought, alpha: row2A,
    });

    // The squeeze, on the right.
    const sx = 1100;
    thoughtRow(ctx, sx, 694, 230, 34, {
      cells: 16, alpha: row2A * 0.9, progress: squeeze, color: M.thought,
    });
    if (squeeze > 0.001) {
      arrow(ctx, sx + 236, 710, 1382, 710, {
        color: 'rgba(189,147,249,0.45)', width: 1.8, progress: squeeze, head: 8,
      });
      flow(ctx, sx + 238, 710, 1380, 710, {
        n: 8, color: M.thought, alpha: row2A * squeeze, progress: 1, t, size: 3.6,
        spread: 8, speed: 0.13, seed: 7,
      });
    }
    gate(ctx, 1410, 710, 76, 140, {
      alpha: row2A * 0.9, open: 0.3 + 0.7 * squeeze, accent: M.thought, label: null,
    });
    if (squeeze > 0.5) {
      wordPill(ctx, 1494, 694, 'cat', { alpha: row2A * p(t, q.squeezed + 0.4, 0.5), size: 30 });
    }
    text(ctx, '?', 1686, 730, {
      size: 56, weight: 400, color: M.thought, alpha: row2A * lose,
    });
    ctx.restore();
  },
};

// ---------------------------------------------------------------- 07

const seven = {
  id: 's07-the-gate',
  title: 'The gate between thought and speech',
  start: start(10) + 0.32,
  end: start(11) + 0.36,
  draw(ctx, t) {
    const base = p(t, q.three, 0.8);
    const gateA = p(t, q.gate, 0.7);
    const crack = p(t, q.leaks, 0.7);
    const pushA = p(t, q.push, 0.8);

    // Roadmap chips.
    const papers = [
      { label: 'paper 1 · leak', color: M.bug },
      { label: 'paper 2 · too much', color: M.thought },
      { label: 'paper 3 · too much', color: M.correct },
    ];
    const cs = 30;
    const widths = papers.map((x) => measure(ctx, x.label, cs, 500, F.display, 0.2) + 40);
    const gap = 16;
    const total = widths.reduce((s, w) => s + w, 0) + gap * 2;
    let cx = 960 - total / 2;
    papers.forEach((x, i) => {
      const active = crack > 0.3 ? (i === 0 ? 1 : 0.35) : pushA > 0.3 ? (i === 0 ? 0.35 : 1) : 1;
      const e = enter(t, q.three + i * 0.18, 0.55, 0, 10);
      chip(ctx, cx, 178, x.label, {
        size: cs, color: x.color, border: `${x.color}66`,
        bg: 'rgba(49,51,66,0.45)', alpha: e.a * active,
      });
      cx += widths[i] + gap;
    });

    // Left: a wide thought band.
    const thoughtA = gateA * 0.95;
    if (gateA < 0.99) {
      const gh = base * 0.18 * (1 - gateA);
      tag(ctx, 240, 350, 'what it thinks', { color: M.thought, alpha: gh, size: 30 });
      tag(ctx, 1680, 350, 'what it says', { color: M.word, alpha: gh, size: 30, align: 'right' });
      thoughtRow(ctx, 240, 438, 500, 64, {
        cells: 22, alpha: gh, seed: 2, progress: 0.8, color: M.thought,
      });
      card(ctx, 1128, 432, 130, 64, {
        fill: 'rgba(49,51,66,0.2)', stroke: 'rgba(255,184,108,0.3)', r: 32,
        lw: 1.3, dash: [7, 7], alpha: gh * 1.5,
      });
    }
    tag(ctx, 240, 350, 'what it thinks', { color: M.thought, alpha: thoughtA * 0.9, size: 30 });
    thoughtRow(ctx, 240, 438, 500, 64, {
      cells: 22, alpha: thoughtA, seed: 2, progress: gateA, color: M.thought,
    });
    if (pushA > 0.001) {
      thoughtRow(ctx, 240, 374, 500, 40, {
        cells: 22, alpha: pushA * 0.55, seed: 9, progress: pushA, color: M.thought,
      });
      tag(ctx, 740, 386, 'too much', {
        color: M.bug, alpha: pushA * 0.9, size: 30, align: 'right',
      });
    }

    // Funnel into the slit.
    if (gateA > 0.001) {
      ctx.save();
      ctx.globalAlpha = gateA * 0.16;
      ctx.fillStyle = M.thought;
      ctx.beginPath();
      ctx.moveTo(744, 432);
      ctx.lineTo(920, 464);
      ctx.lineTo(920, 512);
      ctx.lineTo(744, 544);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    gate(ctx, 960, 488, 300, 470, {
      alpha: base * 0.95, open: 0.15 + 0.85 * gateA, accent: M.gate, crack,
    });
    text(ctx, 'softmax', 960, 806, {
      size: 56, weight: 500, color: C.fg, align: 'center', alpha: gateA * 0.95,
    });
    const sw = measure(ctx, 'softmax', 56, 500, F.display, 0.2);
    underline(ctx, 960 - sw / 2, 826, sw, { color: M.gate, width: 3, alpha: gateA * 0.9 });

    // Right: one word.
    tag(ctx, 1680, 350, 'what it says', { color: M.word, alpha: gateA * 0.9, size: 30, align: 'right' });
    if (gateA > 0.5) {
      wordPill(ctx, 1130, 440, 'cat', { alpha: p(t, q.gate + 0.3, 0.5), size: 42 });
      tag(ctx, 1150, 540, 'one word', { color: C.dim, alpha: p(t, q.gate + 0.4, 0.5), size: 28 });
    }
    if (crack > 0.01) leak(ctx, 1120, 722, { progress: crack, alpha: 0.95 });

    // The leak and the overflow are the two claims.
    if (crack > 0.2) {
      tag(ctx, 240, 690, 'the gate leaks', { color: M.bug, alpha: crack * 0.95, size: 38 });
    }
    if (pushA > 0.2) {
      tag(ctx, 1680, 690, 'too much goes through', {
        color: M.thought, alpha: pushA * 0.95, size: 36, align: 'right',
      });
    }
  },
};

// ---------------------------------------------------------------- 08

const eight = {
  id: 's08-table-teaser',
  title: 'The test, and the loop',
  start: start(11) + 0.36,
  end: 98.0,
  draw(ctx, t) {
    const tableA = 1 - p(t, q.zero, 0.5);
    const rowA = p(t, q.test, 0.6);
    const realA = p(t, q.real, 0.6);
    const arrowA = p(t, q.table, 0.55);
    const zeroA = p(t, q.zero + 0.1, 0.7);
    const loopA = p(t, q.loop, 0.8);

    if (tableA > 0.001) {
      ctx.save();
      ctx.globalAlpha = tableA;
      const x = 540;
      const y = 300;
      const w = 840;
      const h = 360;
      card(ctx, x, y, w, h, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 18,
        accent: M.thought, accentW: 3,
      });
      text(ctx, 'test', x + 46, y + 76, { size: 32, weight: 500, color: C.muted });
      text(ctx, 'result', x + w - 46, y + 76, {
        size: 32, weight: 500, color: C.muted, align: 'right',
      });
      line(ctx, x + 46, y + 104, x + w - 46, y + 104, {
        color: 'rgba(248,248,242,0.14)', width: 1.2, rough: 0,
      });

      // Three ghost rows; one is the test that matters.
      const rows = [
        { label: 'content of the thought', key: 1 },
        { label: 'noise', key: 0 },
        { label: 'random words', key: 0 },
      ];
      rows.forEach((r, i) => {
        const yy = y + 160 + i * 66;
        const a = rowA * (i === 0 ? 1 : 0.22);
        text(ctx, r.label, x + 46, yy, {
          size: 34, weight: 400, color: i === 0 ? C.fg : C.dim, alpha: a,
        });
        text(ctx, '?', x + w - 76, yy, {
          size: 38, weight: 400, color: i === 0 ? M.thought : C.dim,
          alpha: a, align: 'center',
        });
      });
      if (rowA > 0.01) {
        rr(ctx, x + 28, y + 130, w - 56, 66, 10);
        ctx.strokeStyle = 'rgba(189,147,249,0.45)';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([7, 7]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (realA > 0.001) {
        tag(ctx, x + 76, y + h + 58, 'real thinking?', {
          color: M.correct, alpha: realA, size: 30,
        });
        text(ctx, 'or', x + 330, y + h + 58, {
          size: 30, color: C.dim, alpha: realA, align: 'center',
        });
        tag(ctx, x + 420, y + h + 58, 'filler?', {
          color: M.bug, alpha: realA, size: 30,
        });
      }

      if (arrowA > 0.001) {
        line(ctx, 1430, 300, 1430, 220, {
          color: 'rgba(248,248,242,0.3)', width: 1.6, alpha: arrowA, rough: 0.2,
        });
        tag(ctx, 1430, 200, 'the table', {
          color: C.muted, alpha: arrowA, size: 30, align: 'right',
        });
      }
      ctx.restore();
    }

    // The hand-off to the loop.
    if (zeroA > 0.001) {
      ctx.save();
      ctx.globalAlpha = zeroA;
      text(ctx, 'you can\u2019t see the bug', 960, 430, {
        size: 64, weight: 450, color: C.fg, align: 'center', ls: -1,
      });
      text(ctx, 'without seeing the loop', 960, 512, {
        size: 64, weight: 450, color: C.muted, align: 'center', ls: -1,
      });
      ctx.restore();
    }

    // A ghost five-step loop along the bottom.
    if (loopA > 0.001) {
      const steps = ['think', 'score', 'chances', 'pick', 'feed'];
      const xs = [420, 690, 960, 1230, 1500];
      ctx.save();
      ctx.globalAlpha = loopA * 0.95;
      steps.forEach((s, i) => {
        const e = p(t, q.loop + 0.1 + i * 0.09, 0.4);
        text(ctx, s, xs[i], 780, {
          size: 36, weight: 500, color: i === 2 ? M.gate : C.muted,
          align: 'center', alpha: loopA * e,
        });
        if (i < steps.length - 1 && e > 0.3) {
          arrow(ctx, xs[i] + 62, 764, xs[i + 1] - 62, 764, {
            color: 'rgba(248,248,242,0.28)', width: 1.8, progress: e, head: 8,
          });
        }
      });
      // return arrow: feed back to think
      arrow(ctx, 1500, 840, 430, 840, {
        color: 'rgba(248,248,242,0.24)', width: 1.6,
        progress: p(t, q.loop + 0.55, 0.7), head: 9,
      });
      ctx.restore();
    }
  },
};

export default [five, six, seven, eight];
