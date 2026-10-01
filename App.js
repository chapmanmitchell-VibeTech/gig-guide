import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, BackHandler, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { useFonts, Anton_400Regular } from '@expo-google-fonts/anton';
import { InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic } from '@expo-google-fonts/instrument-serif';
import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk';
import { colors, fonts } from './theme';
import { loadAll, saveGigs, saveFollows, saveSaved, newId } from './storage';
import HomeScreen from './screens/HomeScreen';
import GigScreen from './screens/GigScreen';
import ArtistScreen from './screens/ArtistScreen';
import SavedScreen from './screens/SavedScreen';
import VenuesScreen from './screens/VenuesScreen';
import AddGigScreen from './screens/AddGigScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <GigGuide />
    </SafeAreaProvider>
  );
}

const TABS = [
  { key: 'home', label: 'Gigs' },
  { key: 'saved', label: 'Saved' },
  { key: 'venues', label: 'Venues' },
  { key: 'add', label: 'Add a gig' },
];

function GigGuide() {
  const insets = useSafeAreaInsets();
  const [fontsLoaded, fontError] = useFonts({
    Anton_400Regular, InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic,
    SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold,
  });

  const [data, setData] = useState(null); // { gigs, follows, saved }
  const [tab, setTab] = useState('home');
  const [stack, setStack] = useState([]); // screens on top of the tabs: { name, params }
  const [flash, setFlash] = useState(null);

  useEffect(() => { loadAll().then(setData); }, []);

  // Hide Android's home bar; swipe up to bring it back.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    // Expo 57: hiding always uses swipe-to-show, so there's no separate behaviour call.
    NavigationBar.NavigationBar.setHidden(true);
  }, []);

  useEffect(() => {
    if (!flash) return undefined;
    const t = setTimeout(() => setFlash(null), 3000);
    return () => clearTimeout(t);
  }, [flash]);

  const go = useCallback((name, params) => setStack((s) => [...s, { name, params }]), []);
  const back = useCallback(() => setStack((s) => s.slice(0, -1)), []);

  // Android back button closes the top screen first.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length) { back(); return true; }
      if (tab !== 'home') { setTab('home'); return true; }
      return false;
    });
    return () => sub.remove();
  }, [stack, tab, back]);

  if (!data || (!fontsLoaded && !fontError)) {
    return <View style={[st.safe, st.center]}><ActivityIndicator color={colors.accent} /></View>;
  }

  const { gigs, follows, saved } = data;
  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  const toggleSave = (id) => {
    const next = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    update({ saved: next }); saveSaved(next);
  };
  const toggleFollow = (name) => {
    const names = follows.names.includes(name) ? follows.names.filter((x) => x !== name) : [...follows.names, name];
    const next = { ...follows, names }; update({ follows: next }); saveFollows(next);
  };
  const toggleVenue = (venue) => {
    const venues = follows.venues.includes(venue) ? follows.venues.filter((x) => x !== venue) : [...follows.venues, venue];
    const next = { ...follows, venues }; update({ follows: next }); saveFollows(next);
  };
  const addGig = async (gig) => {
    const withId = { ...gig, id: newId() };
    const next = [...gigs, withId];
    update({ gigs: next });
    const ok = await saveGigs(next);
    setFlash(`Added \u2014 ${withId.title} is on the Gigs tab.`);
    setTab('home'); setStack([]);
    return ok;
  };

  const top = stack[stack.length - 1];
  const shared = { gigs, follows, saved, go, back, toggleSave, toggleFollow, toggleVenue };

  let screen;
  if (top && top.name === 'gig') {
    const gig = gigs.find((g) => g.id === top.params.id);
    screen = <GigScreen {...shared} gig={gig} saved={gig ? saved.includes(gig.id) : false}
      toggleSave={() => gig && toggleSave(gig.id)} />;
  } else if (top && top.name === 'artist') {
    screen = <ArtistScreen {...shared} name={top.params.name} />;
  } else if (tab === 'saved') screen = <SavedScreen {...shared} />;
  else if (tab === 'venues') screen = <VenuesScreen {...shared} />;
  else if (tab === 'add') screen = <AddGigScreen onAdd={addGig} />;
  else screen = <HomeScreen {...shared} />;

  return (
    <View style={[st.safe, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      {!!flash && <View style={st.flash}><Text style={st.flashText}>{flash}</Text></View>}
      <View style={{ flex: 1 }}>{screen}</View>
      <View style={[st.tabbar, { paddingBottom: 8 + insets.bottom }]}>
        {TABS.map((t) => {
          const on = tab === t.key && !stack.length;
          return (
            <Pressable key={t.key} style={st.tab} onPress={() => { setStack([]); setTab(t.key); }}>
              <View style={[st.tabLine, on && { backgroundColor: colors.accent }]} />
              <Text style={[st.tabText, on && st.tabTextOn]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  center: { alignItems: 'center', justifyContent: 'center' },
  flash: { margin: 12, marginBottom: 0, backgroundColor: colors.accent, borderRadius: 10, padding: 12 },
  flashText: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.ink },
  tabbar: { flexDirection: 'row', backgroundColor: colors.tabbar, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 6 },
  tab: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center', gap: 6 },
  tabLine: { width: 20, height: 2, borderRadius: 2, backgroundColor: 'transparent' },
  tabText: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted },
  tabTextOn: { fontFamily: fonts.bold, color: colors.text },
});
