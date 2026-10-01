import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts, posterFor } from '../theme';
import { inWhen, byDateTime, dayShort, dayNumber, monthShort, timeRange } from '../dates';
import { Tag, Button, Heading, Label, openLink } from '../components';
import { PROFILES } from '../seed';

export default function ArtistScreen({ name, gigs, follows, back, go, toggleFollow }) {
  const p = PROFILES[name] || { kind: 'DJ', sounds: [], links: [], plays: [], with: [] };
  const following = follows.names.includes(name);
  const [bg, shape] = posterFor(name);
  const theirs = gigs
    .filter((g) => inWhen(g.date, 'all'))
    .filter((g) => g.presentedBy === name || (g.lineup || []).some((a) => a.name.includes(name)))
    .sort(byDateTime);

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={[st.hero, { backgroundColor: bg }]}>
        <View style={[st.sun, { backgroundColor: shape }]} />
        <Pressable onPress={back} style={st.back} accessibilityLabel="Back">
          <Feather name="chevron-left" size={22} color={colors.text} />
        </Pressable>
        <View style={{ gap: 8 }}>
          <Text style={st.kind}>{p.kind.toUpperCase()} &middot; T&#256;MAKI MAKAURAU</Text>
          <Text style={st.name}>{name.toUpperCase()}</Text>
        </View>
      </View>

      <View style={st.body}>
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row' }}>
            <Button kind={following ? 'outline' : 'primary'}
              label={following ? 'Following' : 'Follow \u00b7 tell me when they\u2019re on'}
              onPress={() => toggleFollow(name)} />
          </View>
          <Text style={st.hint}>You&rsquo;ll see them at the top of Gigs when they&rsquo;re on at Goblin, Nami, Neck of the Woods or Whammy.</Text>
        </View>

        {!!p.sounds.length && (
          <View style={{ gap: 10 }}>
            <Label>SOUNDS</Label>
            <View style={st.tags}>{p.sounds.map((s) => <Tag key={s} label={s} />)}</View>
          </View>
        )}

        <View>
          <Heading title="Next up" />
          {!theirs.length && <Text style={st.hint}>No gigs listed at the four venues yet.</Text>}
          {theirs.map((g) => (
            <Pressable key={g.id} onPress={() => go('gig', { id: g.id })} style={st.next}>
              <View style={{ width: 56, alignItems: 'center' }}>
                <Text style={st.nextDay}>{dayShort(g.date).toUpperCase().slice(0, 3)}</Text>
                <Text style={st.nextNum}>{dayNumber(g.date)}</Text>
                <Text style={st.nextMonth}>{monthShort(g.date)}</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={st.nextTitle}>{g.title}</Text>
                <Text style={st.hint}>{g.venue} &middot; {timeRange(g.start, g.end)}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.muted} />
            </Pressable>
          ))}
        </View>

        {!!p.links.length && (
          <View>
            <Heading title="Have a listen" />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {p.links.map((l) => <Button key={l.label} label={l.label} onPress={() => openLink(l.url)} />)}
            </View>
          </View>
        )}

        {(!!p.plays.length || !!p.with.length) && (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {!!p.plays.length && <Box label="USUALLY PLAYS" lines={p.plays} />}
            {!!p.with.length && <Box label="OFTEN WITH" lines={p.with} onPress={(n) => go('artist', { name: n })} />}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const Box = ({ label, lines, onPress }) => (
  <View style={st.box}>
    <Text style={st.boxLabel}>{label}</Text>
    {lines.map((l) => (
      <Text key={l} style={st.boxLine} onPress={onPress ? () => onPress(l) : undefined}>{l}</Text>
    ))}
  </View>
);

const st = StyleSheet.create({
  hero: { height: 340, overflow: 'hidden', justifyContent: 'space-between', padding: 20, paddingTop: 14 },
  sun: { position: 'absolute', left: -70, bottom: -110, width: 340, height: 340, borderRadius: 170, opacity: 0.8 },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(26,19,16,0.7)',
    alignItems: 'center', justifyContent: 'center' },
  kind: { fontFamily: fonts.body, fontSize: 11, letterSpacing: 2, color: colors.text },
  name: { fontFamily: fonts.display, fontSize: 52, lineHeight: 52, color: colors.text },
  body: { padding: 20, gap: 22 },
  hint: { fontFamily: fonts.body, fontSize: 13, color: colors.muted, lineHeight: 18 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  next: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 14, marginBottom: 8 },
  nextDay: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.6, color: colors.accent },
  nextNum: { fontFamily: fonts.display, fontSize: 28, lineHeight: 30, color: colors.text },
  nextMonth: { fontFamily: fonts.body, fontSize: 11, letterSpacing: 1.6, color: colors.muted },
  nextTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  box: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 14,
    padding: 14, gap: 4 },
  boxLabel: { fontFamily: fonts.body, fontSize: 11, letterSpacing: 1.6, color: colors.muted, marginBottom: 2 },
  boxLine: { fontFamily: fonts.body, fontSize: 14, color: colors.text, lineHeight: 20 },
});
