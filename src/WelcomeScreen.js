import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme';
import { useSettings } from './SettingsContext';

export default function WelcomeScreen({ onDone, doneLabel }) {
  const { t } = useSettings();
  const items = [
    ['!', t.w1t, t.w1b],
    ['?', t.w2t, t.w2b],
    ['⏱', t.w3t, t.w3b],
  ];
  return (
    <View style={s.wrap}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <View style={s.brand}>
          <Image source={require('../assets/icon.png')} style={s.icon} accessibilityIgnoresInvertColors />
          <Text style={s.brandName}>{t.appName}</Text>
        </View>
        <Text style={s.h1} accessibilityRole="header">
          {t.welcomeTitle}
        </Text>
        <Text style={s.lead}>{t.welcomeLead}</Text>
        {items.map(([mark, title, body]) => (
          <View key={title} style={s.card}>
            <Text style={s.mark}>{mark}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.cardTitle}>{title}</Text>
              <Text style={s.cardBody}>{body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <Pressable onPress={onDone} style={s.btn} accessibilityRole="button">
        <Text style={s.btnText}>{doneLabel || t.welcomeOk}</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  icon: { width: 72, height: 72, borderRadius: 18 },
  brandName: { color: colors.text, fontSize: 17, fontWeight: '700', flex: 1 },
  h1: { color: colors.text, fontSize: 28, fontWeight: '700', marginTop: 20, lineHeight: 36 },
  lead: { color: colors.muted, fontSize: 14, lineHeight: 22, marginTop: 8, marginBottom: 12 },
  card: { flexDirection: 'row', gap: 14, backgroundColor: colors.surface, borderRadius: 18, padding: 16, marginTop: 10 },
  mark: { color: colors.dust, fontSize: 22, width: 26, textAlign: 'center', fontWeight: '700' },
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  cardBody: { color: colors.textSub, fontSize: 13, lineHeight: 20, marginTop: 2 },
  btn: { height: 56, borderRadius: 28, backgroundColor: colors.water, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: colors.waterOn, fontSize: 17, fontWeight: '700' },
});
