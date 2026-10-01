// Date and time helpers.

const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const pad = (n) => (n < 10 ? '0' + n : String(n));

export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const toHHMM = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const startOfDay = (d) => { const r = new Date(d); r.setHours(0, 0, 0, 0); return r; };
export const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
export const parseLocalDate = (iso) => {
  const [y, m, day] = iso.split('-').map((x) => parseInt(x, 10));
  return new Date(y, m - 1, day);
};
export const daysFromToday = (iso) =>
  Math.round((startOfDay(parseLocalDate(iso)) - startOfDay(new Date())) / 86400000);

export const dayNumber = (iso) => parseLocalDate(iso).getDate();
export const monthShort = (iso) => MONTHS[parseLocalDate(iso).getMonth()];
export const dayShort = (iso) => {
  const diff = daysFromToday(iso);
  if (diff === 0) return 'Tonight';
  if (diff === 1) return 'Tomorrow';
  return DAYS[parseLocalDate(iso).getDay()];
};
export const dateLine = (iso) => {
  const d = parseLocalDate(iso);
  const lead = daysFromToday(iso) === 0 ? 'TONIGHT \u00b7 ' : daysFromToday(iso) === 1 ? 'TOMORROW \u00b7 ' : '';
  return `${lead}${DAYS[d.getDay()].toUpperCase()} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
};
export const dateHeading = (iso) => {
  const diff = daysFromToday(iso);
  if (diff === 0) return 'Tonight';
  if (diff === 1) return 'Tomorrow';
  const d = parseLocalDate(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()}`;
};

// "20:30" -> "8:30pm", "00:00" -> "midnight"
export const formatTime = (t) => {
  if (!t) return '';
  const [hRaw, m] = t.split(':');
  const h = parseInt(hRaw, 10);
  if (h === 0 && m === '00') return 'midnight';
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m === '00' ? '' : ':' + m}${ampm}`;
};
export const timeRange = (start, end) =>
  end ? `${formatTime(start)} \u2013 ${formatTime(end)}` : `From ${formatTime(start)}`;

// Morning = before 11am, early evening = before 9pm, late = 9pm on.
export const timeOfDay = (start) => {
  const h = parseInt((start || '20:00').split(':')[0], 10);
  if (h < 11) return 'morning';
  if (h < 21) return 'early';
  return 'late';
};

export const inWhen = (iso, when) => {
  const diff = daysFromToday(iso);
  if (diff < 0) return false;
  if (when === 'tonight') return diff === 0;
  if (when === 'tomorrow') return diff === 1;
  if (when === 'weekend') {
    const day = parseLocalDate(iso).getDay();
    return diff <= 7 && (day === 5 || day === 6 || day === 0);
  }
  return true;
};

export const byDateTime = (a, b) =>
  a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date);
