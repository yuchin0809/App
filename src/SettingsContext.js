import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { strings } from './i18n';

const KEY = 'settings.v1';
const systemLang = () => (getLocales()[0]?.languageCode === 'ja' ? 'ja' : 'en');

const defaults = () => ({
  lang: systemLang(),
  volumeLimit: 80,
  autoStop: true,
  warn: true,
  welcomeSeen: false,
});

const Ctx = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setSettings((s) => ({ ...s, ...JSON.parse(raw) }));
      } catch {}
      setReady(true);
    })();
  }, []);

  const value = useMemo(() => {
    const update = (patch) =>
      setSettings((s) => {
        const next = { ...s, ...patch };
        AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    return { settings, update, t: strings[settings.lang] || strings.en, ready };
  }, [settings, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSettings = () => useContext(Ctx);
