// Reusable visual grammar for the Softmax explainer.
// Everything is authored in the fixed 1920x1080 stage.

import {
  C, F, W, H, clamp, lerp, p, enter, card, pill, text, line, arrow, strokePath,
  rr, icon, numberedChip, underline, measure, setFont, vectorStrip, easeInOut,
} from './kit.js';

export const MONO = "'JetBrains Mono', 'DejaVu Sans Mono', ui-monospace, monospace";

// Semantic colors, fixed for the whole video.
export const M = {
  gate: C.cyan,
  logits: C.yellow,
  correct: C.green,
  bug: C.red,
  thought: C.purple,
  word: C.orange,
  neutral: C.fg,
  quiet: C.muted,
};

export function mono(ctx, str, x, y, o = {}) {
  const { size = 34, weight = 500, color = C.fg, align = 'left', alpha = 1, baseline = 'alphabetic' } = o;
  text(ctx, str, x, y, { size, weight, family: MONO, color, align, alpha, baseline });
}

// Small uppercase category tag. Never used as a scene title; it names the object
// that is already on screen.
export function tag(ctx, x, y, label, o = {}) {
  const { color = C.muted, alpha = 1, size = 30, align = 'left', dot = true } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  const labelW = measure(ctx, label, size, 500, F.display, 0.6);
  const total = labelW + (dot ? 22 : 0);
  const x0 = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  if (dot) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x0 + 5, y - size * 0.34, 5.5, 0, Math.PI * 2);
    ctx.fill();
  }
  text(ctx, label, x0 + (dot ? 22 : 0), y, {
    size, weight: 500, color, alpha: 1, ls: 0.6,
  });
  ctx.restore();
}

export function chip(ctx, x, y, label, o = {}) {
  const {
    color = C.fg, border = 'rgba(248,248,242,0.22)', bg = 'rgba(49,51,66,0.55)',
    size = 32, weight = 500, alpha = 1, padX = 18, padY = 10, align = 'left',
  } = o;
  const tw = measure(ctx, label, size, weight, F.display, 0.2);
  const w = tw + padX * 2;
  const h = size + padY * 2;
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  card(ctx, x0, y - h / 2, w, h, { fill: bg, stroke: border, r: h / 2, alpha, lw: 1.4 });
  text(ctx, label, x0 + w / 2, y + 1, {
    size, weight, color, align: 'center', baseline: 'middle', alpha,
  });
  return { x: x0, y: y - h / 2, w, h };
}

// A short, left-aligned statement. Pass an array for up to two lines.
export function statement(ctx, lines, x, y, o = {}) {
  const {
    size = 76, weight = 450, color = C.fg, alpha = 1, lh = 1.12, align = 'left', ls = -1.2,
  } = o;
  if (alpha <= 0.001) return;
  const arr = Array.isArray(lines) ? lines : [lines];
  arr.forEach((s, i) => {
    text(ctx, s, x, y + i * size * lh, { size, weight, color, alpha, align, ls });
  });
}

// Hero numeral with an optional suffix and a quiet caption below.
export function heroNumber(ctx, value, x, y, o = {}) {
  const {
    size = 176, color = C.fg, alpha = 1, weight = 500, ls = -6, align = 'left',
    prefix = '', suffix = '', decimals = 0,
  } = o;
  const str = prefix + Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals,
  }) + suffix;
  text(ctx, str, x, y, { size, weight, color, alpha, align, ls });
  return measure(ctx, str, size, weight, F.display, ls);
}

// ------------------------------------------------------------------ the gate

// A tall checkpoint the thought stream has to pass through. `open` controls the
// slit width, so the same object can be "closed" in a ghost state.
export function gate(ctx, cx, cy, w = 220, h = 360, o = {}) {
  const {
    alpha = 1, open = 1, accent = M.gate, crack = 0, label = null, labelSize = 32,
    fill = C.surface, glow = 0,
  } = o;
  if (alpha <= 0.001) return { x: cx - w / 2, y: cy - h / 2, w, h };
  const x = cx - w / 2;
  const y = cy - h / 2;
  ctx.save();
  ctx.globalAlpha *= alpha;

  // Frame
  card(ctx, x, y, w, h, {
    fill, stroke: 'rgba(248,248,242,0.20)', r: 26, lw: 1.8,
    accent: null, glow,
  });
  // Inner recessed panel
  card(ctx, x + 16, y + 16, w - 32, h - 32, {
    fill: C.well, stroke: 'rgba(248,248,242,0.06)', r: 16, lw: 1.2,
  });

  // The slit.
  const sw = Math.max(6, 46 * clamp(open) * (w / 230));
  const sy = y + 42;
  const sh = h - 84;
  ctx.save();
  ctx.beginPath();
  rr(ctx, cx - sw / 2, sy, sw, sh, sw / 2);
  ctx.clip();
  ctx.fillStyle = '#171821';
  ctx.fillRect(cx - sw / 2, sy, sw, sh);
  // Flat slit wash. No gradient, no glow.
  ctx.fillStyle = 'rgba(139,233,253,0.10)';
  ctx.fillRect(cx - sw / 2, sy, sw, sh);
  ctx.restore();

  // Slit edges
  for (const sx of [cx - sw / 2, cx + sw / 2]) {
    line(ctx, sx, sy + 8, sx, sy + sh - 8, {
      color: accent, width: 2.2, alpha: 0.9, rough: 0.2,
    });
  }
  // Gate teeth along the slit
  for (let i = 0; i < 9; i++) {
    const yy = sy + 26 + i * ((sh - 52) / 8);
    line(ctx, cx - sw / 2 - 12, yy, cx - sw / 2 - 2, yy, {
      color: accent, width: 1.6, alpha: 0.45, rough: 0,
    });
    line(ctx, cx + sw / 2 + 2, yy, cx + sw / 2 + 12, yy, {
      color: accent, width: 1.6, alpha: 0.45, rough: 0,
    });
  }

  // Cap plates
  card(ctx, cx - w * 0.28, y - 10, w * 0.56, 22, {
    fill: C.surface2, stroke: 'rgba(248,248,242,0.16)', r: 8, lw: 1.4,
  });
  card(ctx, cx - w * 0.28, y + h - 12, w * 0.56, 22, {
    fill: C.surface2, stroke: 'rgba(248,248,242,0.16)', r: 8, lw: 1.4,
  });

  if (label) {
    text(ctx, label, cx, y + h + labelSize * 1.5, {
      size: labelSize, weight: 500, color: C.fg, align: 'center', ls: 0.3,
    });
  }

  if (crack > 0.001) {
    // A single clean fissure, with one small branch.
    const q = clamp(crack);
    const pts = [
      [x + w * 0.30, y + 26],
      [x + w * 0.42, y + h * 0.24],
      [x + w * 0.34, y + h * 0.46],
      [x + w * 0.52, y + h * 0.68],
      [x + w * 0.46, y + h - 26],
    ];
    strokePath(ctx, pts, { color: 'rgba(255,85,85,0.28)', width: 7, alpha: q * 0.7, progress: q, rough: 0.5 });
    strokePath(ctx, pts, { color: M.bug, width: 2.6, alpha: q, progress: q, rough: 0.7 });
    strokePath(ctx, [[x + w * 0.42, y + h * 0.24], [x + w * 0.60, y + h * 0.34]], {
      color: M.bug, width: 1.8, alpha: q * 0.8, progress: q, rough: 0.5,
    });
  }

  ctx.restore();
  return { x, y, w, h };
}

export function leak(ctx, cx, y, o = {}) {
  const { progress = 1, alpha = 1, color = M.bug } = o;
  if (progress <= 0.001) return;
  const q = clamp(progress);
  const drop = (k) => {
    const yy = y + 26 + k * 120 * q;
    ctx.save();
    ctx.globalAlpha *= alpha * (1 - k * 0.35);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, yy - 17);
    ctx.bezierCurveTo(cx + 15, yy - 2, cx + 12, yy + 14, cx, yy + 14);
    ctx.bezierCurveTo(cx - 12, yy + 14, cx - 15, yy - 2, cx, yy - 17);
    ctx.fill();
    ctx.restore();
  };
  drop(0);
  if (q > 0.4) drop(0.5);
  if (q > 0.75) drop(1);
}

// A stream of small units crossing from A to B. Used for thought flow.
export function flow(ctx, x1, y1, x2, y2, o = {}) {
  const {
    n = 9, color = M.thought, progress = 1, alpha = 1, size = 5, t = 0,
    spread = 18, speed = 0.22, seed = 1,
  } = o;
  if (progress <= 0.001 || alpha <= 0.001) return;
  const q = clamp(progress);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const phase = ((t * speed + i / n + seed * 0.13) % 1 + 1) % 1;
    if (phase > q) continue;
    const along = phase * len;
    const wob = Math.sin((phase * 3.1 + i * 1.7 + seed) * Math.PI * 2) * spread * 0.5;
    const x = x1 + (dx / len) * along + nx * wob;
    const y = y1 + (dy / len) * along + ny * wob;
    const a = Math.sin(Math.min(1, phase * 1.15) * Math.PI) * 0.85 + 0.15;
    ctx.globalAlpha = alpha * a;
    ctx.beginPath();
    ctx.arc(x, y, size * (0.7 + 0.3 * Math.sin(i + t)), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Dots travelling along a polyline. Progress clips the path, t drives motion.
export function pathFlow(ctx, pts, o = {}) {
  const {
    color = M.thought, progress = 1, alpha = 1, n = 10, size = 4.5,
    t = 0, speed = 0.18, seed = 1,
  } = o;
  if (progress <= 0.001 || alpha <= 0.001 || pts.length < 2) return;
  const segs = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    segs.push({ a: pts[i - 1], b: pts[i], l, at: total });
    total += l;
  }
  const cutoff = total * clamp(progress);
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  for (let k = 0; k < n; k++) {
    const phase = ((t * speed + k / n + seed * 0.11) % 1 + 1) % 1;
    const d = phase * total;
    if (d > cutoff) continue;
    let seg = segs[segs.length - 1];
    for (const s of segs) {
      if (d <= s.at + s.l) { seg = s; break; }
    }
    const f = seg.l < 1e-6 ? 0 : clamp((d - seg.at) / seg.l);
    const x = lerp(seg.a[0], seg.b[0], f);
    const y = lerp(seg.a[1], seg.b[1], f);
    ctx.globalAlpha = alpha * (0.5 + 0.5 * Math.sin(phase * Math.PI));
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Three-step tracker used by the loop act. `active` is 1, 2, or 3.
export function stepTracker(ctx, active, o = {}) {
  const { alpha = 1, y = 166 } = o;
  if (alpha <= 0.001) return;
  const steps = ['think', 'score', 'chances'];
  const xs = [760, 960, 1160];
  ctx.save();
  ctx.globalAlpha *= alpha;
  steps.forEach((s, i) => {
    const on = active === i + 1;
    const done = active > i + 1;
    const col = on ? M.gate : done ? 'rgba(139,233,253,0.55)' : C.dim;
    text(ctx, `${i + 1}  ${s}`, xs[i], y, {
      size: 28, weight: on ? 600 : 400, color: col, align: 'center',
      alpha: on ? 1 : 0.55,
    });
    if (i < 2) {
      line(ctx, xs[i] + 84, y - 10, xs[i + 1] - 84, y - 10, {
        color: 'rgba(248,248,242,0.18)', width: 1.2, rough: 0, alpha: 0.8,
      });
    }
  });
  ctx.restore();
}

// A horizontal bar with a word label and a relative fill. No numeric claim.
export function relativeBar(ctx, x, y, w, h, frac, o = {}) {
  const {
    color = M.logits, alpha = 1, label = null, labelSize = 34,
    bg = 'rgba(248,248,242,0.07)', dim = 1, progress = 1,
  } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  if (label) {
    text(ctx, label, x - 20, y + h / 2 + 1, {
      size: labelSize, weight: 500, color: C.fg, align: 'right',
      baseline: 'middle', alpha,
    });
  }
  rr(ctx, x, y, w, h, Math.min(6, h / 2));
  ctx.fillStyle = bg;
  ctx.fill();
  const ww = Math.max(3, w * clamp(frac) * progress);
  rr(ctx, x, y, ww, h, Math.min(6, h / 2));
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha * 0.9 * dim;
  ctx.fill();
  ctx.restore();
}


// The actual softmax shape: score on x, chance on y. One curve, one mapping.
export function softmaxCurve(ctx, x, y, w, h, o = {}) {
  const {
    alpha = 1, axesAlpha = 1, curveProgress = 1, color = M.gate,
    scoreColor = M.logits, chanceColor = M.gate,
    label = null, labelAlpha = 0, labelSize = 72,
    marker = 0.72, markerAlpha = 1, projectionAlpha = 1,
    axisLabels = true, axisSize = 36, crack = 0, crackAlpha = 1,
    compact = false,
  } = o;
  if (alpha <= 0.001) return;
  const x0 = x;
  const y0 = y;
  const x1 = x + w;
  const y1 = y + h;
  const pad = compact ? 0 : 8;

  ctx.save();
  ctx.globalAlpha *= alpha;

  // Axes: one horizontal, one vertical. No box, no grid.
  line(ctx, x0, y1, x1, y1, {
    color: 'rgba(248,248,242,0.34)', width: 2.2, alpha: axesAlpha, rough: 0,
  });
  line(ctx, x0, y0, x0, y1, {
    color: 'rgba(248,248,242,0.34)', width: 2.2, alpha: axesAlpha, rough: 0,
  });
  for (let i = 1; i <= 3; i++) {
    const fx = x0 + (w * i) / 4;
    const fy = y1 - (h * i) / 4;
    line(ctx, fx, y1, fx, y1 + 8, {
      color: 'rgba(248,248,242,0.25)', width: 1.4, alpha: axesAlpha, rough: 0,
    });
    line(ctx, x0, fy, x0 - 8, fy, {
      color: 'rgba(248,248,242,0.25)', width: 1.4, alpha: axesAlpha, rough: 0,
    });
  }

  // Sigmoid curve.
  const pts = [];
  const n = 72;
  for (let i = 0; i <= n; i++) {
    const f = i / n;
    const p = 1 / (1 + Math.exp(-7.5 * (f - 0.5)));
    pts.push([x0 + f * w, y1 - p * h]);
  }
  strokePath(ctx, pts, {
    color, width: compact ? 3 : 4, alpha: 1, progress: curveProgress, rough: 0.35,
  });

  // The mapping: score on x -> curve -> chance on y.
  if (markerAlpha > 0.001) {
    const f = clamp(marker);
    const my = y1 - (1 / (1 + Math.exp(-7.5 * (f - 0.5)))) * h;
    const mx = x0 + f * w;
    if (projectionAlpha > 0.001) {
      strokePath(ctx, [[mx, y1], [mx, my], [x0, my]], {
        color: 'rgba(248,248,242,0.36)', width: 1.6, alpha: projectionAlpha,
        progress: 1, rough: 0, dash: [7, 8],
      });
    }
    ctx.save();
    ctx.globalAlpha *= markerAlpha;
    ctx.fillStyle = scoreColor;
    ctx.beginPath();
    ctx.arc(mx, y1, compact ? 6 : 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = chanceColor;
    ctx.beginPath();
    ctx.arc(x0, my, compact ? 6 : 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Axis labels sit next to their axes, never in the far corners.
  if (axisLabels) {
    text(ctx, 'score', x0 + w / 2, y1 + axisSize * (compact ? 1.4 : 1.6), {
      size: axisSize, weight: 400, color: scoreColor, align: 'center', alpha: axesAlpha,
    });
    text(ctx, 'chance', x0 - (compact ? 14 : 20), y0 + axisSize * 0.8, {
      size: axisSize, weight: 400, color: chanceColor, align: 'right', alpha: axesAlpha,
    });
  }

  // The name attaches to the curve, not to a scene corner.
  if (label && labelAlpha > 0.001) {
    const lx = x0 + w * (compact ? 0.52 : 0.58);
    const ly = y0 - (compact ? 18 : 34);
    text(ctx, label, lx, ly, {
      size: labelSize, weight: 500, color: C.fg, align: 'center', alpha: labelAlpha, ls: -1,
    });
  }

  // A fissure for the "standard version has a bug" beat.
  if (crack > 0.001) {
    const f = 0.84;
    const cx = x0 + f * w;
    const cy = y1 - (1 / (1 + Math.exp(-7.5 * (f - 0.5)))) * h;
    const pts2 = [
      [cx - 30, cy + 44], [cx - 8, cy + 18], [cx + 10, cy + 30],
      [cx + 22, cy - 2], [cx + 8, cy - 22], [cx + 34, cy - 44],
    ];
    strokePath(ctx, pts2, {
      color: 'rgba(255,85,85,0.35)', width: 8, alpha: crack * crackAlpha * 0.7,
      progress: crack, rough: 0.4,
    });
    strokePath(ctx, pts2, {
      color: M.bug, width: 3, alpha: crack * crackAlpha, progress: crack, rough: 0.6,
    });
  }

  ctx.restore();
  return { x0, y0, x1, y1 };
}


// ------------------------------------------------------------------ people / pictures

// A single simple singer at a microphone. Flat line art, no gradients.
export function singer(ctx, x, y, s = 1, o = {}) {
  const { color = C.fg, accent = M.logits, alpha = 1, pose = 'neutral' } = o;
  if (alpha <= 0.001) return;
  s = s * 1;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(2.6, 3.2 * s);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Head, neck, torso, legs.
  ctx.beginPath();
  ctx.arc(x, y - 86 * s, 12 * s, 0, Math.PI * 2);
  ctx.stroke();
  // eyes
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x - 4 * s, y - 88 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.arc(x + 4 * s, y - 88 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
  // body
  ctx.beginPath();
  ctx.moveTo(x, y - 74 * s);
  ctx.lineTo(x, y - 30 * s);
  ctx.moveTo(x, y - 30 * s);
  ctx.lineTo(x - 13 * s, y);
  ctx.moveTo(x, y - 30 * s);
  ctx.lineTo(x + 13 * s, y);
  ctx.stroke();

  // Left arm, right arm toward the mic.
  const handY = pose === 'confident' ? -55 : pose === 'hesitant' ? -34 : -44;
  ctx.beginPath();
  ctx.moveTo(x, y - 62 * s);
  ctx.lineTo(x - 18 * s, y - 40 * s);
  ctx.moveTo(x, y - 62 * s);
  ctx.lineTo(x + 18 * s, y + handY * s);
  ctx.stroke();

  // Mic stand.
  const mx = x + 27 * s;
  ctx.strokeStyle = 'rgba(248,248,242,0.65)';
  ctx.beginPath();
  ctx.moveTo(mx, y + 6 * s);
  ctx.lineTo(mx, y - 55 * s);
  ctx.stroke();
  ctx.fillStyle = accent;
  rr(ctx, mx - 5 * s, y - 66 * s, 10 * s, 17 * s, 5 * s);
  ctx.fill();
  ctx.restore();
}

// A small desk robot doing addition cards. Flat line art, no gradients.
export function deskRobot(ctx, x, y, s = 1, o = {}) {
  const { color = C.fg, accent = M.logits, alpha = 1 } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(2.2, 3 * s);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Desk.
  ctx.beginPath();
  ctx.moveTo(x + 4 * s, y + 94 * s);
  ctx.lineTo(x + 138 * s, y + 94 * s);
  ctx.moveTo(x + 18 * s, y + 94 * s);
  ctx.lineTo(x + 12 * s, y + 116 * s);
  ctx.moveTo(x + 124 * s, y + 94 * s);
  ctx.lineTo(x + 130 * s, y + 116 * s);
  ctx.stroke();

  // Head + antenna.
  rr(ctx, x + 38 * s, y + 8 * s, 52 * s, 34 * s, 9 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 64 * s, y + 8 * s);
  ctx.lineTo(x + 64 * s, y - 2 * s);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(x + 64 * s, y - 5 * s, 4 * s, 0, Math.PI * 2);
  ctx.fill();
  // Eyes.
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + 54 * s, y + 25 * s, 2.5 * s, 0, Math.PI * 2);
  ctx.arc(x + 74 * s, y + 25 * s, 2.5 * s, 0, Math.PI * 2);
  ctx.fill();

  // Body, legs, arms.
  rr(ctx, x + 48 * s, y + 50 * s, 34 * s, 30 * s, 6 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 52 * s, y + 80 * s);
  ctx.lineTo(x + 50 * s, y + 94 * s);
  ctx.moveTo(x + 78 * s, y + 80 * s);
  ctx.lineTo(x + 80 * s, y + 94 * s);
  ctx.moveTo(x + 48 * s, y + 58 * s);
  ctx.lineTo(x + 28 * s, y + 74 * s);
  ctx.moveTo(x + 82 * s, y + 58 * s);
  ctx.lineTo(x + 102 * s, y + 70 * s);
  ctx.stroke();

  // Two addition cards with dots (no numbers, no text).
  const cards = [
    { cx: x + 104 * s, cy: y + 64 * s, dots: 2 },
    { cx: x + 126 * s, cy: y + 78 * s, dots: 3 },
  ];
  cards.forEach((c) => {
    rr(ctx, c.cx - 12 * s, c.cy - 9 * s, 24 * s, 18 * s, 3 * s);
    ctx.stroke();
    ctx.fillStyle = accent;
    for (let i = 0; i < c.dots; i++) {
      const ox = (i % 2) * 8 * s - 4 * s;
      const oy = Math.floor(i / 2) * 8 * s - 4 * s;
      ctx.beginPath();
      ctx.arc(c.cx + ox, c.cy + oy, 2.2 * s, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();
}

// A calm bean agent with a silent thought bubble and a small tool.
export function silentAgent(ctx, x, y, s = 1, o = {}) {
  const { color = C.fg, accent = M.thought, alpha = 1 } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(2.2, 3 * s);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Thought bubble: dotted outline, three cells, no words.
  rr(ctx, x - 34 * s, y - 152 * s, 88 * s, 50 * s, 18 * s);
  ctx.setLineDash([5 * s, 7 * s]);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(x + 2 * s, y - 96 * s, 5 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = accent;
  for (let i = 0; i < 3; i++) {
    rr(ctx, x - 18 * s + i * 20 * s, y - 136 * s, 12 * s, 18 * s, 3 * s);
    ctx.fill();
  }
  ctx.fillStyle = color;

  // Head, body, legs.
  ctx.beginPath();
  ctx.arc(x, y - 78 * s, 13 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x - 4 * s, y - 80 * s, 1.6 * s, 0, Math.PI * 2);
  ctx.arc(x + 4 * s, y - 80 * s, 1.6 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, y - 65 * s);
  ctx.lineTo(x, y - 26 * s);
  ctx.moveTo(x, y - 26 * s);
  ctx.lineTo(x - 13 * s, y + 2 * s);
  ctx.moveTo(x, y - 26 * s);
  ctx.lineTo(x + 13 * s, y + 2 * s);
  ctx.stroke();

  // Arms; one holds a wrench.
  ctx.beginPath();
  ctx.moveTo(x, y - 56 * s);
  ctx.lineTo(x - 20 * s, y - 34 * s);
  ctx.moveTo(x, y - 56 * s);
  ctx.lineTo(x + 20 * s, y - 40 * s);
  ctx.stroke();
  tool(ctx, x + 12 * s, y - 38 * s, 22 * s, { color, alpha: 1, width: 2.4 });

  // Tool belt.
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y - 26 * s);
  ctx.lineTo(x + 12 * s, y - 26 * s);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(x, y - 26 * s, 3 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// ------------------------------------------------------------------ data marks

// A horizontal list of signed scores around a zero line.
export function scoreList(ctx, x, y, w, rows, o = {}) {
  const {
    max = 10, alpha = 1, color = M.logits, rowH = 58, gap = 12, size = 34,
    labelSize = 36, valueSize = 36, progress = 1, highlight = -1, dim = 1,
    zeroFrac = 0.38, halfFrac = 0.6,
  } = o;
  if (alpha <= 0.001) return;
  const zero = x + w * zeroFrac;
  const half = w * halfFrac;
  ctx.save();
  ctx.globalAlpha *= alpha;
  // zero line
  line(ctx, zero, y - 16, zero, y + rows.length * (rowH + gap) - gap + 16, {
    color: 'rgba(248,248,242,0.18)', width: 1.4, rough: 0,
  });
  rows.forEach((r, i) => {
    const yy = y + i * (rowH + gap);
    const a = alpha * (highlight === i || highlight < 0 ? 1 : dim * 0.55);
    const v = r.value;
    const bw = Math.max(2, half * clamp(Math.abs(v) / max) * progress);
    const col = r.color || (v >= 0 ? color : C.muted);
    text(ctx, r.label, x, yy + rowH * 0.5 + 1, {
      size: labelSize, weight: 500, color: C.fg, alpha: a, baseline: 'middle',
    });
    const bx = v >= 0 ? zero + 1 : zero - 1;
    rr(ctx, v >= 0 ? bx : bx - bw, yy + 8, bw, rowH - 16, 6);
    ctx.fillStyle = col;
    ctx.globalAlpha = a * (v >= 0 ? 0.85 : 0.7);
    ctx.fill();
    ctx.globalAlpha = a;
    const valStr = (v > 0 ? '+' : '') + String(v);
    text(ctx, valStr, v >= 0 ? bx + bw + 14 : bx - bw - 14, yy + rowH * 0.5 + 1, {
      size: valueSize, weight: 500, color: col, align: v >= 0 ? 'left' : 'right',
      baseline: 'middle',
    });
  });
  ctx.restore();
}

// Flat probability bars, one row per word.
export function probList(ctx, x, y, w, rows, o = {}) {
  const {
    alpha = 1, color = M.gate, rowH = 52, gap = 14, size = 34, valueSize = 36,
    progress = 1, labelW = 150, highlight = -1,
  } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  rows.forEach((r, i) => {
    const yy = y + i * (rowH + gap);
    const a = alpha * (highlight === i || highlight < 0 ? 1 : 0.5);
    text(ctx, r.label, x, yy + rowH * 0.5 + 1, {
      size, weight: 500, color: C.fg, alpha: a, baseline: 'middle',
    });
    const bx = x + labelW;
    const bw = w - labelW - 90;
    rr(ctx, bx, yy + 10, bw, rowH - 20, 6);
    ctx.fillStyle = 'rgba(248,248,242,0.07)';
    ctx.fill();
    const fw = Math.max(3, bw * clamp(r.value) * progress);
    rr(ctx, bx, yy + 10, fw, rowH - 20, 6);
    ctx.fillStyle = r.color || color;
    ctx.fill();
    const pct = r.label2 ?? `${Math.round(r.value * 100)}%`;
    text(ctx, pct, x + w, yy + rowH * 0.5 + 1, {
      size: valueSize, weight: 500, color: r.color || color, align: 'right', baseline: 'middle',
    });
  });
  ctx.restore();
}

// One stacked chance bar with direct labels inside/above.
export function probStack(ctx, x, y, w, h, parts, o = {}) {
  const {
    alpha = 1, progress = 1, size = 32, showPct = true, bg = 'rgba(248,248,242,0.07)',
  } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  rr(ctx, x, y, w, h, Math.min(10, h / 2));
  ctx.fillStyle = bg;
  ctx.fill();
  let cx = x;
  const total = parts.reduce((s, q) => s + q.value, 0) || 1;
  const gap = 3;
  parts.forEach((part, i) => {
    const seg = (w - gap * (parts.length - 1)) * (part.value / total) * progress;
    if (seg > 0.5) {
      rr(ctx, cx, y, Math.max(2, seg), h, Math.min(10, h / 2));
      ctx.fillStyle = part.color;
      ctx.fill();
      if (showPct && seg > 70) {
        text(ctx, part.label ?? `${Math.round(part.value * 100)}%`, cx + seg / 2, y + h / 2 + 1, {
          size, weight: 500, color: '#1E1F29', align: 'center', baseline: 'middle',
        });
      }
    }
    cx += seg + gap;
  });
  ctx.restore();
}

// A horizontal embedding strip: cells, not bars.
export function thoughtRow(ctx, x, y, w, h, o = {}) {
  const {
    cells = 24, color = M.thought, alpha = 1, seed = 1, gap = 3, progress = 1,
    accent = null, uniform = false,
  } = o;
  if (alpha <= 0.001) return;
  const cw = (w - gap * (cells - 1)) / cells;
  ctx.save();
  for (let i = 0; i < cells; i++) {
    const q = clamp(progress * 1.5 - i * 0.018);
    if (q <= 0) continue;
    const v = uniform ? 0.72 : 0.22 + 0.72 * Math.abs(Math.sin((seed * 13.17 + i * 7.31) * 43.7) % 1);
    ctx.globalAlpha = alpha * q * v;
    ctx.fillStyle = accent && i === Math.floor(cells * 0.62) ? accent : color;
    rr(ctx, x + i * (cw + gap), y, cw, h, Math.min(3, cw / 2));
    ctx.fill();
  }
  ctx.restore();
}

export function wordPill(ctx, x, y, label, o = {}) {
  return pill(ctx, x, y, label, {
    size: 36, weight: 500, color: '#1E1F29', bg: M.word, padX: 22, padY: 11,
    ...o,
  });
}

export function tokenPill(ctx, x, y, label, id, o = {}) {
  const { alpha = 1, size = 34 } = o;
  const r = pill(ctx, x, y, label, {
    size, weight: 600, color: '#1E1F29', bg: M.word, padX: 22, padY: 11, alpha,
  });
  if (id) {
    text(ctx, id, r.x + r.w / 2, r.y + r.h + 26, {
      size: 26, family: MONO, color: C.dim, align: 'center', alpha,
    });
  }
  return r;
}

// ------------------------------------------------------------------ charts

export function axes(ctx, x, y, w, h, o = {}) {
  const { alpha = 1, color = 'rgba(248,248,242,0.24)', xLabel = null, yLabel = null, size = 30 } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  line(ctx, x, y + h, x + w, y + h, { color, width: 1.6, rough: 0 });
  line(ctx, x, y, x, y + h, { color, width: 1.6, rough: 0 });
  if (xLabel) text(ctx, xLabel, x + w, y + h + size * 1.4, {
    size, color: C.dim, align: 'right',
  });
  if (yLabel) text(ctx, yLabel, x - 16, y - 10, { size, color: C.dim, align: 'right' });
  ctx.restore();
}

const CURVES = {
  grok: [
    [0, 0.93], [0.05, 0.82], [0.11, 0.44], [0.17, 0.27], [0.25, 0.23],
    [0.42, 0.22], [0.58, 0.21], [0.66, 0.2], [0.71, 0.13], [0.75, 0.055],
    [0.82, 0.032], [0.92, 0.028], [1, 0.026],
  ],
  sling: [
    [0, 0.93], [0.05, 0.82], [0.11, 0.44], [0.17, 0.27], [0.25, 0.24],
    [0.31, 0.23], [0.335, 0.67], [0.365, 0.26], [0.47, 0.24], [0.5, 0.78],
    [0.53, 0.27], [0.61, 0.25], [0.645, 0.58], [0.675, 0.23], [0.72, 0.12],
    [0.76, 0.05], [0.84, 0.03], [1, 0.027],
  ],
  never: [
    [0, 0.93], [0.05, 0.82], [0.11, 0.44], [0.17, 0.28], [0.3, 0.27],
    [0.45, 0.27], [0.6, 0.28], [0.75, 0.27], [0.9, 0.28], [1, 0.27],
  ],
  flat: [
    [0, 0.5], [0.15, 0.5], [0.3, 0.5], [0.5, 0.5], [0.7, 0.5], [1, 0.5],
  ],
};

export function lossCurve(ctx, x, y, w, h, o = {}) {
  const {
    kind = 'grok', alpha = 1, progress = 1, color = M.gate, width = 3.4,
    ghost = null, markers = [], label = null,
  } = o;
  if (alpha <= 0.001) return;
  const pts = CURVES[kind] || CURVES.grok;
  const map = ([px, py]) => [x + px * w, y + (1 - py) * h];
  ctx.save();
  ctx.globalAlpha *= alpha;
  if (ghost) {
    const g = CURVES[ghost] || CURVES.never;
    strokePath(ctx, g.map(map), {
      color: 'rgba(248,248,242,0.28)', width: 2, alpha: alpha * 0.6, rough: 0.2, dash: [9, 9],
    });
  }
  const n = pts.length;
  const shown = Math.max(2, Math.ceil(n * clamp(progress)));
  strokePath(ctx, pts.slice(0, shown).map(map), {
    color, width, alpha, rough: 0.4,
  });
  if (progress > 0.98) {
    for (const m of markers) {
      const [mx, my] = map(m);
      ctx.fillStyle = C.bug;
      ctx.beginPath();
      ctx.arc(mx, my, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = alpha * 0.24;
      ctx.beginPath();
      ctx.arc(mx, my, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = alpha;
    }
  }
  if (label) text(ctx, label, x + w, y - 12, { size: 30, color, align: 'right', alpha });
  ctx.restore();
}

// Three-card paper strip with direct labels.
export function paperCard(ctx, x, y, w, h, o = {}) {
  const {
    accent = C.cyan, alpha = 1, number = null, title = '', caption = '', value = '',
    entry = null, ghost = false, active = 1, size = 42, captionSize = 32,
    valueSize = 30, valueColor = null, valueMono = true,
  } = o;
  if (alpha <= 0.001) return;
  const e = entry || { a: alpha, dy: 0 };
  ctx.save();
  ctx.globalAlpha *= alpha * e.a;
  const yy = y + (e.dy || 0);
  card(ctx, x, yy, w, h, {
    fill: ghost ? 'rgba(49,51,66,0.28)' : C.surface,
    stroke: ghost ? 'rgba(248,248,242,0.12)' : 'rgba(248,248,242,0.16)',
    r: 20, lw: 1.6, dash: ghost ? [8, 8] : null,
    accent: ghost ? null : accent, accentW: 4,
  });
  if (number) {
    text(ctx, number, x + 34, yy + 64, {
      size: 28, weight: 600, color: accent, family: MONO, alpha: active * 0.9,
    });
  }
  text(ctx, title, x + 34, yy + (number ? 118 : 88), {
    size, weight: 500, color: C.fg, alpha: active,
  });
  if (caption) {
    const lines = Array.isArray(caption) ? caption : [caption];
    lines.forEach((s, i) => text(ctx, s, x + 34, yy + (number ? 168 : 140) + i * captionSize * 1.34, {
      size: captionSize, weight: 400, color: C.muted, alpha: active * 0.92,
    }));
  }
  if (value) {
    text(ctx, value, x + 34, yy + h - 30, {
      size: valueSize, weight: valueMono ? 600 : 500, color: valueColor || accent,
      alpha: active, family: valueMono ? MONO : F.display, ls: valueMono ? 0.4 : 0,
    });
  }
  ctx.restore();
}

// A framed landscape, used once for the "describing a painting" beat.
export function painting(ctx, x, y, w, h, o = {}) {
  const { alpha = 1, progress = 1, label = null } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  card(ctx, x, y, w, h, { fill: C.surface, stroke: 'rgba(248,248,242,0.18)', r: 8, lw: 2 });
  const ix = x + 16;
  const iy = y + 16;
  const iw = w - 32;
  const ih = h - 32;
  ctx.save();
  rr(ctx, ix, iy, iw, ih, 3);
  ctx.clip();
  // Flat dusk bands. No gradient.
  const bands = [
    ['#2a2038', 0, 0.5],
    ['#5a3348', 0.5, 0.72],
    ['#8c4652', 0.72, 0.84],
    ['#d07a4f', 0.84, 1],
  ];
  bands.forEach(([col, a, b]) => {
    ctx.fillStyle = col;
    ctx.fillRect(ix, iy + ih * a, iw, ih * (b - a));
  });
  ctx.fillStyle = '#F1FA8C';
  ctx.globalAlpha = alpha * 0.9;
  ctx.beginPath();
  ctx.arc(ix + iw * 0.68, iy + ih * 0.35, Math.min(iw, ih) * 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = alpha;
  // hills
  ctx.fillStyle = '#2d2438';
  ctx.beginPath();
  ctx.moveTo(ix, iy + ih * 0.68);
  ctx.lineTo(ix + iw * 0.2, iy + ih * 0.5);
  ctx.lineTo(ix + iw * 0.38, iy + ih * 0.64);
  ctx.lineTo(ix + iw * 0.6, iy + ih * 0.48);
  ctx.lineTo(ix + iw * 0.8, iy + ih * 0.62);
  ctx.lineTo(ix + iw, iy + ih * 0.52);
  ctx.lineTo(ix + iw, iy + ih);
  ctx.lineTo(ix, iy + ih);
  ctx.closePath();
  ctx.fill();
  // water/ground lines
  strokePath(ctx, [
    [ix, iy + ih * 0.8], [ix + iw * 0.3, iy + ih * 0.78],
    [ix + iw * 0.6, iy + ih * 0.82], [ix + iw, iy + ih * 0.79],
  ], { color: 'rgba(248,248,242,0.42)', width: 2, alpha, progress, rough: 0.8 });
  ctx.restore();
  if (label) text(ctx, label, x + w / 2, y + h + 38, {
    size: 30, color: C.muted, align: 'center', alpha,
  });
  ctx.restore();
}

// Transformer floor stack. Floors are 1 at the bottom.
export function floorStack(ctx, x, y, w, h, n, o = {}) {
  const {
    alpha = 1, accent = M.gate, highlight = 0, lit = 1, gap = 7,
    labelEvery = 0, size = 28,
  } = o;
  if (alpha <= 0.001) return [];
  const fh = (h - gap * (n - 1)) / n;
  const out = [];
  for (let i = 0; i < n; i++) {
    const yy = y + (n - 1 - i) * (fh + gap);
    const active = highlight === i + 1 || highlight < 0;
    card(ctx, x, yy, w, fh, {
      fill: active ? 'rgba(68,71,90,0.85)' : 'rgba(49,51,66,0.55)',
      stroke: active ? 'rgba(139,233,253,0.34)' : 'rgba(248,248,242,0.10)',
      r: Math.min(8, fh / 3), lw: 1.2, alpha,
    });
    if (i === 0 || i === n - 1 || (labelEvery && i % labelEvery === 0)) {
      text(ctx, String(i + 1), x + 16, yy + fh / 2 + 1, {
        size, family: MONO, color: active ? accent : C.dim, alpha: alpha * (active ? 0.9 : 0.6),
        baseline: 'middle',
      });
    }
    out.push({ x, y: yy, w, h: fh });
  }
  return out;
}

// A compact stat: value above a short label.
export function stat(ctx, x, y, value, label, o = {}) {
  const { color = C.fg, alpha = 1, size = 64, labelSize = 30, align = 'left', sub = null } = o;
  text(ctx, value, x, y, {
    size, weight: 500, color, alpha, align, ls: -1.6,
  });
  text(ctx, label, x, y + labelSize * 1.45, {
    size: labelSize, weight: 400, color: C.muted, alpha: alpha * 0.95, align,
  });
  if (sub) text(ctx, sub, x, y + labelSize * 1.45 + labelSize * 1.2, {
    size: 26, weight: 400, color: C.dim, alpha, align,
  });
}

// Short connector with a direct label.
export function connector(ctx, x1, y1, x2, y2, o = {}) {
  const {
    color = 'rgba(248,248,242,0.34)', width = 2, progress = 1, label = null,
    labelSize = 28, labelColor = C.muted, dashed = false, head = 10,
  } = o;
  arrow(ctx, x1, y1, x2, y2, { color, width, progress, dashed, head });
  if (label) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    text(ctx, label, mx, my - 16, {
      size: labelSize, color: labelColor, align: 'center', alpha: progress,
    });
  }
}

// Wrench: the only icon not in the base kit.
export function tool(ctx, x, y, size, o = {}) {
  const { color = C.fg, alpha = 1, width = 3 } = o;
  if (alpha <= 0.001) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(x, y);
  ctx.scale(size / 100, size / 100);
  ctx.strokeStyle = color;
  ctx.lineWidth = width * 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(28, 78);
  ctx.lineTo(62, 44);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(70, 32, 19, -0.35 * Math.PI, 0.45 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(56, 20);
  ctx.lineTo(70, 32);
  ctx.stroke();
  ctx.restore();
}

// A small page stack used for written reasoning.
export function pageStack(ctx, x, y, w, h, n, o = {}) {
  const { alpha = 1, color = M.word, progress = 1, lines = 9 } = o;
  if (alpha <= 0.001) return;
  for (let i = n - 1; i >= 0; i--) {
    const off = i * 10;
    card(ctx, x + off, y - off, w, h, {
      fill: i === 0 ? C.surface2 : C.surface,
      stroke: 'rgba(248,248,242,0.16)', r: 8, lw: 1.3,
      alpha: alpha * (0.5 + 0.5 * (1 - i / Math.max(1, n))),
    });
    if (i === 0) {
      for (let k = 0; k < lines; k++) {
        const q = clamp(progress * 1.6 - k * 0.035);
        if (q <= 0) continue;
        line(ctx, x + 24, y + 32 + k * ((h - 52) / (lines - 1)),
          x + 24 + (w - 48) * (0.45 + 0.5 * Math.abs(Math.sin(k * 2.7) % 1)) * q,
          y + 32 + k * ((h - 52) / (lines - 1)),
          { color, width: 2.4, alpha: alpha * 0.5, rough: 0 });
      }
    }
  }
}
