// Shared building blocks: posters, chips, gig cards, buttons.
import React from 'react';
import { View, Text, Pressable, StyleSheet, Share, Linking, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts, posterFor } from './theme';
import { dayNumber, monthShort, timeRange, dateLine, formatTime } from './dates';

export function Poster({ gig, height = 108, width, big = false }) {
  const [bg, shape] = posterFor(gig.title + gig.venue);
  const size = big ? height * 0.85 : height * 0.65;
  return (
    <View style={[s.poster, { height, width, backgroundColor: bg }]}>
      <View style={[s.posterSun, { width: size, height: size, borderRadius: size / 2, backgroundColor: shape,
        top: -size * 0.2, right: -size * 0.25 }]} />
      {big && <View style={[s.posterRing, { width: size * 0.55, height: size * 0.55, borderRadius: size,
        borderColor: bg, top: size * 0.12, right: size * 0.05 }]} />}
      <Text numberOfLines={big ? 3 : 3}
        style={[s.posterText, { fontSize: big ? 56 : 16, lineHeight: big ? 54 : 16 }]}>
        {gig.title.toUpperCase()}
      </Text>
    </View>
  );
}

export function Chip({ label, on, onPress, accent = false, small = false }) {
  return (
    <Pressable onPress={onPress} hitSlop={4}
      style={[s.chip, small && s.chipSmall, on && (accent ? s.chipAccent : s.chipOn)]}>
      <Text style={[s.chipText, small && { fontSize: 12 }, on && (accent ? s.chipAccentText : s.chipOnText)]}>
        {label}
      </Text>
    </Pressable>
  );
}

export const Tag = ({ label }) => (
  <View style={s.tag}><Text style={s.tagText}>{label}</Text></View>
);
export const Badge = ({ label }) => (
  <View style={s.badge}><Text style={s.badgeText}>{label}</Text></View>
);

export const Label = ({ children, color }) => (
  <Text style={[s.label, color && { color }]}>{children}</Text>
);

export const Heading = ({ title, sub }) => (
  <View style={s.heading}>
    <Text style={s.headingTitle}>{title}</Text>
    {!!sub && <Text style={s.headingSub}>{sub}</Text>}
  </View>
);

export function Button({ label, onPress, kind = 'outline', icon, disabled }) {
  const primary = kind === 'primary';
  return (
    <Pressable onPress={onPress} disabled={disabled}
      style={[s.btn, primary ? s.btnPrimary : s.btnOutline, disabled && { opacity: 0.45 }]}>
      {!!icon && <Feather name={icon} size={16} color={primary ? colors.ink : colors.text} />}
      <Text style={[s.btnText, primary && s.btnPrimaryText]}>{label}</Text>
    </Pressable>
  );
}

export const shareGig = (gig) =>
  Share.share({
    message: `${gig.title} \u2014 ${gig.venue}, ${dateLine(gig.date).toLowerCase()}, ${timeRange(gig.start, gig.end)}.` +
      (gig.ticketUrl ? ` Tickets: ${gig.ticketUrl}` : ''),
  }).catch(() => {});

export const openLink = (url) => {
  if (!url) return;
  Linking.openURL(url).catch(() => Alert.alert('Couldn\u2019t open that link'));
};

export const firstListen = (gig) => (gig.lineup || []).find((a) => a.listenUrl)?.listenUrl || '';

export function GigCard({ gig, saved, onOpen, onSave }) {
  const listen = firstListen(gig);
  const acts = (gig.lineup || []).map((a) => a.name).filter(Boolean);
  const lineup = acts.length && acts[0] !== gig.title ? acts.join(', ') : '';
  return (
    <View style={s.card}>
      <Pressable onPress={onOpen} style={s.cardTop}>
        <Poster gig={gig} height={108} width={84} />
        <View style={s.cardBody}>
          {!!gig.presentedBy && <Text style={s.presented}>{gig.presentedBy.toUpperCase()}</Text>}
          <Text style={s.cardTime}>{timeRange(gig.start, gig.end)}</Text>
          <Text style={s.cardTitle}>{gig.title}</Text>
          {!!lineup && <Text style={s.cardLineup} numberOfLines={2}>{lineup}</Text>}
          <Text style={s.cardMeta}>{gig.venue}{gig.price ? ` \u00b7 ${gig.price}` : ''}</Text>
          <View style={s.row}>{(gig.genres || []).map((g) => <Tag key={g} label={g} />)}</View>
          {!!(gig.badges || []).length && (
            <View style={s.row}>{gig.badges.map((b) => <Badge key={b} label={b} />)}</View>
          )}
        </View>
      </Pressable>
      <View style={s.actions}>
        <Action icon="headphones" label="Listen" onPress={() => (listen ? openLink(listen) : onOpen())} />
        <Action icon="share" label="Send to mates" onPress={() => shareGig(gig)} />
        <Action icon="bookmark" label={saved ? 'Saved' : 'Save'} on={saved} onPress={onSave} />
      </View>
    </View>
  );
}

const Action = ({ icon, label, onPress, on }) => (
  <Pressable onPress={onPress} style={s.action} hitSlop={4}>
    <Feather name={icon} size={16} color={on ? colors.accent : colors.soft} />
    <Text style={[s.actionText, on && { color: colors.accent }]}>{label}</Text>
  </Pressable>
);

export function DateBlock({ iso }) {
  return (
    <View style={s.dateBlock}>
      <Text style={s.dateDay}>{dayNumber(iso)}</Text>
      <Text style={s.dateMonth}>{monthShort(iso)}</Text>
    </View>
  );
}

export { formatTime };

const s = StyleSheet.create({
  poster: { borderRadius: 10, overflow: 'hidden', justifyContent: 'flex-end', padding: 8 },
  posterSun: { position: 'absolute', opacity: 0.9 },
  posterRing: { position: 'absolute', borderWidth: 12 },
  posterText: { fontFamily: fonts.display, color: colors.text },

  chip: { minHeight: 36, paddingHorizontal: 13, borderRadius: 999, borderWidth: 1, borderColor: colors.line2,
    justifyContent: 'center' },
  chipSmall: { minHeight: 34, paddingHorizontal: 12 },
  chipOn: { backgroundColor: colors.line, borderColor: colors.line },
  chipAccent: { borderColor: colors.accent },
  chipText: { fontFamily: fonts.body, fontSize: 12.5, color: colors.soft },
  chipOnText: { fontFamily: fonts.bold, color: colors.text },
  chipAccentText: { fontFamily: fonts.bold, color: colors.accent },

  tag: { backgroundColor: colors.line, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3 },
  tagText: { fontFamily: fonts.body, fontSize: 11, color: colors.soft },
  badge: { borderWidth: 1, borderColor: '#4A3A2F', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontFamily: fonts.body, fontSize: 10.5, color: colors.body },

  label: { fontFamily: fonts.bold, fontSize: 11, letterSpacing: 2, color: colors.muted },
  heading: { flexDirection: 'row', alignItems: 'baseline', gap: 10, paddingBottom: 8,
    borderBottomWidth: 1, borderBottomColor: colors.line, marginBottom: 12 },
  headingTitle: { fontFamily: fonts.serif, fontSize: 25, color: colors.text },
  headingSub: { fontFamily: fonts.body, fontSize: 11.5, letterSpacing: 1.6, color: colors.muted },

  btn: { minHeight: 48, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingHorizontal: 14, flex: 1 },
  btnPrimary: { backgroundColor: colors.accent },
  btnOutline: { borderWidth: 1, borderColor: colors.line2 },
  btnText: { fontFamily: fonts.medium, fontSize: 14.5, color: colors.text },
  btnPrimaryText: { fontFamily: fonts.bold, color: colors.ink, fontSize: 16 },

  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16,
    padding: 12, marginBottom: 12 },
  cardTop: { flexDirection: 'row', gap: 12 },
  cardBody: { flex: 1, gap: 4 },
  presented: { fontFamily: fonts.body, fontSize: 10.5, letterSpacing: 1.4, color: colors.muted },
  cardTime: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.accent },
  cardTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.text, lineHeight: 20 },
  cardLineup: { fontFamily: fonts.body, fontSize: 13, color: colors.body, lineHeight: 18 },
  cardMeta: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  actions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.line, marginTop: 10, paddingTop: 4 },
  action: { flex: 1, minHeight: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actionText: { fontFamily: fonts.body, fontSize: 13, color: colors.soft },

  dateBlock: { width: 52, alignItems: 'center' },
  dateDay: { fontFamily: fonts.display, fontSize: 28, color: colors.text, lineHeight: 30 },
  dateMonth: { fontFamily: fonts.body, fontSize: 11, letterSpacing: 1.4, color: colors.muted },
});
