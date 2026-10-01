// Look and settings for Gig Guide. Change a colour here and it changes everywhere.

export const colors = {
  ink: '#1A1310',       // background
  surface: '#241A15',   // cards
  tabbar: '#1F1713',
  line: '#33271F',      // thin borders
  line2: '#3A2C24',     // button borders
  text: '#F2E6D6',
  soft: '#D8C9B6',
  body: '#CDBDAA',
  muted: '#A8988A',
  faint: '#8C7E71',
  accent: '#E0A15A',    // amber
};

export const fonts = {
  display: 'Anton_400Regular',
  serif: 'InstrumentSerif_400Regular',
  serifItalic: 'InstrumentSerif_400Regular_Italic',
  body: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  bold: 'SpaceGrotesk_600SemiBold',
};

// The four venues. Whammy Bar includes Double Whammy and the Public Bar.
export const VENUES = [
  { id: 'Goblin', area: 'Ponsonby', address: '134 Ponsonby Road, upstairs' },
  { id: 'Nami', area: 'Ponsonby', address: '115A Ponsonby Road' },
  { id: 'Neck of the Woods', area: 'K Road', address: '155B Karangahape Road, downstairs' },
  { id: 'Whammy Bar', area: 'K Road', address: '183 Karangahape Road, St Kevin\u2019s Arcade' },
];

export const GENRES = [
  'House', 'Techno', 'Disco', 'Soul', 'Funk', 'Boogie', 'Drum & bass', 'Jungle',
  'Garage', 'Bass', 'Dubstep', 'Hip-hop', 'Rap', 'R&B', 'Dancehall', 'Dub', 'Reggae',
  'Jazz', 'Footwork', 'Amapiano', 'Punk', 'Indie', 'Rock', 'Experimental',
];

export const BADGES = [
  'R18', 'All ages', 'Free entry', 'Door sales', 'Limited capacity', 'Safer space',
  'Queer night', 'Alcohol-free', 'Vinyl', 'One long set',
];

export const TIMES = [
  { key: 'any', label: 'Any time' },
  { key: 'morning', label: 'Morning' },
  { key: 'early', label: 'Early evening' },
  { key: 'late', label: 'Late' },
];

// Poster colours until promoters can upload their own poster image.
const POSTERS = [
  ['#1F3A3D', '#E0A15A'], ['#7A2E22', '#E0A15A'], ['#3D3A1F', '#C9935F'],
  ['#8A5A2B', '#F2E6D6'], ['#2B2440', '#D2714B'], ['#4F5F4A', '#E0A15A'],
];
export const posterFor = (key = '') => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return POSTERS[h % POSTERS.length];
};
