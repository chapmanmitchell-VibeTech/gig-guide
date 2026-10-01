import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts, VENUES } from '../theme';
import { dateLine, timeRange, formatTime } from '../dates';
import { Poster, Tag, Badge, Button, Heading, Label, shareGig, openLink } from '../components';

export default function GigScreen({ gig, saved, follows, back, go, toggleSave, toggleVenue }) {
  if (!gig) return null;
  const venue = VENUES.find((v) => v.id === gig.venue) || { address: '' };
  const followingVenue = follows.venues.includes(gig.venue);
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${gig.venue}, ${venue.address}, Auckland`)}`;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
      <View>
        <Poster gig={gig} height={400} big />
        <Pressable onPress={back} style={st.back} accessibilityLabel="Back">
          <Feather name="chevron-left" size={22} color={colors.text} />
        </Pressable>
        {!!gig.presentedBy && <Text style={st.presents}>{gig.presentedBy.toUpperCase()} PRESENTS</Text>}
      </View>

      <View style={st.body}>
        <View style={{ gap: 8 }}>
          <Label color={colors.accent}>{dateLine(gig.date)}</Label>
          <Text style={st.title}>{gig.title}</Text>
          <View style={st.tags}>{(gig.genres || []).map((g) => <Tag key={g} label={g} />)}</View>
        </View>

        <View style={{ gap: 8 }}>
          {gig.ticketUrl
            ? <Button kind="primary" label={`Get tickets${gig.price ? ` \u00b7 ${gig.price}` : ''}`} onPress={() => openLink(gig.ticketUrl)} />
            : <Button kind="primary" disabled label={gig.price ? `${gig.price} \u00b7 no ticket link yet` : 'No ticket link yet'} />}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button icon="share" label="Send to mates" onPress={() => shareGig(gig)} />
            <Button icon="bookmark" label={saved ? 'Saved' : 'Save'} onPress={toggleSave} />
          </View>
        </View>

        <View>
          <Heading title="Line-up" />
          {(gig.lineup || []).map((a, i) => (
            <View key={`${a.name}-${i}`} style={st.act}>
              <Text style={st.actTime}>{formatTime(a.time)}</Text>
              <Pressable style={{ flex: 1, gap: 2 }} onPress={() => go('artist', { name: a.name })}>
                <Text style={st.actName}>{a.name}</Text>
                {!!a.note && <Text style={st.actNote}>{a.note}</Text>}
              </Pressable>
              {!!a.listenUrl && (
                <Pressable onPress={() => openLink(a.listenUrl)} style={st.listen}>
                  <Feather name="play" size={12} color={colors.soft} />
                  <Text style={st.listenText}>Listen</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>

        <View style={st.grid}>
          <Info label="TIMES" value={timeRange(gig.start, gig.end)} />
          {!!gig.busyFrom && <Info label="GETS BUSY" value={`From ${formatTime(gig.busyFrom)}`} />}
          <Info label="ENTRY" value={gig.price || 'TBC'} />
          {(gig.badges || []).includes('Door sales') && <Info label="DOOR SALES" value="Yes, if not sold out" />}
        </View>

        {!!(gig.badges || []).length && <View style={st.tags}>{gig.badges.map((b) => <Badge key={b} label={b} />)}</View>}
        {!!gig.desc && <Text style={st.desc}>{gig.desc}</Text>}

        <View style={st.venue}>
          <Text style={st.venueName}>{gig.venue}</Text>
          <Text style={st.venueAddr}>{venue.address}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
            <Button label={followingVenue ? 'Following' : 'Follow venue'} onPress={() => toggleVenue(gig.venue)} />
            <Button icon="map-pin" label="Directions" onPress={() => openLink(maps)} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const Info = ({ label, value }) => (
  <View style={st.info}>
    <Text style={st.infoLabel}>{label}</Text>
    <Text style={st.infoValue}>{value}</Text>
  </View>
);

const st = StyleSheet.create({
  back: { position: 'absolute', top: 14, left: 16, width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(26,19,16,0.7)', alignItems: 'center', justifyContent: 'center' },
  presents: { position: 'absolute', top: 28, left: 72, fontFamily: fonts.body, fontSize: 11, letterSpacing: 2, color: colors.text },
  body: { padding: 20, gap: 22 },
  title: { fontFamily: fonts.bold, fontSize: 22, color: colors.text },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  act: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#2A201A' },
  actTime: { width: 60, fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  actName: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  actNote: { fontFamily: fonts.body, fontSize: 12.5, color: colors.muted },
  listen: { minHeight: 38, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: colors.line2,
    flexDirection: 'row', alignItems: 'center', gap: 6 },
  listenText: { fontFamily: fonts.body, fontSize: 12.5, color: colors.soft },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  info: { width: '48%', flexGrow: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    borderRadius: 14, padding: 14, gap: 4 },
  infoLabel: { fontFamily: fonts.body, fontSize: 11, letterSpacing: 1.6, color: colors.muted },
  infoValue: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  desc: { fontFamily: fonts.body, fontSize: 14, color: colors.body, lineHeight: 20 },
  venue: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16, gap: 2 },
  venueName: { fontFamily: fonts.serif, fontSize: 24, color: colors.text },
  venueAddr: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
});
