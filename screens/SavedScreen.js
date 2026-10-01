import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import { inWhen, byDateTime } from '../dates';
import { GigCard } from '../components';

export default function SavedScreen({ gigs, saved, go, toggleSave }) {
  const list = gigs.filter((g) => saved.includes(g.id) && inWhen(g.date, 'all')).sort(byDateTime);
  return (
    <ScrollView contentContainerStyle={st.wrap}>
      <Text style={st.title}>Saved</Text>
      {!list.length && <Text style={st.empty}>Tap Save on any gig and it shows up here.</Text>}
      {list.map((g) => (
        <GigCard key={g.id} gig={g} saved onOpen={() => go('gig', { id: g.id })} onSave={() => toggleSave(g.id)} />
      ))}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  wrap: { padding: 20 },
  title: { fontFamily: fonts.serif, fontSize: 40, color: colors.text, marginBottom: 16 },
  empty: { fontFamily: fonts.body, fontSize: 14, color: colors.muted },
});
