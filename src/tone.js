import { File, Paths } from 'expo-file-system';

const RATE = 44100;

// 1秒ぶんの正弦波（整数Hzなので1秒でちょうど整数周期 → つなぎ目なしでループできる）
function makeWav(freq) {
  const n = RATE;
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const str = (o, s) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  str(0, 'RIFF');
  v.setUint32(4, 36 + n * 2, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, RATE, true);
  v.setUint32(28, RATE * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    const s = Math.sin((2 * Math.PI * freq * i) / RATE) * 0.9;
    v.setInt16(44 + i * 2, Math.round(s * 32767), true);
  }
  return new Uint8Array(buf);
}

export async function getToneUri(freq) {
  const hz = Math.max(20, Math.min(200, Math.round(freq)));
  const file = new File(Paths.cache, `tone-${hz}.wav`);
  if (!file.exists) {
    file.create({ overwrite: true });
    await file.write(makeWav(hz));
  }
  return file.uri;
}
