import {
  C, F, W, H, clamp, lerp, p, enter, easeInOut, card, text, line, arrow,
  strokePath, underline, measure, bracket, rr, icon, numberedChip,
} from '../kit.js';
import {
  M, tag, chip, statement, gate, leak, flow, pathFlow, thoughtRow, wordPill,
  relativeBar, axes, lossCurve, floorStack, stat, mono, MONO,
} from '../motifs.js';
import { at, start } from '../data/timeline.js';

const q = {
  now: at('now the third paper', 86),
  same: at('same thing', 86),
  training: at('at training time', 86),

  normal: at('normal transformer', 87),
  flows: at('flows up', 87),
  bottom: at('bottom floor', 87),
  climbs: at('climbs', 87),
  top: at('top floor', 87),
  next: at('next word', 87),
  never: at('never goes back down', 87),

  feedback: at('latent feedback changes', 88),
  hands: at('hands it to the bottom', 88),
  four: at('four lines of code', 88),
  cost: at('1.2 times', 88),

  worth: at('is that worth it', 89),
  fair: at('fair fight', 89),
  running: at('high-quality text', 89),
  again: at('same data again', 89),
  worthLess: at('worth less', 89),
  extra: at('extra compute', 89),
  pass: at('one more pass', 89),

  mostly: at('mostly yes', 90),
  unique: at('unique text', 90),
  fixed: at('data fixed', 90),
  p48: at('48 percent', 90),
  passes: at('passes fixed', 90),
  p47: at('47 percent', 90),
  m60: at('60 million', 90),
  m778: at('778 million', 90),
  m271: at('271 million', 90),
  p03: at('0.3 percent', 90),
  serving: at('serving time', 90),

  catch: at('there is a catch', 91),
  scarce: at('data is scarce', 91),
  t125: at('12.5', 91),
  twoPasses: at('two passes', 91),
  p8: at('8 percent', 91),
  small: at('small models', 91),
  die: at('die at scale', 91),

  sameStory: at('same story', 92),
  rich: at('rich thought', 92),
  throws: at('throws it away', 92),

  dial: at('put the three papers together', 93),
  aDial: at('a dial', 93),
  howMuch: at('how much of its thinking', 94),

  left: at('turn it all the way left', 95),
  cot: at('chain of thought', 95),
  right: at('turn it all the way right', 95),
  decision: at('decision model', 95),
  hybrid: at('hybrid agents', 95),
  sayMatters: at('say what matters', 95),

  recapGate: at('softmax is the gate', 96),
  recapLeak: at('gate leaks', 96),
  confident: at('most confident', 96),
  push: at('push too much', 96),

  guess: at('this next part is a guess', 97),
  softLabels: at('soft labels', 97),
  distill: at('distillation', 97),
  secondBug: at('second bug lives', 97),
  nobody: at('nobody has tested', 97),
  afternoon: at('worth an afternoon', 97),

  monday: at('what do you do on Monday', 98),
  one: at('one', 99),
  gradTest: at('gradient test', 99),
  precision: at('precision you actually', 99),
  two: at('two', 100),
  distort: at('if you distill', 100),
  identical: at('identical student', 100),
  three: at('three', 101),
  readCode: at('read the HybridAgent', 101),
  serving2: at('serving stack', 101),

  work: at('so much of this work', 102),
  throwAway: at('thinking we throw away', 102),

  oneMore: at('one more thing', 103),
  tiny: at('tiny example', 104),
  common: at('how common', 104),
  maybe: at('maybe your runs', 104),

  runTest: at('run the five-line test', 105),
  post: at('post your number', 105),
  comments: at('comments', 105),

  final1: at('softmax has been', 106),
  final2: at('still finding things wrong', 106),
};

// ---------------------------------------------------------------- 62

const sixtyTwo = {
  id: 's62-third-paper',
  title: 'The third paper',
  start: start(86),
  end: start(87),
  draw(ctx, t) {
    const base = 0.85;
    const nowA = p(t, q.now, 0.6);
    const sameA = p(t, q.same, 0.6);
    const trainA = p(t, q.training, 0.6);

    tag(ctx, 960, 220, 'paper three', { color: C.dim, alpha: nowA * 0.9, size: 30, align: 'center' });

    // A ghost stack behind.
    floorStack(ctx, 1360, 300, 180, 360, 6, {
      alpha: base * 0.35, accent: M.correct, highlight: 0,
    });

    text(ctx, 'the same idea', 760, 470, {
      size: 56, weight: 450, color: C.fg, align: 'center', alpha: sameA, ls: -1,
    });
    if (trainA < 0.99) {
      text(ctx, 'at training time', 760, 550, {
        size: 56, weight: 500, color: C.dim, align: 'center', alpha: 0.14, ls: -1,
      });
    }
    text(ctx, 'at training time', 760, 550, {
      size: 56, weight: 500, color: C.correct, align: 'center', alpha: trainA, ls: -1,
    });
    if (trainA > 0.4) {
      underline(ctx, 500, 580, 520, {
        color: M.correct, width: 3, alpha: trainA * 0.85, progress: p(t, q.training + 0.2, 0.5),
      });
    }
    text(ctx, 'not at inference. inside the training loop.', 760, 660, {
      size: 28, weight: 400, color: C.muted, align: 'center', alpha: trainA * 0.85,
    });
  },
};

// ---------------------------------------------------------------- 63

const sixtyThree = {
  id: 's63-floors',
  title: 'Info flows up',
  start: start(87),
  end: start(88),
  draw(ctx, t) {
    const base = 0.9;
    const normalA = p(t, q.normal, 0.6);
    const flowsA = p(t, q.flows, 0.6);
    const bottomA = p(t, q.bottom, 0.6);
    const climbA = p(t, q.climbs, 0.7);
    const topA = p(t, q.top, 0.5);
    const nextA = p(t, q.next, 0.6);
    const neverA = p(t, q.never, 0.7);

    tag(ctx, 180, 220, 'a normal transformer', { color: C.muted, alpha: normalA * 0.95, size: 30 });

    const floors = floorStack(ctx, 780, 280, 300, 460, 8, {
      alpha: base * 0.95, accent: M.gate,
      highlight: topA > 0.3 ? 8 : bottomA > 0.3 ? 1 : 0,
      lit: 1,
    });

    // Word enters the bottom.
    if (bottomA > 0.001) {
      wordPill(ctx, 850, 770, 'word', { size: 30, alpha: bottomA });
      arrow(ctx, 930, 754, 930, 746, {
        color: 'rgba(248,248,242,0.35)', width: 2, progress: bottomA, head: 8,
      });
    }

    // Thought climbs.
    if (climbA > 0.001) {
      const x = 930;
      line(ctx, x, 730, x, 300, {
        color: 'rgba(139,233,253,0.35)', width: 2.2, alpha: climbA * 0.8, rough: 0.2,
      });
      pathFlow(ctx, [[x, 730], [x, 300]], {
        color: M.gate, alpha: climbA, progress: 1, n: 8, t, size: 5, speed: 0.12, seed: 2,
      });
      tag(ctx, 750, 250, 'the thought climbs', { color: M.gate, alpha: climbA * 0.9, size: 26 });
    }

    // Top floor decides the next word.
    if (nextA > 0.001) {
      arrow(ctx, 1090, 300, 1190, 300, {
        color: 'rgba(248,248,242,0.32)', width: 2, progress: nextA, head: 9,
      });
      wordPill(ctx, 1204, 268, 'next', { size: 34, alpha: nextA });
    }

    // The top thought is not fed back.
    if (neverA > 0.001) {
      arrow(ctx, 1080, 360, 1360, 520, {
        color: 'rgba(255,85,85,0.55)', width: 2.6,
        progress: neverA, head: 12, curve: -30,
      });
      tag(ctx, 1380, 540, 'discarded', { color: M.bug, alpha: neverA * 0.95, size: 32 });
      text(ctx, 'the finished thought never goes back down', 960, 920, {
        size: 32, weight: 400, color: C.muted, align: 'center', alpha: neverA * 0.95,
      });
    }
  },
};

// ---------------------------------------------------------------- 64

const sixtyFour = {
  id: 's64-feedback',
  title: 'The thought comes back down',
  start: start(88),
  end: start(89),
  draw(ctx, t) {
    const base = 0.9;
    const feedA = p(t, q.feedback, 0.6);
    const handsA = p(t, q.hands, 0.7);
    const codeA = p(t, q.four, 0.6);
    const costA = p(t, q.cost, 0.6);

    tag(ctx, 180, 220, 'latent feedback', { color: M.correct, alpha: feedA * 0.95, size: 30 });

    floorStack(ctx, 560, 280, 280, 460, 8, {
      alpha: base * 0.95, accent: M.gate, highlight: handsA > 0.3 ? 1 : 8,
    });

    // Top thought.
    thoughtRow(ctx, 920, 280, 420, 54, {
      cells: 14, color: M.thought, alpha: feedA * 0.9, progress: p(t, q.feedback + 0.2, 0.6),
    });
    tag(ctx, 920, 250, 'the finished thought', { color: M.thought, alpha: feedA * 0.9, size: 26 });

    // The feedback path.
    if (handsA > 0.001) {
      const pts = [[920, 330], [950, 330], [950, 785], [700, 785], [700, 754]];
      strokePath(ctx, pts, {
        color: 'rgba(80,250,123,0.55)', width: 2.6, alpha: handsA,
        progress: p(t, q.hands, 0.9), rough: 0.3,
      });
      arrow(ctx, 700, 720, 700, 754, {
        color: 'rgba(80,250,123,0.8)', width: 2.4, progress: p(t, q.hands + 0.5, 0.3), head: 12,
      });
      pathFlow(ctx, pts, {
        color: M.correct, alpha: handsA * 0.8, progress: p(t, q.hands, 0.9),
        n: 9, t, size: 4.5, speed: 0.1, seed: 3,
      });
      text(ctx, 'the next word starts here', 700, 820, {
        size: 28, weight: 400, color: C.muted, align: 'center', alpha: handsA * 0.9,
      });
    }

    if (codeA > 0.001) {
      chip(ctx, 1120, 520, '4 lines of code', {
        size: 30, color: C.green, border: 'rgba(80,250,123,0.35)',
        bg: 'rgba(49,51,66,0.5)', alpha: codeA,
      });
    }
    if (costA > 0.001) {
      text(ctx, '1.2\u00d7', 1300, 680, {
        size: 72, weight: 500, color: M.word, alpha: costA, ls: -2,
      });
      text(ctx, 'compute per token', 1300, 730, {
        size: 28, weight: 400, color: C.muted, alpha: costA * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 65

const sixtyFive = {
  id: 's65-fair-fight',
  title: 'A fair fight',
  start: start(89),
  end: start(90),
  draw(ctx, t) {
    const base = 0.9;
    const worthA = p(t, q.worth, 0.6);
    const fairA = p(t, q.fair, 0.6);
    const runA = p(t, q.running, 0.6);
    const againA = p(t, q.again, 0.6);
    const lessA = p(t, q.worthLess, 0.6);
    const choiceA = p(t, q.extra, 0.6);
    const passA = p(t, q.pass, 0.6);

    text(ctx, 'is it worth it?', 960, 220, {
      size: 42, weight: 450, color: C.fg, align: 'center', alpha: worthA, ls: -0.5,
    });
    tag(ctx, 960, 268, 'a fair fight', { color: C.dim, alpha: fairA * 0.9, size: 28, align: 'center' });

    // Data running out.
    tag(ctx, 200, 350, 'high-quality text', { color: M.word, alpha: runA * 0.9, size: 30 });
    card(ctx, 200, 390, 680, 30, {
      fill: 'rgba(248,248,242,0.07)', stroke: null, r: 8, alpha: base * runA,
    });
    card(ctx, 200, 390, 680 * (0.28 + 0.12 * p(t, q.again, 1.5)), 30, {
      fill: 'rgba(255,184,108,0.6)', stroke: null, r: 8, alpha: base * runA,
    });
    text(ctx, 'running out', 880, 412, { size: 28, weight: 400, color: C.dim, alpha: runA * 0.9 });

    // Diminishing returns.
    axes(ctx, 220, 500, 640, 300, {
      alpha: base * runA * 0.6, xLabel: 'passes over the data', yLabel: 'value', size: 24,
    });
    if (againA > 0.001) {
      const pts = [[220, 560], [360, 600], [520, 640], [700, 675], [860, 705]];
      strokePath(ctx, pts, {
        color: 'rgba(255,184,108,0.7)', width: 2.6, alpha: againA, rough: 0.3,
      });
      if (lessA > 0.001) {
        tag(ctx, 560, 760, 'each repeat is worth less', {
          color: M.word, alpha: lessA * 0.9, size: 26, align: 'center',
        });
      }
    }

    // Ghost choice cards.
    if (choiceA < 0.99) {
      card(ctx, 1000, 360, 340, 300, {
        fill: 'rgba(49,51,66,0.35)', stroke: 'rgba(189,147,249,0.35)', r: 18,
        dash: [8, 8], alpha: base * 0.5,
      });
      card(ctx, 1380, 360, 340, 300, {
        fill: 'rgba(49,51,66,0.35)', stroke: 'rgba(255,184,108,0.35)', r: 18,
        dash: [8, 8], alpha: base * 0.5,
      });
      text(ctx, 'latent feedback', 1030, 450, {
        size: 30, weight: 500, color: C.dim, alpha: 0.35,
      });
      text(ctx, 'another pass', 1410, 450, {
        size: 30, weight: 500, color: C.dim, alpha: 0.35,
      });
    }
    // The choice.
    if (choiceA > 0.001) {
      card(ctx, 1000, 360, 340, 300, {
        fill: C.surface, stroke: 'rgba(189,147,249,0.35)', r: 18,
        accent: M.thought, accentW: 3, alpha: base * choiceA,
      });
      text(ctx, 'latent feedback', 1030, 450, {
        size: 30, weight: 500, color: C.fg, alpha: choiceA,
      });
      text(ctx, 'one more silent pass', 1030, 500, {
        size: 25, weight: 400, color: C.muted, alpha: choiceA * 0.9,
      });
      card(ctx, 1380, 360, 340, 300, {
        fill: C.surface, stroke: 'rgba(255,184,108,0.35)', r: 18,
        accent: M.word, accentW: 3, alpha: base * (0.25 + 0.75 * passA),
      });
      text(ctx, 'another pass', 1410, 450, {
        size: 30, weight: 500, color: C.fg, alpha: 0.25 + 0.75 * passA,
      });
      text(ctx, 'the same data again', 1410, 500, {
        size: 25, weight: 400, color: C.muted, alpha: (0.25 + 0.75 * passA) * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 66

const sixtySix = {
  id: 's66-wins',
  title: 'It wins the fair fight',
  start: start(90),
  end: 1055.36,
  draw(ctx, t) {
    const base = 0.9;
    const mostlyA = p(t, q.mostly, 0.6);
    const uniqueA = p(t, q.unique, 0.6);
    const fixedA = p(t, q.fixed, 0.6);
    const p48A = p(t, q.p48, 0.6);
    const passesA = p(t, q.passes, 0.6);
    const p47A = p(t, q.p47, 0.6);
    const m60A = p(t, q.m60, 0.6);
    const m778A = p(t, q.m778, 0.6);

    text(ctx, 'mostly yes', 960, 210, {
      size: 44, weight: 450, color: C.fg, align: 'center', alpha: mostlyA, ls: -0.5,
    });
    text(ctx, 'as long as each parameter has seen enough unique text', 960, 262, {
      size: 28, weight: 400, color: C.muted, align: 'center', alpha: uniqueA * 0.9,
    });

    // 48% less compute.
    card(ctx, 160, 320, 780, 280, {
      fill: C.surface, stroke: 'rgba(80,250,123,0.25)', r: 20,
      accent: C.green, accentW: 3, alpha: base * (0.45 + 0.55 * fixedA),
    });
    text(ctx, '48%', 200, 480, {
      size: 100, weight: 500, color: C.green, alpha: p48A, ls: -4,
    });
    text(ctx, 'less compute', 200, 530, {
      size: 36, weight: 400, color: C.fg, alpha: p48A,
    });
    text(ctx, 'with the data fixed', 200, 570, {
      size: 26, weight: 400, color: C.muted, alpha: p48A * 0.9,
    });

    // 47% less data.
    card(ctx, 1020, 320, 780, 280, {
      fill: C.surface, stroke: 'rgba(189,147,249,0.25)', r: 20,
      accent: M.thought, accentW: 3, alpha: base * (0.45 + 0.55 * passesA),
    });
    text(ctx, '47%', 1060, 480, {
      size: 100, weight: 500, color: M.thought, alpha: p47A, ls: -4,
    });
    text(ctx, 'less unique data', 1060, 530, {
      size: 36, weight: 400, color: C.fg, alpha: p47A,
    });
    text(ctx, 'with the passes fixed', 1060, 570, {
      size: 26, weight: 400, color: C.muted, alpha: p47A * 0.9,
    });

    // Model sizes.
    if (m60A > 0.001) {
      text(ctx, '60M', 300, 760, {
        size: 54, weight: 500, color: C.muted, alpha: m60A, ls: -1,
      });
      text(ctx, '\u2192', 470, 758, { size: 44, weight: 400, color: C.dim, alpha: m60A * 0.7 });
      text(ctx, '778M', 620, 760, {
        size: 54, weight: 500, color: C.fg, alpha: m778A, ls: -1,
      });
      tag(ctx, 300, 820, 'models tested for the scaling law', {
        color: C.dim, alpha: m778A * 0.9, size: 26,
      });
    }
  },
};

// ---------------------------------------------------------------- 67

const sixtySeven = {
  id: 's67-scaling',
  title: 'One scaling law, same serving',
  start: 1055.36,
  end: start(91),
  draw(ctx, t) {
    const base = 0.9;
    const m271A = p(t, q.m271, 0.6);
    const p03A = p(t, q.p03, 0.6);
    const servingA = p(t, q.serving, 0.6);

    text(ctx, 'does it scale?', 340, 220, {
      size: 38, weight: 450, color: C.fg, alpha: m271A, ls: -0.4,
    });

    axes(ctx, 300, 320, 760, 440, {
      alpha: base * 0.65, xLabel: 'model size', yLabel: 'loss', size: 24,
    });

    // A schematic scaling line with the two measured points.
    const pts = [[360, 680], [560, 600], [760, 520], [1000, 430]];
    strokePath(ctx, pts, {
      color: 'rgba(139,233,253,0.75)', width: 2.8, alpha: m271A, rough: 0.2,
    });
    ctx.save();
    ctx.globalAlpha = m271A;
    ctx.fillStyle = M.gate;
    ctx.beginPath();
    ctx.arc(690, 552, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = C.green;
    ctx.beginPath();
    ctx.arc(940, 465, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    tag(ctx, 615, 590, 'fit on 271M', { color: M.gate, alpha: m271A * 0.9, size: 25, align: 'right' });
    tag(ctx, 960, 425, '778M', { color: C.green, alpha: p03A * 0.9, size: 26 });

    if (p03A > 0.001) {
      text(ctx, 'predicted within 0.3%', 680, 840, {
        size: 32, weight: 500, color: C.green, align: 'center', alpha: p03A,
      });
      text(ctx, 'one scaling law', 680, 888, {
        size: 26, weight: 400, color: C.muted, align: 'center', alpha: p03A * 0.9,
      });
    }

    // Ghost serving card.
    if (servingA < 0.99) {
      card(ctx, 1200, 350, 560, 360, {
        fill: 'rgba(49,51,66,0.32)', stroke: 'rgba(248,248,242,0.25)', r: 20,
        dash: [8, 8], alpha: base * 0.45,
      });
      tag(ctx, 1240, 410, 'at serving time', { color: C.dim, alpha: 0.4, size: 28 });
    }
    // Same serving.
    if (servingA > 0.001) {
      card(ctx, 1200, 350, 560, 360, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20, alpha: base * servingA * 0.9,
      });
      tag(ctx, 1240, 410, 'at serving time', { color: C.muted, alpha: servingA * 0.9, size: 28 });
      text(ctx, 'same parameter count', 1240, 500, {
        size: 30, weight: 400, color: C.fg, alpha: servingA,
      });
      text(ctx, 'same memory cache', 1240, 560, {
        size: 30, weight: 400, color: C.fg, alpha: servingA,
      });
      text(ctx, 'no extra cost at inference', 1240, 640, {
        size: 28, weight: 400, color: C.green, alpha: servingA * 0.95,
      });
    }
  },
};

// ---------------------------------------------------------------- 68

const sixtyEight = {
  id: 's68-catch',
  title: 'The catch',
  start: start(91),
  end: start(92),
  draw(ctx, t) {
    const base = 0.9;
    const catchA = p(t, q.catch, 0.6);
    const scarceA = p(t, q.scarce, 0.6);
    const t125A = p(t, q.t125, 0.6);
    const twoA = p(t, q.twoPasses, 0.5);
    const p8A = p(t, q.p8, 0.6);
    const smallA = p(t, q.small, 0.6);
    const dieA = p(t, q.die, 0.6);

    text(ctx, 'there is a catch', 960, 210, {
      size: 42, weight: 450, color: C.fg, align: 'center', alpha: catchA, ls: -0.5,
    });

    const x0 = 300;
    const x1 = 1500;
    const y = 520;
    const scale = (v) => x0 + (v / 20) * (x1 - x0);
    card(ctx, x0, y - 12, x1 - x0, 24, {
      fill: 'rgba(248,248,242,0.06)', stroke: null, r: 12, alpha: base * 0.8,
    });
    card(ctx, x0, y - 12, scale(12.5) - x0, 24, {
      fill: 'rgba(80,250,123,0.4)', stroke: null, r: 12, alpha: base * 0.85,
    });
    card(ctx, scale(12.5), y - 12, x1 - scale(12.5), 24, {
      fill: 'rgba(255,85,85,0.3)', stroke: null, r: 12, alpha: base * 0.85,
    });
    text(ctx, 'data-rich', 420, 580, {
      size: 28, weight: 400, color: C.green, alpha: scarceA * 0.9,
    });
    text(ctx, 'data-scarce', 1420, 580, {
      size: 28, weight: 400, color: M.bug, align: 'right', alpha: scarceA * 0.9,
    });
    text(ctx, 'unique tokens per parameter', 960, 660, {
      size: 28, weight: 400, color: C.dim, align: 'center', alpha: scarceA * 0.9,
    });

    if (t125A > 0.001) {
      line(ctx, scale(12.5), 470, scale(12.5), 570, {
        color: M.bug, width: 3, alpha: t125A, rough: 0,
      });
      text(ctx, '12.5', scale(12.5), 450, {
        size: 38, weight: 500, color: M.bug, align: 'center', alpha: t125A,
      });
      tag(ctx, scale(12.5) - 18, 610, 'the flip', {
        color: M.bug, alpha: t125A * 0.9, size: 26, align: 'right',
      });
    }

    if (twoA > 0.001) {
      text(ctx, 'at 12.5 tokens per parameter and two passes', 960, 730, {
        size: 30, weight: 400, color: C.muted, align: 'center', alpha: twoA * 0.9,
      });
    }
    if (p8A > 0.001) {
      text(ctx, '+8%', 1220, 800, {
        size: 54, weight: 500, color: M.bug, alpha: p8A, ls: -2,
      });
      text(ctx, 'compute for latent feedback', 1220, 850, {
        size: 26, weight: 400, color: C.muted, alpha: p8A * 0.9,
      });
    }
    if (smallA > 0.001) {
      tag(ctx, 300, 790, 'these are small models', {
        color: C.dim, alpha: smallA * 0.9, size: 28,
      });
    }
    if (dieA > 0.001) {
      text(ctx, 'plenty of ideas die at scale', 960, 940, {
        size: 46, weight: 500, color: M.bug, align: 'center', alpha: dieA, ls: -0.6,
      });
    }
  },
};

// ---------------------------------------------------------------- 69

const sixtyNine = {
  id: 's69-same-story',
  title: 'The same story',
  start: start(92),
  end: start(93),
  draw(ctx, t) {
    const base = 0.9;
    const sameA = p(t, q.sameStory, 0.6);
    const richA = p(t, q.rich, 0.6);
    const throwA = p(t, q.throws, 0.7);

    tag(ctx, 180, 220, 'the same story', { color: C.muted, alpha: sameA * 0.95, size: 30 });

    if (richA < 0.99) {
      thoughtRow(ctx, 300, 420, 760, 70, {
        cells: 24, color: C.dim, alpha: 0.16, progress: 0.8,
      });
    }
    thoughtRow(ctx, 300, 420, 760, 70, {
      cells: 24, color: M.thought, alpha: richA * 0.95, progress: p(t, q.rich, 0.8),
    });
    tag(ctx, 300, 380, 'a rich thought', { color: M.thought, alpha: richA * 0.9, size: 28 });

    if (throwA < 0.99) {
      card(ctx, 1270, 400, 130, 110, {
        fill: 'rgba(49,51,66,0.18)', stroke: 'rgba(255,85,85,0.25)', r: 10,
        dash: [7, 7], alpha: base * 0.18,
      });
    }
    if (throwA > 0.001) {
      arrow(ctx, 1080, 455, 1250, 455, {
        color: 'rgba(255,85,85,0.55)', width: 2.6, progress: throwA, head: 12,
      });
      card(ctx, 1270, 400, 130, 110, {
        fill: C.well, stroke: 'rgba(255,85,85,0.4)', r: 10, dash: [7, 7], alpha: throwA,
      });
      for (let i = 0; i < 3; i++) {
        line(ctx, 1290, 430 + i * 24, 1350 + (i % 2) * 24, 430 + i * 24, {
          color: M.bug, width: 2, alpha: throwA * 0.6, rough: 0,
        });
      }
      text(ctx, 'the usual setup', 1335, 555, {
        size: 26, weight: 400, color: C.muted, align: 'center', alpha: throwA * 0.9,
      });
      text(ctx, 'throws it away', 960, 720, {
        size: 48, weight: 500, color: C.fg, align: 'center', alpha: throwA, ls: -0.6,
      });
    }
  },
};

// ---------------------------------------------------------------- 70

const seventy = {
  id: 's70-dial',
  title: 'A dial',
  start: start(93),
  end: start(95),
  draw(ctx, t) {
    const base = 0.9;
    const dialA = p(t, q.aDial, 0.7);
    const qA = p(t, q.howMuch, 0.6);

    text(ctx, 'a dial', 960, 300, {
      size: 76, weight: 500, color: C.fg, align: 'center', alpha: dialA, ls: -2,
    });
    if (dialA > 0.3) {
      const x = 360;
      const w = 1200;
      card(ctx, x, 520, w, 14, {
        fill: 'rgba(248,248,242,0.08)', stroke: null, r: 7, alpha: dialA * 0.9,
      });
      for (let i = 0; i <= 8; i++) {
        line(ctx, x + (w / 8) * i, 500, x + (w / 8) * i, 548, {
          color: i === 0 || i === 4 || i === 8 ? 'rgba(248,248,242,0.4)' : 'rgba(248,248,242,0.14)',
          width: i === 0 || i === 4 || i === 8 ? 2 : 1.2, rough: 0, alpha: dialA * 0.9,
        });
      }
      card(ctx, x + w / 2 - 18, 478, 36, 100, {
        fill: C.fg, stroke: null, r: 4, alpha: dialA,
      });
    }
    if (qA > 0.001) {
      text(ctx, 'how much of its thinking does it have to say out loud?', 960, 820, {
        size: 38, weight: 450, color: C.muted, align: 'center', alpha: qA * 0.95, ls: -0.4,
      });
    }
  },
};

// ---------------------------------------------------------------- 71

const seventyOne = {
  id: 's71-three-positions',
  title: 'Say everything, or nothing',
  start: start(95),
  end: start(96),
  draw(ctx, t) {
    const base = 0.9;
    const leftA = p(t, q.left, 0.6);
    const rightA = p(t, q.right, 0.6);
    const hybridA = p(t, q.hybrid, 0.6);
    const cotA = p(t, q.cot, 0.5);
    const decA = p(t, q.decision, 0.5);
    const sayA = p(t, q.sayMatters, 0.5);

    const x = 300;
    const w = 1320;
    const y = 520;
    card(ctx, x, y - 10, w, 20, {
      fill: 'rgba(248,248,242,0.07)', stroke: null, r: 10, alpha: base * 0.9,
    });
    card(ctx, x, y - 10, w * 0.5, 20, {
      fill: 'rgba(255,184,108,0.18)', stroke: null, r: 10, alpha: base * 0.8,
    });
    card(ctx, x + w * 0.5, y - 10, w * 0.5, 20, {
      fill: 'rgba(139,233,253,0.14)', stroke: null, r: 10, alpha: base * 0.8,
    });

    // Position labels.
    tag(ctx, x, y - 70, 'say everything', { color: M.word, alpha: leftA * 0.95, size: 30 });
    tag(ctx, x + w / 2, y - 70, 'say what matters', { color: M.thought, alpha: hybridA * 0.95, size: 30, align: 'center' });
    tag(ctx, x + w, y - 70, 'say nothing', { color: M.gate, alpha: rightA * 0.95, size: 30, align: 'right' });

    // Slider: center -> left -> right -> center, following the narration.
    let pos = 0.5;
    pos = lerp(0.5, 0.0, p(t, q.left, 0.7));
    pos = lerp(pos, 1.0, p(t, q.right, 0.7));
    pos = lerp(pos, 0.5, p(t, q.hybrid, 0.7));
    const hx = x + w * pos;
    card(ctx, hx - 16, y - 56, 32, 112, {
      fill: C.fg, stroke: null, r: 4, alpha: base * 0.95,
    });

    if (cotA > 0.001) {
      text(ctx, 'chain of thought', 380, 700, {
        size: 34, weight: 500, color: M.word, alpha: cotA,
      });
      text(ctx, 'every thought, written', 380, 750, {
        size: 26, weight: 400, color: C.muted, alpha: cotA * 0.9,
      });
    }
    if (decA > 0.001) {
      text(ctx, 'decision model', 1620, 700, {
        size: 34, weight: 500, color: M.gate, align: 'right', alpha: decA,
      });
      text(ctx, 'reads once, hands back chances', 1620, 750, {
        size: 26, weight: 400, color: C.muted, align: 'right', alpha: decA * 0.9,
      });
    }
    if (hybridA > 0.001) {
      text(ctx, 'hybrid agents', 960, 700, {
        size: 34, weight: 500, color: M.thought, align: 'center', alpha: hybridA,
      });
      text(ctx, 'say what matters', 960, 750, {
        size: 26, weight: 400, color: C.muted, align: 'center', alpha: sayA * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 72

const seventyTwo = {
  id: 's72-gate-recap',
  title: 'The gate, one last time',
  start: start(96),
  end: start(97),
  draw(ctx, t) {
    const base = 0.9;
    const gateA = p(t, q.recapGate, 0.6);
    const leakA = p(t, q.recapLeak, 0.7);
    const confA = p(t, q.confident, 0.6);
    const pushA = p(t, q.push, 0.7);

    gate(ctx, 960, 500, 300, 470, {
      alpha: base * 0.95, open: 0.9, accent: M.gate, crack: leakA,
    });
    text(ctx, 'softmax', 960, 820, {
      size: 56, weight: 500, color: C.fg, align: 'center', alpha: gateA,
    });
    const sw = measure(ctx, 'softmax', 56, 500, F.display, 0.2);
    underline(ctx, 960 - sw / 2, 840, sw, { color: M.gate, width: 3, alpha: gateA * 0.85 });

    thoughtRow(ctx, 220, 440, 500, 64, {
      cells: 22, color: M.thought, alpha: gateA * 0.9, progress: p(t, q.recapGate + 0.2, 0.7),
    });
    tag(ctx, 220, 390, 'a thought', { color: M.thought, alpha: gateA * 0.9, size: 28 });
    wordPill(ctx, 1140, 440, 'cat', { size: 40, alpha: p(t, q.recapGate + 0.4, 0.5) });

    if (leakA > 0.001) {
      leak(ctx, 1120, 742, { progress: leakA, alpha: 0.9 });
      tag(ctx, 220, 640, 'the gate leaks', { color: M.bug, alpha: leakA * 0.95, size: 38 });
    }
    if (confA > 0.001) {
      tag(ctx, 1700, 640, 'at peak confidence', {
        color: M.bug, alpha: confA * 0.9, size: 30, align: 'right',
      });
    }
    if (pushA > 0.001) {
      thoughtRow(ctx, 220, 520, 500, 38, {
        cells: 22, color: M.thought, alpha: pushA * 0.55, progress: pushA,
      });
      tag(ctx, 720, 550, 'too much', { color: C.muted, alpha: pushA * 0.9, size: 28, align: 'right' });
    }
  },
};

// ---------------------------------------------------------------- 73

const seventyThree = {
  id: 's73-guess',
  title: 'A guess, not a result',
  start: start(97),
  end: start(98),
  draw(ctx, t) {
    const base = 0.9;
    const guessA = p(t, q.guess, 0.6);
    const softA = p(t, q.softLabels, 0.6);
    const distillA = p(t, q.distill, 0.6);
    const bugA = p(t, q.secondBug, 0.6);
    const nobodyA = p(t, q.nobody, 0.6);
    const afterA = p(t, q.afternoon, 0.6);

    tag(ctx, 960, 210, 'a guess, not a result', {
      color: M.logits, alpha: guessA * 0.95, size: 34, align: 'center',
    });

    // Teacher -> student -> decision model.
    card(ctx, 220, 330, 360, 240, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 18, alpha: base * 0.9,
    });
    text(ctx, 'teacher', 260, 410, { size: 36, weight: 500, color: C.fg, alpha: base });
    thoughtRow(ctx, 260, 460, 280, 44, { cells: 10, color: M.gate, alpha: softA * 0.85, progress: softA });

    card(ctx, 700, 360, 320, 200, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 18, alpha: base * (0.2 + 0.8 * distillA),
    });
    text(ctx, 'student', 740, 430, { size: 34, weight: 500, color: C.fg, alpha: 0.2 + 0.8 * distillA });
    thoughtRow(ctx, 740, 470, 240, 40, { cells: 8, color: M.gate, alpha: distillA * 0.8, progress: distillA });

    card(ctx, 1260, 330, 380, 240, {
      fill: C.surface, stroke: 'rgba(139,233,253,0.25)', r: 18,
      accent: M.gate, accentW: 3, alpha: base * (0.2 + 0.8 * softA),
    });
    text(ctx, 'decision model', 1300, 410, {
      size: 32, weight: 500, color: C.fg, alpha: 0.2 + 0.8 * softA,
    });
    text(ctx, 'trained on soft labels', 1300, 460, {
      size: 25, weight: 400, color: C.muted, alpha: softA * 0.9,
    });

    arrow(ctx, 588, 450, 690, 450, {
      color: 'rgba(248,248,242,0.3)', width: 1.8, progress: distillA, head: 8,
    });
    arrow(ctx, 1030, 450, 1250, 450, {
      color: 'rgba(248,248,242,0.3)', width: 1.8, progress: softA, head: 8,
    });
    if (distillA > 0.001) {
      tag(ctx, 640, 400, 'distillation', { color: M.word, alpha: distillA * 0.9, size: 26, align: 'center' });
    }

    if (bugA > 0.001) {
      text(ctx, 'the second bug lives here', 960, 660, {
        size: 38, weight: 500, color: M.bug, align: 'center', alpha: bugA,
      });
    }
    if (nobodyA > 0.001) {
      text(ctx, 'as far as I can tell, nobody has tested this', 960, 720, {
        size: 30, weight: 400, color: C.muted, align: 'center', alpha: nobodyA * 0.95,
      });
    }
    if (afterA > 0.001) {
      text(ctx, 'worth an afternoon', 960, 800, {
        size: 42, weight: 500, color: M.word, align: 'center', alpha: afterA,
      });
    }
  },
};

// ---------------------------------------------------------------- 74

const seventyFour = {
  id: 's74-monday',
  title: 'What to do on Monday',
  start: start(98),
  end: start(102),
  draw(ctx, t) {
    const base = 0.9;
    const monA = p(t, q.monday, 0.6);
    const r1 = p(t, q.one, 0.5);
    const gradA = p(t, q.gradTest, 0.5);
    const precA = p(t, q.precision, 0.5);
    const r2 = p(t, q.two, 0.5);
    const idA = p(t, q.identical, 0.5);
    const r3 = p(t, q.three, 0.5);
    const codeA = p(t, q.readCode, 0.5);
    const serveA = p(t, q.serving2, 0.5);

    text(ctx, 'what do you do on Monday?', 960, 220, {
      size: 42, weight: 450, color: C.fg, align: 'center', alpha: monA, ls: -0.5,
    });

    const rows = [
      {
        y: 340, n: '1', a: r1, title: 'run the gradient test',
        sub: 'the gradients should sum to zero', cue: gradA, cue2: precA,
        detail: 'in the precision you actually train',
        color: M.gate,
      },
      {
        y: 520, n: '2', a: r2, title: 'if you distill, match the scores',
        sub: 'identical student and teacher → zero gradient', cue: idA, cue2: idA,
        detail: 'the residual should be exactly zero',
        color: M.thought,
      },
      {
        y: 700, n: '3', a: r3, title: 'if you build agents, read the code',
        sub: 'don\'t expect your serving stack to run it yet', cue: codeA, cue2: serveA,
        detail: 'the HybridAgent code is public',
        color: M.word,
      },
    ];
    rows.forEach((r) => {
      const e = 0.2 + 0.8 * r.a;
      card(ctx, 170, r.y, 1580, 140, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.13)', r: 16,
        alpha: base * e * 0.85,
      });
      numberedChip(ctx, 220, r.y + 70, Number(r.n), { color: r.color, size: 48 });
      text(ctx, r.title, 280, r.y + 56, {
        size: 34, weight: 500, color: C.fg, alpha: base * e,
      });
      text(ctx, r.sub, 280, r.y + 102, {
        size: 28, weight: 400, color: C.muted, alpha: base * e * 0.95,
      });
      text(ctx, r.detail, 1700, r.y + 56, {
        size: 27, weight: 400, color: C.dim, align: 'right', alpha: base * e * 0.85,
      });
      if (r.n === '1') {
        chip(ctx, 1480, r.y + 100, 'sum = 0', {
          size: 26, color: C.green, border: 'rgba(80,250,123,0.3)',
          bg: 'rgba(49,51,66,0.5)', alpha: precA * 0.9, align: 'right',
        });
      }
    });
  },
};

// ---------------------------------------------------------------- 75

const seventyFive = {
  id: 's75-thesis',
  title: 'The thinking we throw away',
  start: start(102),
  end: start(103),
  draw(ctx, t) {
    const workA = p(t, q.work, 0.7);
    const throwA = p(t, q.throwAway, 0.7);

    text(ctx, 'so much of this work is about thinking better', 960, 400, {
      size: 40, weight: 450, color: C.muted, align: 'center',
      alpha: workA * (1 - 0.35 * throwA) * 0.95, ls: -0.4,
    });
    if (throwA < 0.99) {
      text(ctx, 'the thinking we throw away', 960, 620, {
        size: 64, weight: 500, color: C.dim, align: 'center', alpha: 0.12, ls: -1.2,
      });
    }
    if (throwA > 0.001) {
      text(ctx, 'these papers are about', 960, 520, {
        size: 38, weight: 400, color: C.muted, align: 'center', alpha: throwA * 0.95,
      });
      text(ctx, 'the thinking we throw away', 960, 620, {
        size: 64, weight: 500, color: C.fg, align: 'center', alpha: throwA, ls: -1.2,
      });
      underline(ctx, 430, 650, 1060, {
        color: M.bug, width: 3, alpha: throwA * 0.55, progress: p(t, q.throwAway + 0.4, 0.5),
      });
    }
  },
};

// ---------------------------------------------------------------- 76

const seventySix = {
  id: 's76-one-more',
  title: 'One more thing',
  start: start(103),
  end: 1180.58,
  draw(ctx, t) {
    const base = 0.9;
    const oneA = p(t, q.oneMore, 0.6);
    const tinyA = p(t, q.tiny, 0.6);
    const commonA = p(t, q.common, 0.6);
    const maybeA = p(t, q.maybe, 0.6);

    tag(ctx, 180, 220, 'one more thing', { color: C.muted, alpha: oneA * 0.95, size: 30 });

    card(ctx, 220, 330, 560, 280, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 18, alpha: base * (0.3 + 0.7 * tinyA),
    });
    text(ctx, 'one tiny example', 260, 420, {
      size: 34, weight: 500, color: C.fg, alpha: tinyA,
    });
    text(ctx, '3e-8', 260, 510, {
      size: 72, weight: 500, color: M.bug, family: MONO, alpha: tinyA,
    });
    text(ctx, 'a single loss · one precision', 260, 570, {
      size: 26, weight: 400, color: C.muted, alpha: tinyA * 0.9,
    });

    if (commonA < 0.99) {
      text(ctx, '?', 1180, 480, {
        size: 150, weight: 500, color: C.dim, align: 'center', alpha: 0.12,
      });
    }
    if (commonA < 0.99) {
      text(ctx, '?', 1180, 480, {
        size: 150, weight: 500, color: C.dim, align: 'center', alpha: 0.12,
      });
    }
    if (commonA > 0.001) {
      text(ctx, '?', 1180, 480, {
        size: 150, weight: 500, color: M.logits, align: 'center', alpha: commonA * 0.9,
      });
      text(ctx, 'how common is this bug?', 1250, 600, {
        size: 40, weight: 500, color: C.fg, alpha: commonA,
      });
    }
    if (maybeA > 0.001) {
      text(ctx, 'maybe your runs are clean', 960, 800, {
        size: 34, weight: 400, color: C.muted, align: 'center', alpha: maybeA * 0.9,
      });
      text(ctx, 'maybe they\u2019re not', 960, 850, {
        size: 34, weight: 400, color: M.bug, align: 'center', alpha: maybeA * 0.95,
      });
    }
  },
};

// ---------------------------------------------------------------- 77

const seventySeven = {
  id: 's77-cta',
  title: 'Post your number',
  start: 1180.58,
  end: start(106),
  draw(ctx, t) {
    const base = 0.9;
    const runA = p(t, q.runTest, 0.6);
    const postA = p(t, q.post, 0.6);
    const comA = p(t, q.comments, 0.5);

    text(ctx, 'run the five-line test', 960, 300, {
      size: 52, weight: 500, color: C.fg, align: 'center',
      alpha: 0.22 + 0.78 * runA, ls: -0.8,
    });
    text(ctx, 'on your own loss, in the precision you train in', 960, 360, {
      size: 30, weight: 400, color: C.muted, align: 'center', alpha: 0.22 + 0.78 * runA * 0.95,
    });
    if (runA < 0.99) {
      card(ctx, 760, 430, 400, 90, {
        fill: 'rgba(49,51,66,0.18)', stroke: 'rgba(139,233,253,0.25)', r: 14,
        dash: [7, 7], alpha: base * 0.2,
      });
      mono(ctx, 'print(g.sum())', 800, 486, {
        size: 28, color: C.dim, alpha: 0.2,
      });
    }

    if (postA > 0.001) {
      text(ctx, 'post your number', 960, 620, {
        size: 64, weight: 500, color: M.word, align: 'center', alpha: postA, ls: -1.5,
      });
      text(ctx, 'in the comments', 960, 690, {
        size: 34, weight: 400, color: C.muted, align: 'center', alpha: comA * 0.95,
      });
      text(ctx, 'I want to know how common this bug is', 960, 780, {
        size: 30, weight: 400, color: C.dim, align: 'center', alpha: comA * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 78

const seventyEight = {
  id: 's78-still-finding',
  title: 'Still finding',
  start: start(106),
  end: 1194.88,
  draw(ctx, t) {
    const base = 0.9;
    const firstA = p(t, q.final1, 0.6);
    const secondA = p(t, q.final2, 0.7);

    gate(ctx, 960, 430, 300, 470, {
      alpha: base * 0.9, open: 0.9, accent: M.gate, crack: 0.55,
    });
    text(ctx, 'softmax', 960, 748, {
      size: 54, weight: 500, color: C.fg, align: 'center', alpha: firstA,
    });
    const sw = measure(ctx, 'softmax', 54, 500, F.display, 0.2);
    underline(ctx, 960 - sw / 2, 768, sw, { color: M.gate, width: 3, alpha: firstA * 0.85 });

    text(ctx, 'softmax has been in every model for years', 960, 880, {
      size: 34, weight: 400, color: C.muted, align: 'center', alpha: firstA * 0.95,
    });
    if (secondA > 0.001) {
      text(ctx, 'we\u2019re still finding things wrong with it', 960, 950, {
        size: 44, weight: 500, color: C.fg, align: 'center', alpha: secondA, ls: -0.6,
      });
    }
  },
};

export default [
  sixtyTwo, sixtyThree, sixtyFour, sixtyFive, sixtySix, sixtySeven, sixtyEight,
  sixtyNine, seventy, seventyOne, seventyTwo, seventyThree, seventyFour,
  seventyFive, seventySix, seventySeven, seventyEight,
];
