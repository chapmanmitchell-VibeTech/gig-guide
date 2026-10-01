import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { colors, fonts, VENUES, GENRES, BADGES } from '../theme';
import { toISODate, toHHMM, parseLocalDate, dateLine, formatTime } from '../dates';
import { Chip, Button, Label } from '../components';

const blank = () => ({
  title: '', presentedBy: '', venue: '', date: '', start: '', end: '', busyFrom: '',
  price: '', ticketUrl: '', genres: [], badges: [], desc: '',
  lineup: [{ name: '', time: '', note: '', listenUrl: '' }],
});

export default function AddGigScreen({ onAdd }) {
  const [f, setF] = useState(blank());
  const [picker, setPicker] = useState(null); // { field, mode, index? }
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setF((x) => ({ ...x, [k]: v })); setErrors((e) => ({ ...e, [k]: null })); };
  const toggle = (k, v) => set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);
  const setAct = (i, k, v) => set('lineup', f.lineup.map((a, j) => (j === i ? { ...a, [k]: v } : a)));

  const onPicked = (event, value) => {
    const p = picker;
    setPicker(null);
    if (event.type !== 'set' || !value || !p) return;
    if (p.field === 'date') set('date', toISODate(value));
    else if (p.field === 'act') setAct(p.index, 'time', toHHMM(value));
    else set(p.field, toHHMM(value));
  };

  const pickerValue = () => {
    if (!picker) return new Date();
    if (picker.field === 'date') return f.date ? parseLocalDate(f.date) : new Date();
    const t = picker.field === 'act' ? f.lineup[picker.index].time : f[picker.field];
    const d = new Date();
    if (t) { const [h, m] = t.split(':'); d.setHours(+h, +m, 0, 0); } else d.setHours(21, 0, 0, 0);
    return d;
  };

  const submit = async () => {
    const e = {};
    if (!f.title.trim()) e.title = 'Give the night a name.';
    if (!f.venue) e.venue = 'Pick a venue.';
    if (!f.date) e.date = 'Pick a date.';
    if (!f.start) e.start = 'Pick a start time.';
    setErrors(e);
    if (Object.keys(e).length) return;
    const lineup = f.lineup.filter((a) => a.name.trim()).map((a) => ({ ...a, name: a.name.trim(), listenUrl: a.listenUrl.trim() }));
    const ok = await onAdd({
      ...f, title: f.title.trim(), presentedBy: f.presentedBy.trim(), price: f.price.trim(),
      ticketUrl: f.ticketUrl.trim(), desc: f.desc.trim(),
      lineup: lineup.length ? lineup : [{ name: f.title.trim(), time: f.start, note: '', listenUrl: '' }],
    });
    if (ok) setF(blank()); else Alert.alert('Couldn\u2019t save that', 'Try again.');
  };

  return (
    <ScrollView contentContainerStyle={st.wrap} keyboardShouldPersistTaps="handled">
      <Text style={st.title}>Add a gig</Text>

      <Field label="Name of the night" error={errors.title}>
        <Input value={f.title} onChangeText={(v) => set('title', v)} placeholder="e.g. Music First" />
      </Field>
      <Field label="Presented by (crew or promoter)">
        <Input value={f.presentedBy} onChangeText={(v) => set('presentedBy', v)} placeholder="e.g. Morning People" />
      </Field>

      <Field label="Venue" error={errors.venue}>
        <View style={st.grid}>
          {VENUES.map((v) => (
            <Pressable key={v.id} onPress={() => set('venue', v.id)} style={[st.venue, f.venue === v.id && st.venueOn]}>
              <Text style={[st.venueName, f.venue === v.id && { color: colors.ink }]}>{v.id}</Text>
              <Text style={[st.venueArea, f.venue === v.id && { color: 'rgba(26,19,16,0.6)' }]}>{v.area}</Text>
            </Pressable>
          ))}
        </View>
      </Field>

      <Field label="Date" error={errors.date}>
        <PickBox text={f.date ? dateLine(f.date) : 'Pick a date'} icon="calendar"
          onPress={() => setPicker({ field: 'date', mode: 'date' })} />
      </Field>
      <View style={st.row}>
        <View style={{ flex: 1 }}>
          <Field label="Starts" error={errors.start}>
            <PickBox text={f.start ? formatTime(f.start) : 'Time'} icon="clock"
              onPress={() => setPicker({ field: 'start', mode: 'time' })} />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Finishes">
            <PickBox text={f.end ? formatTime(f.end) : 'Late'} icon="clock"
              onPress={() => setPicker({ field: 'end', mode: 'time' })} />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Gets busy">
            <PickBox text={f.busyFrom ? formatTime(f.busyFrom) : '\u2014'} icon="users"
              onPress={() => setPicker({ field: 'busyFrom', mode: 'time' })} />
          </Field>
        </View>
      </View>

      <Field label="Line-up">
        {f.lineup.map((a, i) => (
          <View key={i} style={st.act}>
            <View style={st.row}>
              <View style={{ flex: 1 }}>
                <Input value={a.name} onChangeText={(v) => setAct(i, 'name', v)} placeholder="DJ or act, e.g. Aunty El b2b Tradie" />
              </View>
              <Pressable onPress={() => setPicker({ field: 'act', mode: 'time', index: i })} style={st.setTime}>
                <Text style={st.setTimeText}>{a.time ? formatTime(a.time) : 'Set time'}</Text>
              </Pressable>
            </View>
            <Input value={a.listenUrl} onChangeText={(v) => setAct(i, 'listenUrl', v)}
              placeholder="Listen link (SoundCloud, Mixcloud, Bandcamp)" autoCapitalize="none" keyboardType="url" />
            {f.lineup.length > 1 && (
              <Pressable onPress={() => set('lineup', f.lineup.filter((_, j) => j !== i))} hitSlop={6}>
                <Text style={st.remove}>Remove</Text>
              </Pressable>
            )}
          </View>
        ))}
        <Pressable onPress={() => set('lineup', [...f.lineup, { name: '', time: '', note: '', listenUrl: '' }])} style={st.addAct}>
          <Feather name="plus" size={16} color={colors.accent} />
          <Text style={st.addActText}>Add another act</Text>
        </Pressable>
      </Field>

      <Field label="Genres (pick a few)">
        <View style={st.chips}>{GENRES.map((g) => <Chip key={g} small label={g} on={f.genres.includes(g)} onPress={() => toggle('genres', g)} />)}</View>
      </Field>
      <Field label="Good to know">
        <View style={st.chips}>{BADGES.map((b) => <Chip key={b} small label={b} on={f.badges.includes(b)} onPress={() => toggle('badges', b)} />)}</View>
      </Field>

      <View style={st.row}>
        <View style={{ flex: 1 }}>
          <Field label="Price"><Input value={f.price} onChangeText={(v) => set('price', v)} placeholder="$20 or Free" /></Field>
        </View>
        <View style={{ flex: 2 }}>
          <Field label="Ticket link">
            <Input value={f.ticketUrl} onChangeText={(v) => set('ticketUrl', v)} placeholder="undertheradar, Humanitix, RA…" autoCapitalize="none" keyboardType="url" />
          </Field>
        </View>
      </View>

      <Field label={`Anything else  ${f.desc.length}/200`}>
        <Input value={f.desc} onChangeText={(v) => set('desc', v)} multiline maxLength={200}
          placeholder="Door policy, what to expect, the kaupapa of the night." style={{ minHeight: 80, textAlignVertical: 'top' }} />
      </Field>

      <View style={{ flexDirection: 'row' }}><Button kind="primary" label="Add gig" onPress={submit} /></View>

      {!!picker && (
        <DateTimePicker value={pickerValue()} mode={picker.mode} is24Hour={false}
          minimumDate={picker.mode === 'date' ? new Date() : undefined} onChange={onPicked} />
      )}
    </ScrollView>
  );
}

const Field = ({ label, error, children }) => (
  <View style={{ marginBottom: 16, gap: 6 }}>
    <Label>{label.toUpperCase()}</Label>
    {children}
    {!!error && <Text style={st.error}>{error}</Text>}
  </View>
);
const Input = ({ style, ...p }) => (
  <TextInput placeholderTextColor={colors.faint} style={[st.input, style]} {...p} />
);
const PickBox = ({ text, icon, onPress }) => (
  <Pressable onPress={onPress} style={st.pick}>
    <Feather name={icon} size={15} color={colors.muted} />
    <Text style={st.pickText} numberOfLines={1}>{text}</Text>
  </Pressable>
);

const st = StyleSheet.create({
  wrap: { padding: 20, paddingBottom: 40 },
  title: { fontFamily: fonts.serif, fontSize: 40, color: colors.text, marginBottom: 18 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line2, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, color: colors.text, fontFamily: fonts.body, fontSize: 15 },
  row: { flexDirection: 'row', gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  venue: { flexBasis: '47%', flexGrow: 1, borderWidth: 1, borderColor: colors.line2, borderRadius: 12,
    paddingVertical: 10, paddingHorizontal: 12, backgroundColor: colors.surface },
  venueOn: { backgroundColor: colors.text, borderColor: colors.text },
  venueName: { fontFamily: fonts.bold, fontSize: 14, color: colors.text },
  venueArea: { fontFamily: fonts.body, fontSize: 11.5, color: colors.muted, marginTop: 2 },
  pick: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.line2, borderRadius: 12, paddingHorizontal: 12 },
  pickText: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.text },
  act: { gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.line, marginBottom: 8 },
  setTime: { minHeight: 46, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.line2,
    justifyContent: 'center' },
  setTimeText: { fontFamily: fonts.medium, fontSize: 13, color: colors.soft },
  remove: { fontFamily: fonts.body, fontSize: 12.5, color: colors.faint },
  addAct: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40 },
  addActText: { fontFamily: fonts.bold, fontSize: 14, color: colors.accent },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  error: { fontFamily: fonts.body, fontSize: 12, color: '#E07A5F' },
});
