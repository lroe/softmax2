import {
  C, F, W, H, clamp, p, enter, easeOutCubic, card, text, line, arrow,
  strokePath, underline, measure, numberedChip, rr,
} from '../kit.js';
import {
  M, tag, chip, statement, gate, leak, flow, pathFlow, scoreList, thoughtRow,
  wordPill, stat, axes, lossCurve, softmaxCurve,
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
  zero: at('start from zero', 12),
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
    const chancesA = p(t, q.scores, 0.7);
    const pickA = p(t, q.picks, 0.55);
    const throwA = p(t, q.throws, 0.7);
    const dim = 1 - 0.55 * throwA;

    // Empty score panel is the base. No future labels, values, or words.
    if (scoresA < 0.99) {
      const gh = base * 0.4 * (1 - scoresA);
      card(ctx, 180, 320, 640, 390, {
        fill: 'rgba(49,51,66,0.28)', stroke: 'rgba(248,248,242,0.26)',
        r: 20, lw: 1.4, dash: [8, 8], alpha: gh,
      });
      for (let i = 0; i < 4; i++) {
        card(ctx, 500, 386 + i * 70, 300, 18, {
          fill: 'rgba(248,248,242,0.12)', stroke: 'rgba(248,248,242,0.18)',
          r: 6, lw: 1, alpha: gh,
        });
      }
    }

    // Left: scores.
    tag(ctx, 200, 318, 'scores', { color: M.logits, alpha: scoresA * 0.95, size: 36 });
    if (scoresA > 0.001) {
      const rows = [
        { label: 'cat', value: 8.2 },
        { label: 'dog', value: 1.1 },
        { label: 'sat', value: -2.4 },
        { label: 'the', value: -4.9 },
      ];
      scoreList(ctx, 200, 372, 600, rows, {
        max: 10, alpha: scoresA, progress: p(t, q.twoThings + 0.1, 0.7),
        rowH: 56, gap: 14, labelSize: 36, valueSize: 36,
        zeroFrac: 0.56, halfFrac: 0.42,
      });
    }

    // Center: the actual softmax curve.
    tag(ctx, 840, 330, 'chances', { color: M.gate, alpha: chancesA * 0.95, size: 36 });
    softmaxCurve(ctx, 840, 390, 300, 260, {
      alpha: base * 0.95,
      axesAlpha: chancesA,
      curveProgress: chancesA,
      marker: 0.72,
      markerAlpha: pickA,
      projectionAlpha: pickA,
      axisLabels: false,
      compact: true,
    });
    text(ctx, 'softmax', 990, 720, {
      size: 44, weight: 500, color: C.fg, align: 'center',
      alpha: p(t, q.scores, 0.55),
    });
    const w = measure(ctx, 'softmax', 44, 500, F.display, 0.2);
    underline(ctx, 990 - w / 2, 738, w, {
      color: M.gate, width: 3, alpha: p(t, q.scores, 0.55) * 0.9,
    });

    // The pick.
    if (pickA > 0.001) {
      tag(ctx, 1520, 318, 'one word', { color: M.word, alpha: pickA * 0.95, size: 36 });
      wordPill(ctx, 1400, 450, 'cat', { alpha: pickA, size: 44 });
      ctx.save();
      ctx.globalAlpha = pickA;
      ctx.fillStyle = M.correct;
      ctx.beginPath();
      ctx.arc(1518, 432, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      tag(ctx, 1400, 546, 'picked', { color: M.correct, alpha: pickA * 0.9, size: 36 });
      arrow(ctx, 1150, 500, 1376, 500, {
        color: 'rgba(248,248,242,0.3)', width: 2, progress: pickA, head: 10,
      });
    }

    // Everything else is thrown away.
    const others = ['dog', 'sat', 'the', 'a'];
    if (throwA > 0.001) {
      others.forEach((w2, i) => {
        const e = enter(t, q.throws + i * 0.06, 0.45, 0, 8);
        const drift = throwA * (26 + i * 9);
        text(ctx, w2, 1160 + i * 100, 660 + drift, {
          size: 36, weight: 400, color: C.muted,
          alpha: e.a * (1 - throwA * 0.82) * dim,
        });
      });
    }
    if (throwA > 0.001) {
      tag(ctx, 1160, 746, 'thrown away', {
        color: M.bug, alpha: throwA * 0.9, size: 36,
      });
    }
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
    const tableA = 1 - p(t, q.zero, 0.3);
    const rowA = p(t, q.test, 0.6);
    const realA = p(t, q.real, 0.6);
    const zeroA = p(t, q.zero + 0.3, 0.55);

    if (tableA > 0.001) {
      ctx.save();
      ctx.globalAlpha = tableA;
      const x = 540;
      const y = 350;
      const w = 840;
      const h = 260;
      card(ctx, x, y, w, h, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 18,
        accent: M.thought, accentW: 3,
      });
      text(ctx, 'test', x + 46, y + 64, { size: 36, weight: 500, color: C.muted });
      text(ctx, 'result', x + w - 46, y + 64, {
        size: 36, weight: 500, color: C.muted, align: 'right',
      });
      line(ctx, x + 46, y + 92, x + w - 46, y + 92, {
        color: 'rgba(248,248,242,0.14)', width: 1.2, rough: 0,
      });

      // One row. No future comparison rows, no duplicate question marks.
      const yy = y + 158;
      text(ctx, 'content of the thought', x + 46, yy, {
        size: 36, weight: 400, color: C.fg, alpha: rowA,
      });
      text(ctx, '?', x + w - 76, yy, {
        size: 40, weight: 400, color: M.thought, alpha: rowA, align: 'center',
      });
      if (rowA > 0.01) {
        ctx.save();
        ctx.globalAlpha *= rowA;
        rr(ctx, x + 28, y + 124, w - 56, 68, 10);
        ctx.strokeStyle = 'rgba(189,147,249,0.45)';
        ctx.lineWidth = 1.6;
        ctx.setLineDash([7, 7]);
        ctx.stroke();
        ctx.restore();
      }

      // One question line under the table, with no dots or extra labels.
      if (realA > 0.001) {
        const lineY = y + h + 64;
        const rw = measure(ctx, 'real thinking?', 36, 400, F.display, 0);
        const ow = measure(ctx, 'or', 36, 400, F.display, 0);
        const fw = measure(ctx, 'filler?', 36, 400, F.display, 0);
        const gap = 18;
        let qx = 960 - (rw + ow + fw + gap * 2) / 2;
        text(ctx, 'real thinking?', qx, lineY, {
          size: 36, weight: 400, color: M.correct, alpha: realA,
        });
        qx += rw + gap;
        text(ctx, 'or', qx + ow / 2, lineY, {
          size: 36, weight: 400, color: C.dim, alpha: realA, align: 'center',
        });
        qx += ow + gap;
        text(ctx, 'filler?', qx, lineY, {
          size: 36, weight: 400, color: M.bug, alpha: realA,
        });
      }
      ctx.restore();
    }

    // The hand-off to the loop.
    if (zeroA > 0.001) {
      ctx.save();
      ctx.globalAlpha = zeroA;
      text(ctx, 'you can\u2019t see the bug', 960, 500, {
        size: 64, weight: 450, color: C.fg, align: 'center', ls: -1,
      });
      text(ctx, 'without seeing the loop', 960, 582, {
        size: 64, weight: 450, color: C.muted, align: 'center', ls: -1,
      });
      ctx.restore();
    }
  },
};

export default [five, six, seven, eight];
