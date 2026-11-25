import {
  C, F, W, H, clamp, lerp, p, enter, easeOutCubic, card, text, line, arrow,
  strokePath, underline, measure, icon,
} from '../kit.js';
import {
  M, tag, chip, statement, heroNumber, gate, leak, flow, pathFlow, paperCard,
  scoreList, thoughtRow, wordPill, stat,
} from '../motifs.js';
import { at, start } from '../data/timeline.js';

const q = {
  // one function
  every: at('every ai model', 1),
  runs: at('runs through one function', 1),
  softmax: at('softmax', 1),
  // the bug
  deepmind: at('google deepmind', 2),
  standard: at('standard version', 2),
  bug: at('has a bug', 2),
  // zero
  best: at('best learning signal', 3),
  sure: at('most sure of itself', 3),
  jax: at('jax', 3),
  pytorch: at('pytorch', 3),
  tensorflow: at('tensorflow', 3),
  textbooks: at('textbooks', 3),
  // the other half
  half: at('half of it', 4),
  stanford: at('stanford team', 4),
  silence: at('thinking in silence', 4),
  noWords: at('no words', 4),
  tool: at('needs a tool', 4),
  beat: at('beat several frontier', 4),
  tokens: at('half as many tokens', 4),
  size: at('normal agent its size', 4),
  // road map
  three: at('three new papers', 5),
  under: at('under half an hour', 5),
  five: at('five lines of code', 5),
  less: at('say less', 5),
};

// ---------------------------------------------------------------- 01

const one = {
  id: 's01-one-function',
  title: 'One function',
  start: start(1),
  end: start(2),
  draw(ctx, t) {
    const u = t - one.start;
    const cam = 1 + 0.045 * easeOutCubic(clamp(u / 4.8));
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(cam, cam);
    ctx.translate(-W / 2, -H / 2);

    const base = p(t, q.every + 0.1, 0.8);
    const open = 0.08 + 0.92 * p(t, 0.75, 1.05);
    const stream = p(t, 0.65, 1.1);
    const labelA = p(t, q.softmax, 0.55);

    // A faint field of model instances, far behind the gate.
    const dotsA = base * 0.22;
    if (dotsA > 0.001) {
      ctx.save();
      ctx.globalAlpha = dotsA;
      for (let i = 0; i < 48; i++) {
        const col = i % 12;
        const row = Math.floor(i / 12);
        const x = 250 + col * 30 + (row % 2) * 12;
        const y = 250 + row * 32;
        ctx.fillStyle = i % 7 === 0 ? C.cyan : C.dim;
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Gate first, then the streams so the dots meet its slit.
    gate(ctx, 960, 470, 300, 470, {
      alpha: base, open, accent: M.gate, label: null,
    });

    // Focus brackets and one scan pass: a camera finding the function.
    const focusA = p(t, 0.2, 0.5);
    const contract = p(t, q.softmax, 0.8);
    if (focusA > 0.001) {
      const pad = 32 - 10 * contract;
      const bx = 960 - 150 - pad;
      const by = 470 - 235 - pad;
      const bw = 300 + pad * 2;
      const bh = 470 + pad * 2;
      const len = 34;
      const col = 'rgba(139,233,253,0.4)';
      const segs = [
        [[bx, by + len], [bx, by], [bx + len, by]],
        [[bx + bw - len, by], [bx + bw, by], [bx + bw, by + len]],
        [[bx, by + bh - len], [bx, by + bh], [bx + len, by + bh]],
        [[bx + bw - len, by + bh], [bx + bw, by + bh], [bx + bw, by + bh - len]],
      ];
      segs.forEach((pts) => strokePath(ctx, pts, {
        color: col, width: 2, alpha: focusA, progress: 1, rough: 0,
      }));
    }
    const scan = p(t, 0.7, 1.5);
    if (scan > 0.001 && scan < 1) {
      const sy = 250 + 420 * scan;
      line(ctx, 830, sy, 1090, sy, {
        color: 'rgba(139,233,253,0.25)', width: 2, rough: 0,
        alpha: Math.sin(scan * Math.PI) * 0.9,
      });
    }

    // Left stream: scores. Right stream: chances.
    flow(ctx, 230, 470, 942, 470, {
      n: 16, color: M.logits, alpha: stream, progress: 1, t, size: 4.2,
      spread: 38, speed: 0.09, seed: 2,
    });
    flow(ctx, 978, 470, 1690, 470, {
      n: 16, color: M.gate, alpha: stream, progress: 1, t, size: 4.2,
      spread: 38, speed: 0.09, seed: 5,
    });

    const la = p(t, q.runs, 0.6);
    tag(ctx, 240, 388, 'scores', { color: M.logits, alpha: la * 0.9, size: 32 });
    tag(ctx, 1680, 388, 'chances', { color: M.gate, alpha: la * 0.9, size: 32, align: 'right' });

    if (labelA > 0.001) {
      text(ctx, 'softmax', 960, 786, {
        size: 58, weight: 500, color: C.fg, align: 'center', alpha: labelA, ls: 0.2,
      });
      const w = measure(ctx, 'softmax', 58, 500, F.display, 0.2);
      underline(ctx, 960 - w / 2, 806, w, {
        color: M.gate, width: 3, alpha: labelA * 0.9, progress: p(t, q.softmax + 0.1, 0.5),
      });
    }

    // A single quiet caption, revealed on "one function".
    text(ctx, 'every model runs through it', 960, 900, {
      size: 34, weight: 400, color: C.muted, align: 'center',
      alpha: p(t, q.runs + 0.15, 0.7) * 0.9,
    });

    ctx.restore();
  },
};

// ---------------------------------------------------------------- 02

const two = {
  id: 's02-rounds-to-zero',
  title: 'The signal rounds to zero',
  start: start(2),
  end: start(4),
  draw(ctx, t) {
    const zeroIn = p(t, start(3) + 0.15, 0.7);
    const gateA = 1 - p(t, start(3) + 0.05, 0.55);
    const crack = p(t, q.bug - 0.15, 0.7);
    const leakA = p(t, q.bug + 0.35, 0.9);

    // Gate phase: the standard version, then a crack.
    if (gateA > 0.001) {
      ctx.save();
      ctx.globalAlpha = gateA;
      gate(ctx, 960, 470, 300, 470, {
        alpha: 1, open: 1, accent: M.gate, label: null, crack,
      });
      text(ctx, 'softmax', 960, 786, {
        size: 58, weight: 500, color: C.fg, align: 'center',
      });
      const w = measure(ctx, 'softmax', 58, 500, F.display, 0.2);
      underline(ctx, 960 - w / 2, 806, w, { color: M.gate, width: 3, alpha: 0.9 });

      flow(ctx, 230, 470, 942, 470, {
        n: 14, color: M.logits, alpha: 0.8, progress: 1, t, size: 4.2, spread: 38,
        speed: 0.09, seed: 2,
      });
      flow(ctx, 978, 470, 1690, 470, {
        n: 14, color: gateA > 0.5 ? M.gate : M.bug, alpha: 0.8, progress: 1, t,
        size: 4.2, spread: 38, speed: 0.09, seed: 5,
      });

      text(ctx, 'the standard version', 960, 900, {
        size: 34, weight: 400, color: C.dim, align: 'center',
        alpha: p(t, q.standard, 0.6) * 0.95,
      });

      if (crack > 0.01) {
        text(ctx, 'a bug', 1210, 350, {
          size: 46, weight: 500, color: M.bug, alpha: p(t, q.bug, 0.5),
        });
        line(ctx, 1200, 370, 1090, 410, {
          color: M.bug, width: 1.8, alpha: p(t, q.bug, 0.5) * 0.7, rough: 0.3,
        });
        leak(ctx, 1120, 700, { progress: leakA, alpha: 0.9 });
      }
      ctx.restore();
    }

    // Zero phase.
    if (zeroIn > 0.001) {
      ctx.save();
      ctx.globalAlpha = zeroIn;

      text(ctx, 'best learning signal', 960, 300, {
        size: 36, weight: 400, color: C.muted, align: 'center',
        alpha: p(t, q.best, 0.6) * 0.95,
      });

      const pulse = 1 + 0.008 * Math.sin((t - start(3)) * 2.4);
      ctx.save();
      ctx.translate(960, 540);
      ctx.scale(pulse, pulse);
      ctx.translate(-960, -540);
      text(ctx, '0', 960, 600, {
        size: 240, weight: 500, color: M.bug, align: 'center', ls: -10,
      });
      ctx.restore();

      text(ctx, 'gradient on the right word', 960, 688, {
        size: 36, weight: 400, color: C.muted, align: 'center',
        alpha: p(t, q.best + 0.25, 0.6) * 0.95,
      });

      // Confidence meter.
      const meterA = p(t, q.sure - 0.15, 0.6);
      if (meterA > 0.001) {
        const fill = p(t, q.sure + 0.05, 1.1);
        const mx = 300;
        const mw = 1320;
        text(ctx, 'confidence', mx, 748, {
          size: 32, weight: 400, color: C.muted, alpha: meterA,
        });
        text(ctx, '100%', mx + mw, 748, {
          size: 32, weight: 500, color: M.logits, align: 'right', alpha: meterA * fill,
        });
        card(ctx, mx, 764, mw, 12, {
          fill: 'rgba(248,248,242,0.08)', stroke: null, r: 6, alpha: meterA,
        });
        if (fill > 0.001) {
          card(ctx, mx, 764, Math.max(8, mw * fill), 12, {
            fill: M.logits, stroke: null, r: 6, alpha: meterA * 0.9,
          });
          if (fill > 0.95) {
            tag(ctx, mx + mw, 714, 'most sure', {
              color: M.logits, align: 'right', alpha: p(t, q.sure + 1.0, 0.5), size: 30,
            });
          }
        }
      }

      // Framework chips.
      const labels = ['JAX', 'PyTorch', 'TensorFlow', 'textbooks'];
      const size = 34;
      const widths = labels.map((l) => measure(ctx, l, size, 500, F.display, 0.2) + 40);
      const gap = 18;
      const total = widths.reduce((s, w) => s + w, 0) + gap * (labels.length - 1);
      let cx = 960 - total / 2;
      text(ctx, 'the bug lives in', 960, 844, {
        size: 30, weight: 400, color: C.dim, align: 'center',
        alpha: p(t, q.jax - 0.4, 0.6),
      });
      labels.forEach((l, i) => {
        const e = enter(t, q.jax + i * 0.42, 0.55, 0, 12);
        if (e.a > 0.001) {
          chip(ctx, cx, 904, l, {
            size, color: i === 3 ? M.bug : C.fg,
            border: i === 3 ? 'rgba(255,85,85,0.5)' : 'rgba(248,248,242,0.22)',
            bg: 'rgba(49,51,66,0.6)', alpha: e.a,
          });
        }
        cx += widths[i] + gap;
      });

      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- 03

const three = {
  id: 's03-silent-agent',
  title: 'An agent that thinks in silence',
  start: start(4),
  end: start(5),
  draw(ctx, t) {
    const base = p(t, q.half - 0.25, 0.8);
    const loopA = p(t, q.silence, 0.7);
    const toolA = p(t, q.tool, 0.6);
    const barsA = p(t, q.beat, 0.7);
    const statA = p(t, q.tokens, 0.7);

    // --- ghost scaffold: the whole layout is present before its cue ------
    const ghost = 0.24;
    const loopPts = [[750, 390], [750, 300], [840, 250], [1010, 250], [1100, 300], [1100, 390]];
    if (loopA < 0.99) {
      strokePath(ctx, loopPts, {
        color: 'rgba(189,147,249,0.5)', width: 2.2, alpha: base * ghost * (1 - loopA),
        rough: 0.3, dash: [8, 8],
      });
    }

    // Input.
    card(ctx, 170, 438, 300, 124, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 16, alpha: base * 0.9,
    });
    text(ctx, 'question', 204, 509, { size: 38, weight: 500, color: C.fg, alpha: base });

    arrow(ctx, 486, 500, 594, 500, {
      color: 'rgba(248,248,242,0.42)', width: 2, progress: base, head: 9,
    });

    // Agent.
    card(ctx, 610, 390, 440, 220, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 20,
      accent: M.thought, accentW: 4, alpha: base,
    });
    text(ctx, 'agent', 646, 468, { size: 42, weight: 500, color: C.fg, alpha: base });
    text(ctx, 'thinks', 646, 522, { size: 32, weight: 400, color: M.thought, alpha: base });
    text(ctx, 'speaks', 646, 566, { size: 32, weight: 400, color: M.word, alpha: base });
    tag(ctx, 1016, 430, 'Stanford', {
      color: C.dim, alpha: p(t, q.stanford, 0.6) * 0.9, size: 26, align: 'right',
    });

    // The silent loop.
    if (loopA > 0.001) {
      strokePath(ctx, loopPts, {
        color: 'rgba(189,147,249,0.55)', width: 2.6, alpha: loopA,
        progress: p(t, q.silence, 0.75), rough: 0.3,
      });
      pathFlow(ctx, loopPts, {
        color: M.thought, alpha: loopA, progress: p(t, q.silence, 0.75), n: 13,
        t, size: 5, speed: 0.13, seed: 3,
      });
      arrow(ctx, 1100, 340, 1100, 392, {
        color: 'rgba(189,147,249,0.8)', width: 2.4, progress: p(t, q.silence + 0.3, 0.4), head: 12,
      });
    }

    text(ctx, 'no words', 930, 200, {
      size: 50, weight: 500, color: M.thought, align: 'center',
      alpha: p(t, q.noWords, 0.55),
    });

    // The only spoken moment: a tool call.
    const tGhost = 1 - toolA;
    if (tGhost > 0.01) {
      card(ctx, 1214, 426, 196, 64, {
        fill: 'rgba(49,51,66,0.25)', stroke: 'rgba(255,184,108,0.28)',
        r: 32, lw: 1.4, dash: [7, 7], alpha: base * ghost * tGhost,
      });
    }
    if (toolA > 0.001) {
      arrow(ctx, 1056, 500, 1196, 500, {
        color: 'rgba(248,248,242,0.35)', width: 2, progress: toolA,
      });
      wordPill(ctx, 1216, 458, 'tool call', { alpha: toolA, size: 34 });
      text(ctx, 'the only text', 1216, 534, {
        size: 28, weight: 400, color: C.dim, alpha: toolA * 0.9,
      });
    }

    // Relative benchmark bars.
    const bx = 170;
    const by = 780;
    const trackX = 510;
    const trackW = 540;
    text(ctx, 'agent benchmarks · relative', bx, by - 34, {
      size: 28, weight: 400, color: C.dim, alpha: Math.max(barsA, base * ghost),
    });
    const bars = [
      { label: 'frontier models', f: 0.54, color: 'rgba(184,185,197,0.65)' },
      { label: 'silent agent', f: 0.78, color: M.thought },
    ];
    bars.forEach((b, i) => {
      const yy = by + i * 70;
      text(ctx, b.label, bx, yy + 26, {
        size: 34, weight: 500, color: C.fg, alpha: Math.max(barsA, base * ghost),
      });
      card(ctx, trackX, yy + 6, trackW, 26, {
        fill: 'rgba(248,248,242,0.07)', stroke: null, r: 6,
        alpha: Math.max(barsA, base * ghost),
      });
      if (barsA > 0.001) {
        card(ctx, trackX, yy + 6, trackW * b.f * p(t, q.beat + i * 0.18, 0.7), 26, {
          fill: b.color, stroke: null, r: 6, alpha: barsA,
        });
      }
    });

    // Token count.
    const showStat = Math.max(statA, base * ghost * 0.9);
    if (showStat > 0.001) {
      text(ctx, '≈ ½', 1470, 852, {
        size: 112, weight: 500, color: M.thought, align: 'center',
        alpha: showStat, ls: -4,
      });
      text(ctx, 'the tokens of a normal agent', 1470, 902, {
        size: 30, weight: 400, color: C.muted, align: 'center',
        alpha: showStat * (statA > 0 ? 0.95 : 0.7),
      });
    }
  },
};


function drawMini(ctx, which, cx, cy, alpha, t, accent) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  if (which === 0) {
    gate(ctx, cx, cy - 4, 62, 108, { alpha: 0.95, open: 0.9, accent, crack: 0.85 });
  } else if (which === 1) {
    card(ctx, cx - 62, cy - 2, 124, 50, {
      fill: C.surface2, stroke: 'rgba(248,248,242,0.15)', r: 8, lw: 1.2, alpha: 0.9,
    });
    text(ctx, 'agent', cx, cy + 29, {
      size: 27, weight: 500, color: C.fg, align: 'center', baseline: 'middle', alpha: 0.9,
    });
    // an arced silent loop over the agent
    const r = 38;
    ctx.save();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.globalAlpha = alpha * 0.8;
    ctx.beginPath();
    ctx.arc(cx, cy - 2, r, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    // arrowhead on the way back down
    arrow(ctx, cx + r, cy - 14, cx + r, cy - 2, {
      color: accent, width: 1.6, progress: 1, head: 8,
    });
    for (let k = 0; k < 3; k++) {
      const f = ((t * 0.1 + k / 3) % 1);
      const ang = Math.PI + f * Math.PI;
      const x = cx + Math.cos(ang) * r;
      const y = cy - 2 + Math.sin(ang) * r;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(x, y, 3.6, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    const n = 4;
    for (let k = 0; k < n; k++) {
      card(ctx, cx - 88, cy - 36 + k * 18, 140, 12, {
        fill: k === 0 ? 'rgba(80,250,123,0.22)' : C.surface2,
        stroke: 'rgba(248,248,242,0.14)', r: 4, lw: 1, alpha: 0.9,
      });
    }
    // feedback path on the right edge: top thought down to the bottom floor
    strokePath(ctx, [
      [cx + 62, cy - 32], [cx + 98, cy - 32], [cx + 98, cy + 34], [cx + 58, cy + 34],
    ], { color: accent, width: 1.8, alpha: 0.9, rough: 0.2 });
    arrow(ctx, cx + 96, cy + 20, cx + 60, cy + 34, {
      color: accent, width: 1.8, progress: 1, head: 9,
    });
  }
  ctx.restore();
}

// ---------------------------------------------------------------- 04

const four = {
  id: 's04-three-papers',
  title: 'Three papers',
  start: start(5),
  end: start(6) + 0.44,
  draw(ctx, t) {
    const base = p(t, q.three - 0.3, 0.7);
    const cards = [
      {
        accent: M.bug, n: '01', title: 'the gate leaks',
        caption: ['softmax + cross-entropy', 'a rounding bug'],
        value: 'paper one',
      },
      {
        accent: M.thought, n: '02', title: 'thinking in silence',
        caption: ['hybrid agents', 'latent thoughts'],
        value: 'paper two',
      },
      {
        accent: M.correct, n: '03', title: 'the thought returns',
        caption: ['latent feedback', 'at training time'],
        value: 'paper three',
      },
    ];

    const w = 500;
    const h = 430;
    const xs = [160, 700, 1240];
    cards.forEach((c, i) => {
      const e = enter(t, start(5) + 0.02 + i * 0.12, 0.55, 0, 22);
      paperCard(ctx, xs[i], 278, w, h, {
        accent: c.accent, number: c.n, title: c.title, caption: c.caption,
        value: c.value, entry: e, alpha: 1, size: 44, captionSize: 31,
        valueSize: 27,
      });
      if (e.a > 0.7) {
        drawMini(ctx, i, xs[i] + w / 2, 588, e.a, t, c.accent);
      }
    });

    // A quiet connector runs under the three cards, then the two promises.
    const lineA = p(t, q.under, 0.7);
    line(ctx, 300, 760, 1620, 760, {
      color: 'rgba(248,248,242,0.12)', width: 1.4, alpha: lineA, rough: 0,
    });
    text(ctx, 'the full story in under half an hour', 960, 800, {
      size: 32, weight: 400, color: C.muted, align: 'center',
      alpha: lineA * 0.95,
    });

    // The five-line test.
    const fiveA = p(t, q.five, 0.6);
    if (fiveA > 0.001) {
      const x = 160;
      const y = 850;
      card(ctx, x, y, 560, 120, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 14, alpha: fiveA * 0.9,
      });
      for (let i = 0; i < 5; i++) {
        line(ctx, x + 26, y + 30 + i * 14, x + 26 + 64 + (i % 3) * 26, y + 30 + i * 14, {
          color: 'rgba(139,233,253,0.6)', width: 2, alpha: fiveA * 0.7, rough: 0,
        });
      }
      text(ctx, '5 lines of code', x + 170, y + 54, {
        size: 38, weight: 500, color: C.fg, alpha: fiveA,
      });
      text(ctx, 'test your own loss', x + 170, y + 94, {
        size: 28, weight: 400, color: C.muted, alpha: fiveA * 0.9,
      });
    }

    // The teaser statement.
    text(ctx, 'say less', 1740, 930, {
      size: 64, weight: 500, color: M.word, align: 'right',
      alpha: p(t, q.less, 0.55), ls: -1,
    });
    text(ctx, 'the next jump', 1740, 872, {
      size: 28, weight: 400, color: C.dim, align: 'right',
      alpha: p(t, q.less, 0.55) * 0.9,
    });

    // Base scaffold: three faint empty shells before the cards land.
    if (t < start(5) + 0.3) {
      const g = (1 - p(t, q.three, 0.5)) * 0.6;
      xs.forEach((x) => {
        card(ctx, x, 278, w, h, {
          fill: 'rgba(49,51,66,0.2)', stroke: 'rgba(248,248,242,0.10)', r: 20,
          lw: 1.4, dash: [9, 9], alpha: g,
        });
      });
    }
  },
};

export default [one, two, three, four];
