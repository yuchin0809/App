import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { getToneUri } from './tone';

const KEEP_AWAKE_TAG = 'tone';
const HARD_CAP_SEC = 300; // 自動停止オフでも5分で止める

export function useTone() {
  const playerRef = useRef(null);
  const timerRef = useRef(null);
  const hapticRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [remaining, setRemaining] = useState(0);

  const clearTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (hapticRef.current) clearInterval(hapticRef.current);
    timerRef.current = null;
    hapticRef.current = null;
  };

  const stop = useCallback(() => {
    clearTimers();
    const p = playerRef.current;
    playerRef.current = null;
    if (p) {
      try {
        p.pause();
        p.remove();
      } catch {}
    }
    deactivateKeepAwake(KEEP_AWAKE_TAG);
    setPlaying(false);
    setRemaining(0);
  }, []);

  const start = useCallback(
    async ({ freq, volume, seconds, haptics, autoStop }) => {
      stop();
      await setAudioModeAsync({ playsInSilentMode: true });
      const uri = await getToneUri(freq);
      const player = createAudioPlayer({ uri });
      player.loop = true;
      player.volume = Math.max(0, Math.min(1, volume));
      player.play();
      playerRef.current = player;
      activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});

      let left = autoStop ? seconds : HARD_CAP_SEC;
      setRemaining(left);
      setPlaying(true);
      timerRef.current = setInterval(() => {
        left -= 1;
        setRemaining(left);
        if (left <= 0) stop();
      }, 1000);

      if (haptics) {
        hapticRef.current = setInterval(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
        }, 90);
      }
    },
    [stop]
  );

  // 周波数・音量だけ再生中に変える
  const retune = useCallback(async (freq, volume) => {
    const p = playerRef.current;
    if (!p) return;
    p.volume = Math.max(0, Math.min(1, volume));
    try {
      const uri = await getToneUri(freq);
      p.replace({ uri });
      p.loop = true;
      p.play();
    } catch {}
  }, []);

  const setVolume = useCallback((volume) => {
    const p = playerRef.current;
    if (p) p.volume = Math.max(0, Math.min(1, volume));
  }, []);

  // アプリが裏に回ったら止める
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s !== 'active') stop();
    });
    return () => {
      sub.remove();
      stop();
    };
  }, [stop]);

  return { playing, remaining, start, stop, retune, setVolume };
}
