import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SettingsProvider, useSettings } from './src/SettingsContext';
import CleanerScreen from './src/CleanerScreen';
import SettingsScreen from './src/SettingsScreen';
import WelcomeScreen from './src/WelcomeScreen';
import { colors } from './src/theme';

function Root() {
  const { settings, update, t, ready } = useSettings();
  const [tab, setTab] = useState('water');
  const [showWelcome, setShowWelcome] = useState(false);

  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  if (!settings.welcomeSeen || showWelcome) {
    return (
      <WelcomeScreen
        doneLabel={settings.welcomeSeen ? t.close : t.welcomeOk}
        onDone={() => {
          setShowWelcome(false);
          if (!settings.welcomeSeen) update({ welcomeSeen: true });
        }}
      />
    );
  }

  const tabs = [
    ['water', t.tabWater, 'water-outline'],
    ['dust', t.tabDust, 'weather-windy'],
    ['settings', t.tabSettings, 'tune-variant'],
  ];
  const accentFor = (id) => (id === 'dust' ? colors.dust : colors.water);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {tab === 'settings' ? (
          <SettingsScreen onShowWelcome={() => setShowWelcome(true)} />
        ) : (
          <CleanerScreen key={tab} mode={tab} onSwitch={setTab} />
        )}
      </View>
      <View style={s.nav}>
        {tabs.map(([id, label, glyph]) => {
          const on = tab === id;
          return (
            <Pressable
              key={id}
              onPress={() => setTab(id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              style={s.tab}
            >
              <MaterialCommunityIcons name={glyph} size={26} color={on ? accentFor(id) : colors.muted} />
              <Text style={[s.tabText, { color: on ? accentFor(id) : colors.muted }, on && { fontWeight: '700' }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
          <StatusBar style="light" />
          <Root />
        </SafeAreaView>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  nav: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 6 },
  tab: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: 2 },
  tabText: { fontSize: 11 },
});
