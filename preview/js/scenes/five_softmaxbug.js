import {
  C, F, W, H, clamp, lerp, p, enter, easeInOut, easeOutCubic, card, text, line,
  arrow, strokePath, underline, measure, bracket, rr, count,
} from '../kit.js';
import {
  M, tag, chip, statement, gate, leak, flow, pathFlow, thoughtRow, wordPill,
  relativeBar, axes, lossCurve, stat, deskRobot, MONO,
} from '../motifs.js';
import { at, start } from '../data/timeline.js';

const q = {
  story: at('story', 28),
  trains: at('trains a tiny model', 29),
  addition: at('to do addition', 29),
  famous: at('famous test', 29),
  memorizes: at('memorizes', 29),
  stuck: at('stuck', 29),
  nowhere: at('out of nowhere', 29),
  pattern: at('real pattern', 29),
  jump: at('jump has a name', 29),
  grokking: at('grokking', 29),

  strange: at('something strange', 30),
  shoots: at('loss shoots up', 30),
  spikes: at('sudden spikes', 30),
  slingshots: at('slingshots', 30),
  never: at('never grok', 30),
  clean: at('clean explanation', 31),
  blames: at('blames one line', 31),
  twoIdeas: at('two small ideas', 32),

  ideaOne: at('idea one', 33),
  overflow: at('overflow problem', 33),
  raiseE: at('raise e', 33),
  like89: at('like 89', 33),
  bits32: at('32-bit', 33),
  infinity: at('infinity', 33),
  everyLibrary: at('every library', 33),
  subtract: at('subtracts the biggest', 33),
  zeroScore: at('biggest score is zero', 33),
  eZero: at('e to the zero', 33),
  maxShift: at('max-shift trick', 33),

  afterShift: at('after the shift', 34),
  bottom: at('bottom line', 34),
  onePlus: at('one, plus', 34),
  eachTiny: at('each tiny number', 34),
  eMinus: at('e to the minus', 34),
  lead: at('lead', 34),
  bigger: at('bigger lead', 34),
  tinier: at('tinier number', 34),

  ideaTwo: at('idea two', 35),
  everyDigit: at('keep every digit', 35),
  calculator: at('picture a calculator', 35),
  seven: at('seven digits', 35),
  billion: at('one billion', 35),
  addCent: at('add one cent', 35),
  still: at('still one billion', 35),
  vanished: at('cent vanished', 35),

  realComputers: at('real computers', 36),
  nearOne: at('near the number one', 36),
  tiny38: at('ten to the minus', 36),
  noProblem: at('no problem', 36),
  onePlusFour: at('one plus four', 36),
  rounds: at('rounds to exactly one', 36),
  swallowed: at('gets swallowed', 36),
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
  lossZero2: at('loss is zero', 41),
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

// ---------------------------------------------------------------- 20

const twenty = {
  id: 's20-grokking',
  title: 'Grokking',
  start: start(28),
  end: start(30),
  draw(ctx, t) {
    const base = 0.85;
    const modelA = p(t, q.trains, 0.6);
    const curveA = p(t, q.memorizes, 2.2);
    const second = p(t, q.nowhere, 2.2);
    const stuckA = p(t, q.stuck, 0.6);
    const grokA = p(t, q.grokking, 0.6);

    // Ghost axes.
    axes(ctx, 330, 420, 1180, 360, {
      alpha: base * 0.8, xLabel: 'training', yLabel: 'loss', size: 36,
    });

    // Tiny addition model.
    card(ctx, 190, 220, 380, 150, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.15)', r: 18, alpha: (0.2 + 0.8 * modelA) * 0.9,
    });
    deskRobot(ctx, 200, 232, 0.95, {
      alpha: 0.2 + 0.8 * modelA,
      accent: M.logits,
    });
    text(ctx, 'a tiny model', 342, 274, {
      size: 32, weight: 400, color: C.muted, alpha: 0.2 + 0.8 * modelA,
    });
    text(ctx, 'A + B', 342, 344, {
      size: 58, weight: 500, color: C.fg, alpha: 0.2 + 0.8 * modelA, ls: -1,
    });
    tag(ctx, 590, 260, 'a famous test', {
      color: C.dim, alpha: p(t, q.famous, 0.6) * 0.9, size: 36,
    });

    // Two-phase loss curve: memorize, plateau, then the drop.
    ctx.save();
    if (curveA > 0.001) {
      lossCurve(ctx, 330, 420, 1180, 360, {
        kind: 'grok', color: M.gate, width: 3.4, alpha: 0.95,
        progress: Math.min(0.62, curveA * 0.62),
      });
    }
    if (second > 0.001) {
      lossCurve(ctx, 330, 420, 1180, 360, {
        kind: 'grok', color: M.correct, width: 3.4, alpha: 0.95,
        progress: Math.max(0.62, Math.min(1, 0.62 + second * 0.38)),
      });
    }
    ctx.restore();

    if (stuckA > 0.001) {
      bracket(ctx, 610, 1090, 760, {
        color: M.logits, width: 2, alpha: stuckA * 0.8, tick: 12, progress: stuckA,
      });
      text(ctx, 'stuck', 850, 800, {
        size: 34, weight: 500, color: M.logits, align: 'center', alpha: stuckA,
      });
    }

    text(ctx, 'schematic', 1510, 800, { size: 30, color: C.dim, align: 'right', alpha: base * 0.7 });

    if (grokA > 0.001) {
      text(ctx, 'grokking', 1500, 900, {
        size: 72, weight: 500, color: M.correct, align: 'right', alpha: grokA, ls: -2,
      });
      text(ctx, 'the jump', 1500, 842, {
        size: 30, weight: 400, color: C.muted, align: 'right', alpha: grokA * 0.9,
      });
      arrow(ctx, 1370, 820, 1260, 760, {
        color: 'rgba(80,250,123,0.55)', width: 2, progress: grokA, head: 10,
      });
    }
  },
};

// ---------------------------------------------------------------- 21

const twentyOne = {
  id: 's21-slingshot',
  title: 'Slingshots',
  start: start(30),
  end: start(33),
  draw(ctx, t) {
    const base = 0.85;
    const curveA = p(t, q.shoots, 2.0);
    const neverA = p(t, q.never, 1.0);
    const cleanA = p(t, q.clean, 0.6);
    const blameA = p(t, q.blames, 0.6);
    const ideasA = p(t, q.twoIdeas, 0.6);

    axes(ctx, 300, 300, 1150, 440, {
      alpha: base * 0.8, xLabel: 'training', yLabel: 'loss', size: 36,
    });

    if (curveA < 0.98) {
      lossCurve(ctx, 300, 300, 1150, 440, {
        kind: 'sling', color: 'rgba(248,248,242,0.5)', width: 2.6, alpha: 0.35,
        progress: 1,
      });
    }
    lossCurve(ctx, 300, 300, 1150, 440, {
      kind: 'sling', color: M.gate, width: 3.2, alpha: 0.95, progress: curveA,
      markers: [[0.335, 0.67], [0.5, 0.78], [0.645, 0.58]],
    });
    if (neverA > 0.001) {
      lossCurve(ctx, 300, 300, 1150, 440, {
        kind: 'never', color: 'rgba(255,85,85,0.7)', width: 2.2, alpha: 0.8,
        progress: neverA, ghost: null,
      });
      tag(ctx, 1430, 690, 'never groks', {
        color: M.bug, alpha: neverA * 0.95, size: 30, align: 'right',
      });
    }
    if (p(t, q.slingshots, 0.6) > 0.001) {
      tag(ctx, 1430, 380, 'slingshots', {
        color: M.bug, alpha: p(t, q.slingshots, 0.6) * 0.95, size: 32, align: 'right',
      });
    }

    if (cleanA > 0.001) {
      text(ctx, 'no clean explanation', 960, 820, {
        size: 38, weight: 450, color: C.muted, align: 'center',
        alpha: cleanA * 0.95,
      });
    }
    if (blameA > 0.001) {
      text(ctx, 'one line of arithmetic', 960, 880, {
        size: 34, weight: 400, color: C.dim, align: 'center', alpha: blameA * 0.9,
      });
      text(ctx, 'inside softmax', 1450, 880, {
        size: 42, weight: 500, color: M.bug, align: 'right', alpha: blameA,
      });
    }
    if (ideasA > 0.001) {
      chip(ctx, 300, 930, '1 · overflow', {
        size: 30, color: M.logits, border: 'rgba(241,250,140,0.4)',
        bg: 'rgba(49,51,66,0.5)', alpha: ideasA,
      });
      chip(ctx, 620, 930, '2 · rounding', {
        size: 30, color: M.thought, border: 'rgba(189,147,249,0.4)',
        bg: 'rgba(49,51,66,0.5)', alpha: p(t, q.twoIdeas + 0.35, 0.5),
      });
    }
  },
};

// ---------------------------------------------------------------- 22

const twentyTwo = {
  id: 's22-overflow',
  title: 'Overflow',
  start: start(33),
  end: start(34),
  draw(ctx, t) {
    const base = p(t, q.ideaOne - 0.2, 0.7);
    const leftA = p(t, q.overflow, 0.6);
    const e89A = p(t, q.raiseE, 0.6);
    const infA = p(t, q.infinity, 0.6);
    const shiftA = p(t, q.subtract, 0.7);
    const zeroA = p(t, q.zeroScore, 0.6);
    const oneA = p(t, q.eZero, 0.6);
    const nameA = p(t, q.maxShift, 0.6);

    text(ctx, 'idea one', 200, 200, {
      size: 30, weight: 400, color: C.dim, alpha: p(t, q.ideaOne, 0.5),
    });

    // Left panel.
    card(ctx, 170, 260, 730, 500, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 22, alpha: base * 0.9,
    });
    tag(ctx, 214, 320, 'a big score', { color: M.logits, alpha: leftA * 0.9, size: 29 });
    if (p(t, q.like89, 0.5) < 0.99) {
      text(ctx, '89', 270, 470, {
        size: 130, weight: 500, color: C.dim, alpha: 0.2, ls: -5,
      });
    }
    text(ctx, '89', 270, 470, {
      size: 130, weight: 500, color: M.logits, alpha: p(t, q.like89, 0.5), ls: -5,
    });
    if (e89A > 0.001) {
      text(ctx, 'e', 270, 570, { size: 58, weight: 500, color: C.fg, alpha: e89A });
      text(ctx, '89', 302, 540, { size: 40, weight: 500, color: C.fg, alpha: e89A });
      text(ctx, '=', 380, 570, { size: 46, weight: 400, color: C.muted, alpha: e89A });
    }
    if (infA > 0.001) {
      text(ctx, '∞', 520, 640, {
        size: 210, weight: 500, color: M.bug, align: 'center', alpha: infA,
      });
      tag(ctx, 520, 700, '32-bit overflow', { color: M.bug, alpha: infA * 0.9, size: 28, align: 'center' });
    }

    // Right panel.
    const rightA = Math.max(shiftA, zeroA * 0.8);
    card(ctx, 1030, 260, 730, 500, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 22, alpha: base * 0.9,
    });
    tag(ctx, 1074, 320, 'after the shift', { color: M.gate, alpha: shiftA * 0.9, size: 29 });
    if (shiftA > 0.001) {
      text(ctx, '− 89', 1110, 430, {
        size: 44, weight: 500, color: C.muted, alpha: shiftA * 0.9,
      });
      text(ctx, 'max score → 0', 1110, 490, {
        size: 34, weight: 400, color: C.fg, alpha: shiftA * 0.95,
      });
    }
    if (zeroA > 0.001) {
      text(ctx, 'e', 1450, 600, { size: 58, weight: 500, color: C.fg, alpha: zeroA });
      text(ctx, '0', 1482, 570, { size: 40, weight: 500, color: C.fg, alpha: zeroA });
      text(ctx, '= 1', 1552, 600, { size: 54, weight: 500, color: C.correct, alpha: oneA });
    }
    if (oneA > 0.5) {
      text(ctx, 'the chances don\u2019t change', 1110, 680, {
        size: 30, weight: 400, color: C.muted, alpha: oneA * 0.95,
      });
    }

    // Arrow between panels.
    if (shiftA > 0.001) {
      arrow(ctx, 900, 510, 1022, 510, {
        color: 'rgba(248,248,242,0.35)', width: 2, progress: shiftA, head: 10,
      });
      text(ctx, 'same trick', 960, 470, {
        size: 27, weight: 400, color: C.dim, align: 'center', alpha: shiftA * 0.9,
      });
    }

    if (nameA > 0.001) {
      text(ctx, 'the max-shift trick', 960, 860, {
        size: 46, weight: 500, color: C.fg, align: 'center', alpha: nameA,
      });
      text(ctx, 'every library does it', 960, 906, {
        size: 28, weight: 400, color: C.dim, align: 'center',
        alpha: p(t, q.everyLibrary, 0.5) * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 23

const twentyThree = {
  id: 's23-bottom-line',
  title: 'One plus tiny',
  start: start(34),
  end: start(35),
  draw(ctx, t) {
    const base = p(t, q.afterShift - 0.2, 0.7);
    const bottomA = p(t, q.bottom, 0.6);
    const oneA = p(t, q.onePlus, 0.6);
    const tinyA = p(t, q.eachTiny, 0.6);
    const leadA = p(t, q.lead, 0.6);
    const biggerA = p(t, q.bigger, 0.7);
    const tinierA = p(t, q.tinier, 0.6);

    card(ctx, 180, 280, 1080, 380, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20, alpha: base * 0.9,
    });
    tag(ctx, 220, 340, 'the bottom line of softmax', {
      color: C.muted, alpha: bottomA * 0.9, size: 29,
    });

    // Formula.
    if (oneA < 0.98) {
      text(ctx, '1', 230, 520, {
        size: 100, weight: 500, color: C.dim, alpha: 0.14, ls: -3,
      });
    }
    text(ctx, '1', 230, 520, {
      size: 100, weight: 500, color: C.correct, alpha: oneA, ls: -3,
    });
    if (oneA > 0.001) {
      text(ctx, '+', 320, 510, { size: 60, weight: 400, color: C.muted, alpha: oneA });
    }
    const term = (x, a) => {
      if (a <= 0.001) return;
      text(ctx, 'e', x, 510, { size: 56, weight: 500, color: M.thought, alpha: a });
      text(ctx, '\u2212lead', x + 32, 486, { size: 34, weight: 500, color: M.thought, alpha: a });
      text(ctx, '+', x + 170, 510, { size: 50, weight: 400, color: C.muted, alpha: a * 0.8 });
    };
    term(400, tinyA * (1 - 0.35 * tinierA));
    term(640, tinyA * (1 - 0.55 * tinierA));
    text(ctx, '\u2026', 900, 512, {
      size: 54, weight: 400, color: C.dim, alpha: tinyA * (1 - 0.6 * tinierA),
    });

    if (tinyA > 0.001) {
      bracket(ctx, 400, 800, 590, {
        color: 'rgba(189,147,249,0.6)', width: 2, alpha: tinyA * 0.8, tick: 10,
      });
      text(ctx, 'each term is tiny', 600, 640, {
        size: 30, weight: 400, color: M.thought, align: 'center', alpha: tinyA * 0.95,
      });
    }

    // The lead, on the right.
    if (leadA < 0.99) {
      card(ctx, 1310, 280, 440, 380, {
        fill: 'rgba(49,51,66,0.18)', stroke: 'rgba(248,248,242,0.12)', r: 20,
        dash: [8, 8], alpha: base * 0.2,
      });
    }
    if (leadA > 0.001) {
      card(ctx, 1310, 280, 440, 380, {
        fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20, alpha: base * leadA * 0.9,
      });
      tag(ctx, 1350, 340, 'the lead', { color: M.logits, alpha: leadA * 0.9, size: 29 });
      text(ctx, 'winner \u2212 other', 1350, 410, {
        size: 34, weight: 400, color: C.fg, alpha: leadA * 0.95,
      });
      const gw = 320;
      card(ctx, 1350, 470, gw, 18, {
        fill: 'rgba(248,248,242,0.08)', stroke: null, r: 9, alpha: leadA,
      });
      card(ctx, 1350, 470, gw * (0.25 + 0.65 * biggerA), 18, {
        fill: M.logits, stroke: null, r: 9, alpha: leadA * 0.9,
      });
      text(ctx, 'bigger lead', 1350, 540, {
        size: 28, weight: 400, color: C.muted, alpha: leadA * (1 - 0.5 * biggerA),
      });
      if (biggerA > 0.2) {
        text(ctx, 'tinier terms', 1350, 590, {
          size: 30, weight: 500, color: M.thought, alpha: biggerA * 0.95,
        });
      }
    }

    text(ctx, '1 + tiny', 720, 780, {
      size: 64, weight: 500, color: C.fg, align: 'center', alpha: bottomA * 0.95, ls: -1,
    });
    if (tinierA > 0.2) {
      text(ctx, 'the bottom line rounds to 1', 960, 860, {
        size: 36, weight: 400, color: M.bug, align: 'center', alpha: tinierA * 0.9,
      });
    }
  },
};

// ---------------------------------------------------------------- 24

const twentyFour = {
  id: 's24-calculator',
  title: 'Seven digits',
  start: start(35),
  end: start(36),
  draw(ctx, t) {
    const base = p(t, q.ideaTwo - 0.2, 0.7);
    const calcA = p(t, 310.5, 0.7);
    const sevenA = p(t, q.seven, 0.6);
    const billionA = p(t, q.billion, 0.5);
    const addA = p(t, q.addCent, 0.5);
    const stillA = p(t, q.still, 0.5);
    const goneA = p(t, q.vanished, 0.7);

    text(ctx, 'idea two', 200, 200, {
      size: 30, weight: 400, color: C.dim, alpha: p(t, q.ideaTwo, 0.5),
    });
    text(ctx, 'computers keep about seven digits', 960, 250, {
      size: 38, weight: 450, color: C.muted, align: 'center',
      alpha: p(t, q.everyDigit, 0.6) * 0.95,
    });

    // Calculator body.
    card(ctx, 560, 310, 800, 560, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.16)', r: 26, alpha: base * Math.max(0.6, calcA),
    });
    card(ctx, 610, 360, 700, 380, {
      fill: C.well, stroke: 'rgba(139,233,253,0.25)', r: 12, alpha: base * Math.max(0.55, calcA),
    });
    if (sevenA > 0.001) {
      tag(ctx, 960, 330, '7 significant digits', {
        color: C.dim, alpha: sevenA * 0.9, size: 27, align: 'center',
      });
    }
    if (billionA < 0.99) {
      text(ctx, '0.000000e0', 960, 470, {
        size: 62, weight: 500, color: C.dim, family: MONO, align: 'center', alpha: 0.3,
      });
    }
    if (billionA > 0.001) {
      text(ctx, '1.000000e9', 960, 470, {
        size: 62, weight: 500, color: M.gate, family: MONO, align: 'center', alpha: billionA,
      });
    }
    if (addA > 0.001) {
      text(ctx, '+ 0.01', 960, 560, {
        size: 46, weight: 400, color: C.muted, family: MONO, align: 'center', alpha: addA,
      });
      line(ctx, 650, 590, 1270, 590, {
        color: 'rgba(248,248,242,0.14)', width: 1.4, rough: 0, alpha: addA,
      });
    }
    if (stillA > 0.001) {
      text(ctx, '1.000000e9', 960, 690, {
        size: 62, weight: 500, color: M.fg, family: MONO, align: 'center', alpha: stillA,
      });
    }
    if (goneA > 0.001) {
      text(ctx, 'the cent vanished', 960, 790, {
        size: 40, weight: 500, color: M.bug, align: 'center', alpha: goneA,
      });
      // a tiny cent falling away
      const fy = 620 + 90 * easeOutCubic(p(t, q.vanished, 1.2));
      ctx.save();
      ctx.globalAlpha = goneA * 0.9;
      ctx.fillStyle = M.word;
      ctx.beginPath();
      ctx.arc(1230, fy, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  },
};

// ---------------------------------------------------------------- 25

const twentyFive = {
  id: 's25-swallowed',
  title: 'Swallowed by one',
  start: start(36),
  end: start(37) + 0.32,
  draw(ctx, t) {
    const base = p(t, q.realComputers - 0.2, 0.7);
    const nearA = p(t, q.nearOne, 0.6);
    const tinyA = p(t, q.tiny38, 0.6);
    const okA = p(t, q.noProblem, 0.6);
    const plusA = p(t, q.onePlusFour, 0.6);
    const roundA = p(t, q.rounds, 0.6);
    const swallowA = p(t, q.swallowed, 0.8);

    // Left: a tiny number is fine on its own.
    card(ctx, 180, 300, 700, 430, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20, alpha: base * 0.9,
    });
    tag(ctx, 220, 360, 'a tiny number', { color: C.muted, alpha: nearA * 0.9, size: 29 });
    if (tinyA < 0.99) {
      text(ctx, '1e-38', 250, 520, {
        size: 88, weight: 500, color: C.dim, family: MONO, alpha: 0.14, ls: -2,
      });
    }
    if (tinyA > 0.001) {
      text(ctx, '1e-38', 250, 520, {
        size: 88, weight: 500, color: M.correct, family: MONO, alpha: tinyA, ls: -2,
      });
      card(ctx, 250, 570, 360, 44, {
        fill: 'rgba(80,250,123,0.10)', stroke: 'rgba(80,250,123,0.35)', r: 22,
        lw: 1.4, alpha: tinyA,
      });
      text(ctx, 'stored just fine', 430, 598, {
        size: 28, weight: 400, color: M.correct, align: 'center', alpha: tinyA * okA,
      });
    }

    // Right: adding it to one.
    card(ctx, 1020, 300, 720, 430, {
      fill: C.surface, stroke: 'rgba(248,248,242,0.14)', r: 20, alpha: base * 0.9,
    });
    tag(ctx, 1060, 360, 'near the number one', { color: C.muted, alpha: nearA * 0.9, size: 29 });
    if (plusA < 0.99) {
      text(ctx, '1 + 0.00000004', 1060, 490, {
        size: 48, weight: 400, color: C.dim, family: MONO, alpha: 0.14,
      });
    }
    if (plusA > 0.001) {
      text(ctx, '1 + 0.00000004', 1060, 490, {
        size: 48, weight: 400, color: C.fg, family: MONO, alpha: plusA,
      });
      text(ctx, '=', 1060, 580, { size: 54, weight: 400, color: C.muted, alpha: plusA });
      text(ctx, '1', 1160, 620, {
        size: 150, weight: 500, color: M.bug, alpha: plusA, ls: -4,
      });
    }
    if (swallowA > 0.001) {
      text(ctx, 'the tiny part is swallowed', 1060, 690, {
        size: 30, weight: 400, color: M.bug, alpha: swallowA * 0.95,
      });
    }

    // A small number-line cue near 1.
    if (roundA > 0.001) {
      line(ctx, 1060, 640, 1540, 640, {
        color: 'rgba(248,248,242,0.14)', width: 1.4, rough: 0, alpha: roundA * 0.8,
      });
    }
  },
};

export default [twenty, twentyOne, twentyTwo, twentyThree, twentyFour, twentyFive];
