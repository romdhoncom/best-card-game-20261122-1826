// Tiny synthesized sounds: WebAudio bleeps, no audio files. Everything is
// guarded — with no user gesture yet, or headless, a tone simply does nothing.
let ctx = null;

function tone(freq, ms = 90, type = 'triangle', when = 0) {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.05, ctx.currentTime + when);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + when + ms / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + when);
    osc.stop(ctx.currentTime + when + ms / 1000);
  } catch (_) {
    // No audio available — the game plays on silently.
  }
}

export const sfx = {
  play: () => tone(520, 80),
  combo: () => { tone(660, 90); tone(880, 130, 'triangle', 0.09); tone(1320, 160, 'sine', 0.18); },
  turn: () => tone(392, 70, 'sine'),
  win: () => { tone(523, 120); tone(659, 120, 'triangle', 0.12); tone(784, 200, 'triangle', 0.24); },
  loss: () => { tone(330, 150, 'sawtooth'); tone(220, 220, 'sawtooth', 0.15); },
};
