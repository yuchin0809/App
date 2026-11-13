import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from './theme';
import { useSettings } from './SettingsContext';
import { useTone } from './useTone';

const WATER_HZ = 165;
const DURATIONS = [30, 60, 120];
const INTENSITY = [0.5, 0.75, 1];

export default function CleanerScreen({ mode, onSwitch }) {
  const { settings, t } = useSettings();
  const isWater = mode === 'water';
  const accent = isWater ? colors.water : colors.dust;
  const onAccent = isWater ? colors.waterOn : colors.dustOn;

  const { playing, remaining, start, stop, retune, setVolume } = useTone();
  const [seconds, setSeconds] = useState(30);
  const [freq, setFreq] = useState(60);
  const [level, setLevel] = useState(1); // 0..2
  const [haptics, setHaptics] = useState(true);

  const hz = isWater ? WATER_HZ : Math.round(freq);
  const volume = (settings.volumeLimit / 100) * (isWater ? 1 : INTENSITY[level]);

  const begin = () =>
    start({ freq: hz, volume, seconds, haptics: !isWater && haptics, autoStop: settings.autoStop });

  const onPress = () => {
    if (playing) return stop();
    if (!settings.warn) return begin();
    Alert.alert(t.alertTitle, t.alertBody, [
      { text: t.cancel, style: 'cancel' },
      { text: t.go, onPress: begin },
    ]);
  };

  // 再生中の音量変更を反映
  useEffect(() => {
    if (playing) setVolume(volume);
  }, [volume, playing, setVolume]);

  const levelLabel = [t.intLow, t.intMid, t.intHigh][level];

  return (
    <View style={s.wrap}>
      <Text style={s.eyebrow}>{isWater ? 'WATER EJECT' : 'DUST BLOWER'}</Text>
      <Text style={s.title} accessibilityRole="header">
        {isWater ? t.appName : t.titleDust}
      </Text>

      <View style={s.seg}>
        <Pressable
          onPress={() => !isWater && onSwitch('water')}
          style={[s.segItem, isWater && { backgroundColor: colors.water }]}
          accessibilityRole="button"
        >
          <Text style={[s.segText, isWater && { color: colors.waterOn, fontWeight: '700' }]}>{t.segWater}</Text>
        </Pressable>
        <Pressable
          onPress={() => isWater && onSwitch('dust')}
          style={[s.segItem, !isWater && { backgroundColor: colors.dust }]}
          accessibilityRole="button"
        >
          <Text style={[s.segText, !isWater && { color: colors.dustOn, fontWeight: '700' }]}>{t.segDust}</Text>
        </Pressable>
      </View>

      <View style={s.stage}>
        <View style={[s.ring, { width: 248, height: 248, borderColor: accent, opacity: 0.12 }]} />
        <View style={[s.ring, { width: 200, height: 200, borderColor: accent, opacity: 0.22 }]} />
        <View style={[s.ring, { width: 152, height: 152, borderColor: accent, opacity: 0.38 }]} />
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={playing ? t.stop : t.start}
          style={[s.big, { backgroundColor: accent }]}
        >
          <Text style={[s.bigIcon, { color: onAccent }]}>{playing ? '■' : '▶'}</Text>
          <Text style={[s.bigLabel, { color: onAccent }]}>
            {playing ? `${t.remaining} ${remaining}${t.sec}` : t.start}
          </Text>
        </Pressable>
      </View>

      <View style={s.readout}>
        <Text style={s.hz}>
          {hz}
          <Text style={s.hzUnit}> Hz</Text>
        </Text>
        {isWater && <Text style={s.hint}>{t.waterHint}</Text>}
      </View>

      {!isWater && (
        <View style={{ marginTop: 4 }}>
          <View style={s.rowBetween}>
            <Text style={s.label}>{t.frequency}</Text>
            <Text style={s.hint}>20–200 Hz</Text>
          </View>
          <Slider
            accessibilityLabel={t.frequency}
            minimumValue={20}
            maximumValue={200}
            step={1}
            value={freq}
            minimumTrackTintColor={accent}
            maximumTrackTintColor={colors.line}
            thumbTintColor={accent}
            onValueChange={setFreq}
            onSlidingComplete={(v) => playing && retune(Math.round(v), volume)}
            style={s.slider}
          />
          <View style={s.rowBetween}>
            <Text style={s.label}>{t.intensity}</Text>
            <Text style={s.hint}>{levelLabel}</Text>
          </View>
          <Slider
            accessibilityLabel={t.intensity}
            minimumValue={0}
            maximumValue={2}
            step={1}
            value={level}
            minimumTrackTintColor={accent}
            maximumTrackTintColor={colors.line}
            thumbTintColor={accent}
            onValueChange={setLevel}
            style={s.slider}
          />
          <View style={[s.card, s.rowBetween]}>
            <Text style={s.cardText}>{t.haptics}</Text>
            <Switch
              value={haptics}
              onValueChange={setHaptics}
              trackColor={{ true: accent, false: colors.line }}
              accessibilityLabel={t.haptics}
            />
          </View>
        </View>
      )}

      <View style={s.chips}>
        {DURATIONS.map((d) => {
          const on = d === seconds;
          return (
            <Pressable
              key={d}
              onPress={() => setSeconds(d)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={[s.chip, on && { backgroundColor: accent }]}
            >
              <Text style={[s.chipText, on && { color: onAccent, fontWeight: '700' }]}>
                {d}
                {t.sec}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[s.card, { flexDirection: 'row', gap: 10, alignItems: 'center' }]}>
        <Text style={{ color: colors.dust, fontSize: 18 }}>♪</Text>
        <Text style={s.warn}>{isWater ? t.loudWarn : `${t.loudWarn} ${t.dustNote}`}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  eyebrow: { color: colors.muted, fontSize: 12, letterSpacing: 1 },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 2 },
  seg: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16, padding: 4, marginTop: 16, gap: 4 },
  segItem: { flex: 1, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  segText: { color: colors.muted, fontSize: 15 },
  stage: { height: 230, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  ring: { position: 'absolute', borderRadius: 999, borderWidth: 2 },
  big: { width: 128, height: 128, borderRadius: 64, alignItems: 'center', justifyContent: 'center' },
  bigIcon: { fontSize: 34, lineHeight: 40 },
  bigLabel: { fontSize: 14, fontWeight: '700' },
  readout: { alignItems: 'center', marginTop: 2 },
  hz: { color: colors.text, fontSize: 52, fontWeight: '700' },
  hzUnit: { color: colors.muted, fontSize: 20, fontWeight: '400' },
  hint: { color: colors.muted, fontSize: 13 },
  label: { color: colors.text, fontSize: 14, fontWeight: '700' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  slider: { width: '100%', height: 36 },
  card: { backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginTop: 8 },
  cardText: { color: colors.text, fontSize: 14 },
  chips: { flexDirection: 'row', gap: 10, marginTop: 12 },
  chip: { flex: 1, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  chipText: { color: colors.text, fontSize: 14 },
  warn: { flex: 1, color: colors.textSub, fontSize: 12, lineHeight: 18 },
});
