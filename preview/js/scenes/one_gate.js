import {
  C, F, W, H, clamp, lerp, p, enter, easeOutCubic, card, text, line, arrow,
  strokePath, underline, measure, icon,
} from '../kit.js';
import {
  M, tag, chip, statement, heroNumber, gate, leak, flow, pathFlow, paperCard,
  scoreList, thoughtRow, wordPill, stat, softmaxCurve, silentAgent,
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

    // One anchor: the actual score -> chance curve. Labels attach to the axes.
    softmaxCurve(ctx, 380, 330, 1160, 520, {
      alpha: 1,
      axesAlpha: 0.45 + 0.55 * p(t, 0.1, 0.6),
      curveProgress: 0.08 + 0.92 * p(t, 0.1, 1.7),
      marker: 0.72,
      markerAlpha: p(t, 2.28, 0.6),
      projectionAlpha: p(t, 2.55, 0.7),
      axisLabels: true,
      axisSize: 38,
      label: 'softmax',
      labelAlpha: p(t, q.softmax, 0.55),
      labelSize: 78,
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
    const curveA = 1 - p(t, start(3) + 0.05, 0.55);
    const crack = p(t, q.bug - 0.15, 0.7);

    // Curve phase: the same object from the hook, now with a fissure.
    if (curveA > 0.001) {
      ctx.save();
      ctx.globalAlpha = curveA;
      softmaxCurve(ctx, 380, 330, 1160, 520, {
        alpha: 1,
        axesAlpha: 1,
        curveProgress: 1,
        marker: 0.72,
        markerAlpha: 1,
        projectionAlpha: 1,
        axisLabels: true,
        axisSize: 38,
        label: 'softmax',
        labelAlpha: 1,
        labelSize: 78,
        crack,
      });

      if (crack > 0.01) {
        text(ctx, 'a bug', 1510, 330, {
          size: 52, weight: 500, color: M.bug, alpha: p(t, q.bug, 0.5),
        });
        line(ctx, 1490, 352, 1380, 382, {
          color: M.bug, width: 2, alpha: p(t, q.bug, 0.5) * 0.75, rough: 0.3,
        });
      }
      ctx.restore();
    }

    // Zero phase.
    if (zeroIn > 0.001) {
      ctx.save();
      ctx.globalAlpha = zeroIn;

      text(ctx, 'best learning signal', 960, 300, {
        size: 38, weight: 400, color: C.muted, align: 'center',
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
        size: 38, weight: 400, color: C.muted, align: 'center',
        alpha: p(t, q.best + 0.25, 0.6) * 0.95,
      });

      // Confidence meter.
      const meterA = p(t, q.sure - 0.15, 0.6);
      if (meterA > 0.001) {
        const fill = p(t, q.sure + 0.05, 1.1);
        const mx = 300;
        const mw = 1320;
        text(ctx, 'confidence', mx, 748, {
          size: 36, weight: 400, color: C.muted, alpha: meterA,
        });
        text(ctx, '100%', mx + mw, 748, {
          size: 36, weight: 500, color: M.logits, align: 'right', alpha: meterA * fill,
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
              color: M.logits, align: 'right', alpha: p(t, q.sure + 1.0, 0.5), size: 36,
            });
          }
        }
      }

      // Framework chips.
      const labels = ['JAX', 'PyTorch', 'TensorFlow', 'textbooks'];
      const size = 36;
      const widths = labels.map((l) => measure(ctx, l, size, 500, F.display, 0.2) + 44);
      const gap = 18;
      const total = widths.reduce((s, w) => s + w, 0) + gap * (labels.length - 1);
      let cx = 960 - total / 2;
      text(ctx, 'the bug lives in', 960, 846, {
        size: 36, weight: 400, color: C.muted, align: 'center',
        alpha: p(t, q.jax - 0.4, 0.6),
      });
      labels.forEach((l, i) => {
        const e = enter(t, q.jax + i * 0.42, 0.55, 0, 12);
        if (e.a > 0.001) {
          chip(ctx, cx, 910, l, {
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

    const loopPts = [[750, 390], [750, 300], [840, 250], [1010, 250], [1100, 300], [1100, 390]];

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
    text(ctx, 'thinks', 646, 522, { size: 36, weight: 400, color: M.thought, alpha: base });
    text(ctx, 'speaks', 646, 566, { size: 36, weight: 400, color: M.word, alpha: base });
    silentAgent(ctx, 958, 600, 1.0, { alpha: base, accent: M.thought });
    tag(ctx, 1016, 430, 'Stanford', {
      color: C.dim, alpha: p(t, q.stanford, 0.6) * 0.9, size: 30, align: 'right',
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
    if (toolA > 0.001) {
      arrow(ctx, 1056, 500, 1196, 500, {
        color: 'rgba(248,248,242,0.35)', width: 2, progress: toolA,
      });
      wordPill(ctx, 1216, 458, 'tool call', { alpha: toolA, size: 36 });
      text(ctx, 'the only text', 1216, 534, {
        size: 36, weight: 400, color: C.dim, alpha: toolA * 0.9,
      });
    }

    // Relative benchmark bars.
    const bx = 170;
    const by = 780;
    const trackX = 510;
    const trackW = 540;
    text(ctx, 'agent benchmarks · relative', bx, by - 34, {
      size: 36, weight: 400, color: C.dim, alpha: barsA,
    });
    const bars = [
      { label: 'frontier models', f: 0.54, color: 'rgba(184,185,197,0.65)' },
      { label: 'silent agent', f: 0.78, color: M.thought },
    ];
    bars.forEach((b, i) => {
      const yy = by + i * 70;
      text(ctx, b.label, bx, yy + 26, {
        size: 36, weight: 500, color: C.fg, alpha: barsA,
      });
      card(ctx, trackX, yy + 6, trackW, 26, {
        fill: 'rgba(248,248,242,0.07)', stroke: null, r: 6,
        alpha: barsA,
      });
      if (barsA > 0.001) {
        card(ctx, trackX, yy + 6, trackW * b.f * p(t, q.beat + i * 0.18, 0.7), 26, {
          fill: b.color, stroke: null, r: 6, alpha: barsA,
        });
      }
    });

    // Token count.
    const showStat = statA;
    if (showStat > 0.001) {
      text(ctx, '≈ ½', 1470, 852, {
        size: 112, weight: 500, color: M.thought, align: 'center',
        alpha: showStat, ls: -4,
      });
      text(ctx, 'the tokens of a normal agent', 1470, 902, {
        size: 36, weight: 400, color: C.muted, align: 'center',
        alpha: showStat * 0.95,
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
