import { getSettings } from "./settings.js";

export function playSound(type = "click") {
  if (!getSettings().soundEnabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const frequencies = { click: 440, success: 740, fail: 180, medal: 960, finish: 520 };
  oscillator.frequency.value = frequencies[type] || 440;
  oscillator.type = type === "fail" ? "sawtooth" : "sine";
  gain.gain.setValueAtTime(0.05, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.16);
}
