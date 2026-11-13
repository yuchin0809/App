import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import Constants from 'expo-constants';
import { colors, LINKS } from './theme';
import { useSettings } from './SettingsContext';

export default function SettingsScreen({ onShowWelcome }) {
  const { settings, update, t } = useSettings();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const Row = ({ label, onPress, right, last }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={[s.row, !last && s.rowLine]}
    >
      <Text style={s.rowText}>{label}</Text>
      <Text style={s.rowRight}>{right ?? '›'}</Text>
    </Pressable>
  );

  return (
    <ScrollView style={s.wrap} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={s.eyebrow}>SETTINGS</Text>
      <Text style={s.title} accessibilityRole="header">
        {t.settings}
      </Text>

      <Text style={s.sec}>{t.language}</Text>
      <View style={s.seg}>
        {[
          ['ja', '日本語'],
          ['en', 'English'],
        ].map(([code, name]) => {
          const on = settings.lang === code;
          return (
            <Pressable
              key={code}
              onPress={() => update({ lang: code })}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={[s.segItem, on && { backgroundColor: colors.water }]}
            >
              <Text style={[s.segText, on && { color: colors.waterOn, fontWeight: '700' }]}>{name}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={s.sec}>{t.safety}</Text>
      <View style={s.card}>
        <View style={[s.pad, s.rowLine]}>
          <View style={s.between}>
            <Text style={s.rowText}>{t.volumeLimit}</Text>
            <Text style={[s.rowRight, { color: colors.water, fontWeight: '700' }]}>{settings.volumeLimit}%</Text>
          </View>
          <Slider
            accessibilityLabel={t.volumeLimit}
            minimumValue={20}
            maximumValue={100}
            step={5}
            value={settings.volumeLimit}
            minimumTrackTintColor={colors.water}
            maximumTrackTintColor={colors.line}
            thumbTintColor={colors.water}
            onSlidingComplete={(v) => update({ volumeLimit: Math.round(v) })}
            style={{ height: 36 }}
          />
          <Text style={s.small}>{t.systemVolume}</Text>
        </View>
        <View style={[s.row, s.rowLine]}>
          <Text style={s.rowText}>{t.autoStop}</Text>
          <Switch
            value={settings.autoStop}
            onValueChange={(v) => update({ autoStop: v })}
            trackColor={{ true: colors.water, false: colors.line }}
            accessibilityLabel={t.autoStop}
          />
        </View>
        <View style={s.row}>
          <Text style={s.rowText}>{t.warnBefore}</Text>
          <Switch
            value={settings.warn}
            onValueChange={(v) => update({ warn: v })}
            trackColor={{ true: colors.water, false: colors.line }}
            accessibilityLabel={t.warnBefore}
          />
        </View>
      </View>

      <Text style={s.sec}>{t.info}</Text>
      <View style={s.card}>
        <Row label={t.howTo} onPress={onShowWelcome} />
        <Row label={t.privacy} onPress={() => Linking.openURL(LINKS.privacy)} />
        <Row label={t.support} onPress={() => Linking.openURL(LINKS.support)} />
        <Row label={t.version} right={version} last onPress={() => {}} />
      </View>

      <Text style={s.disc}>{t.disclaimer}</Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  eyebrow: { color: colors.muted, fontSize: 12, letterSpacing: 1 },
  title: { color: colors.text, fontSize: 24, fontWeight: '700', marginTop: 2 },
  sec: { color: colors.muted, fontSize: 13, marginTop: 24, marginBottom: 8 },
  seg: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16, padding: 4, gap: 4 },
  segItem: { flex: 1, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  segText: { color: colors.muted, fontSize: 15 },
  card: { backgroundColor: colors.surface, borderRadius: 18, paddingHorizontal: 16 },
  pad: { paddingVertical: 14 },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
  row: { minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLine: { borderBottomWidth: 1, borderBottomColor: colors.line },
  rowText: { color: colors.text, fontSize: 15 },
  rowRight: { color: colors.muted, fontSize: 15 },
  small: { color: colors.muted, fontSize: 12, marginTop: 2 },
  disc: { color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 16, marginHorizontal: 4 },
});
