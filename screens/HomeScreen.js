import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { colors, fonts, VENUES, TIMES } from '../theme';
import { inWhen, timeOfDay, byDateTime, dateHeading, dateLine, timeRange, formatTime, dayShort } from '../dates';
import { Chip, GigCard, Poster, Tag, Badge, Label, Heading } from '../components';

const WHEN = [
  { key: 'tonight', label: 'Tonight' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'weekend', label: 'Weekend' },
];

export default function HomeScreen({ gigs, follows, saved, go, toggleSave }) {
  const [when, setWhen] = useState('tonight');
  const [venue, setVenue] = useState('all');
  const [time, setTime] = useState('any');

  const list = useMemo(() => gigs
    .filter((g) => inWhen(g.date, when))
    .filter((g) => venue === 'all' || g.venue === venue)
    .filter((g) => time === 'any' || timeOfDay(g.start) === time)
    .sort(byDateTime), [gigs, when, venue, time]);

  const pick = when === 'tonight' ? (list.find((g) => g.pick) || list[0]) : null;
  const rest = pick ? list.filter((g) => g.id !== pick.id) : list;

  const groups = [];
  rest.forEach((g) => {
    const h = dateHeading(g.date);
    if (!groups.length || groups[groups.length - 1].heading !== h) groups.push({ heading: h, date: g.date, gigs: [] });
    groups[groups.length - 1].gigs.push(g);
  });

  // Who you follow, and whether they're on soon.
  const upcoming = gigs.filter((g) => inWhen(g.date, 'all')).sort(byDateTime);
  const followingRow = follows.names.map((name) => {
    const next = upcoming.find((g) => g.presentedBy === name || (g.lineup || []).some((a) => a.name.includes(name)));
    return { name, next };
  });

  return (
    <ScrollView contentContainerStyle={st.wrap} keyboardShouldPersistTaps="handled">
      <View style={st.glow} />
      <View style={st.header}>
        <Label color={colors.accent}>PONSONBY &amp; K ROAD</Label>
        <Text style={st.title}>Gig <Text style={st.titleItalic}>Guide</Text></Text>
      </View>

      <View style={st.whenRow}>
        {WHEN.map((w) => (
          <Pressable key={w.key} onPress={() => setWhen(w.key)} style={[st.whenBtn, when === w.key && st.whenOn]}>
            <Text style={[st.whenText, when === w.key && st.whenTextOn]}>{w.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={st.chips}>
        <Chip label="All venues" on={venue === 'all'} accent onPress={() => setVenue('all')} />
        {VENUES.map((v) => (
          <Chip key={v.id} label={v.id === 'Whammy Bar' ? 'Whammy' : v.id} on={venue === v.id} accent
            onPress={() => setVenue(venue === v.id ? 'all' : v.id)} />
        ))}
      </View>
      <View style={[st.chips, { marginTop: 8 }]}>
        {TIMES.map((t) => <Chip key={t.key} small label={t.label} on={time === t.key} onPress={() => setTime(t.key)} />)}
      </View>

      {!!follows.names.length && (
        <View style={st.section}>
          <Label>DJS &amp; CREWS YOU FOLLOW</Label>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.following}>
            {followingRow.map(({ name, next }) => (
              <Pressable key={name} onPress={() => go('artist', { name })} style={st.person}>
                <View style={[st.avatar, next && { borderColor: colors.accent }]}>
                  <Text style={st.avatarText}>{initials(name)}</Text>
                </View>
                <Text style={st.personName} numberOfLines={2}>{name}</Text>
                <Text style={[st.personStatus, next && { color: colors.accent }]}>
                  {next ? dayShort(next.date) : 'No dates'}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {!!pick && (
        <View style={st.section}>
          <Label>TONIGHT&rsquo;S PICK</Label>
          <Pressable onPress={() => go('gig', { id: pick.id })} style={st.pick}>
            <View>
              <Poster gig={pick} height={280} big />
              <Text style={st.pickVenue}>{pick.venue.toUpperCase()} &middot; {dateLine(pick.date)}</Text>
            </View>
            <View style={st.pickBody}>
              {!!pick.presentedBy && <Text style={st.presented}>PRESENTED BY {pick.presentedBy.toUpperCase()}</Text>}
              <Text style={st.pickLineup}>{(pick.lineup || []).map((a) => a.name).join(', ')}</Text>
              <Text style={st.pickMeta}>
                {timeRange(pick.start, pick.end)}
                {pick.busyFrom ? <Text style={{ color: colors.accent }}> &middot; Busy from {formatTime(pick.busyFrom)}</Text> : null}
                {pick.price ? ` \u00b7 ${pick.price}` : ''}
              </Text>
              <View style={st.tags}>
                {(pick.genres || []).map((g) => <Tag key={g} label={g} />)}
                {(pick.badges || []).map((b) => <Badge key={b} label={b} />)}
              </View>
            </View>
          </Pressable>
        </View>
      )}

      <View style={st.section}>
        {!list.length && (
          <View style={st.empty}>
            <Text style={st.emptyTitle}>Nothing on</Text>
            <Text style={st.emptyBody}>Try another night, venue or time.</Text>
          </View>
        )}
        {groups.map((grp) => (
          <View key={grp.heading} style={{ marginBottom: 12 }}>
            <Heading title={pick && grp.heading === 'Tonight' ? 'Also tonight' : grp.heading}
              sub={dateLine(grp.date).replace(/^(TONIGHT|TOMORROW) \u00b7 /, '')} />
            {grp.gigs.map((g) => (
              <GigCard key={g.id} gig={g} saved={saved.includes(g.id)}
                onOpen={() => go('gig', { id: g.id })} onSave={() => toggleSave(g.id)} />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const initials = (name) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const st = StyleSheet.create({
  wrap: { paddingBottom: 24 },
  glow: { position: 'absolute', top: -150, left: -90, width: 440, height: 320, borderRadius: 220,
    backgroundColor: colors.accent, opacity: 0.08 },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 14, gap: 4 },
  title: { fontFamily: fonts.serif, fontSize: 46, color: colors.text, lineHeight: 50 },
  titleItalic: { fontFamily: fonts.serifItalic, color: colors.accent },

  whenRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 20 },
  whenBtn: { flex: 1, minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: colors.line2,
    alignItems: 'center', justifyContent: 'center' },
  whenOn: { backgroundColor: colors.text, borderColor: colors.text },
  whenText: { fontFamily: fonts.body, fontSize: 14, color: colors.soft },
  whenTextOn: { fontFamily: fonts.bold, color: colors.ink },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: 20, marginTop: 12 },
  section: { paddingHorizontal: 20, marginTop: 22, gap: 10 },

  following: { gap: 14, paddingRight: 20 },
  person: { width: 66, alignItems: 'center', gap: 5 },
  avatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.surface, borderWidth: 2,
    borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.display, fontSize: 20, color: colors.text },
  personName: { fontFamily: fonts.body, fontSize: 11, color: colors.soft, textAlign: 'center', lineHeight: 13 },
  personStatus: { fontFamily: fonts.body, fontSize: 10.5, color: colors.faint },

  pick: { borderRadius: 18, overflow: 'hidden', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line },
  pickVenue: { position: 'absolute', top: 18, left: 18, fontFamily: fonts.body, fontSize: 11, letterSpacing: 2, color: colors.text },
  pickBody: { padding: 16, gap: 8 },
  presented: { fontFamily: fonts.body, fontSize: 10.5, letterSpacing: 1.4, color: colors.muted },
  pickLineup: { fontFamily: fonts.bold, fontSize: 17, color: colors.text, lineHeight: 22 },
  pickMeta: { fontFamily: fonts.body, fontSize: 13.5, color: colors.muted },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },

  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 26, color: colors.text },
  emptyBody: { fontFamily: fonts.body, fontSize: 14, color: colors.muted, marginTop: 4 },
});
