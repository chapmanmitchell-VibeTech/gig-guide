import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, VENUES } from '../theme';
import { inWhen, byDateTime, dayShort, timeRange } from '../dates';
import { Button } from '../components';

export default function VenuesScreen({ gigs, follows, go, toggleVenue }) {
  return (
    <ScrollView contentContainerStyle={st.wrap}>
      <Text style={st.title}>Venues</Text>
      {VENUES.map((v) => {
        const next = gigs.filter((g) => g.venue === v.id && inWhen(g.date, 'all')).sort(byDateTime).slice(0, 3);
        const on = follows.venues.includes(v.id);
        return (
          <View key={v.id} style={st.card}>
            <Text style={st.name}>{v.id}</Text>
            <Text style={st.addr}>{v.area} &middot; {v.address}</Text>
            {next.map((g) => (
              <Pressable key={g.id} onPress={() => go('gig', { id: g.id })} style={st.gig}>
                <Text style={st.gigDay}>{dayShort(g.date)}</Text>
                <Text style={st.gigTitle} numberOfLines={1}>{g.title}</Text>
                <Text style={st.gigTime}>{timeRange(g.start, g.end)}</Text>
              </Pressable>
            ))}
            {!next.length && <Text style={st.addr}>Nothing listed yet.</Text>}
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Button label={on ? 'Following' : 'Follow venue'} onPress={() => toggleVenue(v.id)} />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  wrap: { padding: 20 },
  title: { fontFamily: fonts.serif, fontSize: 40, color: colors.text, marginBottom: 16 },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16,
    padding: 16, marginBottom: 12, gap: 4 },
  name: { fontFamily: fonts.serif, fontSize: 26, color: colors.text },
  addr: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, marginBottom: 4 },
  gig: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 9,
    borderTopWidth: 1, borderTopColor: colors.line },
  gigDay: { width: 70, fontFamily: fonts.bold, fontSize: 12.5, color: colors.accent },
  gigTitle: { flex: 1, fontFamily: fonts.medium, fontSize: 14.5, color: colors.text },
  gigTime: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted },
});
