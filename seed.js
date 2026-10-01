// Starting data so the app isn't empty. Items marked "Sample listing" are made up.
import { toISODate, addDays } from './dates';

const day = (n) => toISODate(addDays(new Date(), n));
const SAMPLE = 'Sample listing \u2014 replace with a real one.';

export const seedGigs = () => [
  {
    id: 'seed-1', pick: true, title: 'Low End Theory', presentedBy: 'Sample crew',
    venue: 'Neck of the Woods', date: day(0), start: '22:00', end: '03:00', busyFrom: '00:00',
    price: '$20', ticketUrl: '', genres: ['Drum & bass', 'Jungle'], badges: ['R18', 'Door sales'],
    lineup: [
      { name: 'Mika Tane', time: '22:00', note: 'Warm-up, liquid', listenUrl: '' },
      { name: 'Deckard', time: '23:30', note: 'Jungle and rollers', listenUrl: '' },
      { name: 'Kaia R\u016brangi b2b Deckard', time: '01:00', note: 'Back to back till close', listenUrl: '' },
    ],
    desc: SAMPLE,
  },
  {
    id: 'real-1', title: 'Sweet Treats Punk Night #62', presentedBy: 'Whammy Bar',
    venue: 'Whammy Bar', date: '2026-09-24', start: '19:30', end: '', busyFrom: '',
    price: '', ticketUrl: '', genres: ['Punk'], badges: ['R18'],
    lineup: [{ name: 'Line-up TBC', time: '', note: '', listenUrl: '' }], desc: '',
  },
  {
    id: 'seed-2', title: 'Goblin Thursdays', presentedBy: 'Goblin',
    venue: 'Goblin', date: day(0), start: '20:00', end: '', busyFrom: '22:00',
    price: 'Free', ticketUrl: '', genres: ['House', 'Disco'], badges: ['Free entry', 'One long set'],
    lineup: [{ name: 'Selector Mo', time: '20:00', note: 'All night long', listenUrl: '' }], desc: SAMPLE,
  },
  {
    id: 'real-2', title: 'Christoph El Truento', presentedBy: 'Whammy Public Bar',
    venue: 'Whammy Bar', date: '2026-09-25', start: '21:00', end: '', busyFrom: '',
    price: '', ticketUrl: '', genres: ['Dub', 'Reggae', 'Jazz', 'Hip-hop'], badges: ['R18', 'Vinyl'],
    lineup: [{ name: 'Christoph El Truento', time: '21:00', note: 'Needle drops at 9pm, party goes late',
      listenUrl: 'https://christoph-el-truento.bandcamp.com/' }],
    desc: 'In the Public Bar at Whammy.',
  },
  {
    id: 'seed-3', title: 'Nami Fridays', presentedBy: 'Nami',
    venue: 'Nami', date: day(1), start: '19:00', end: '01:00', busyFrom: '21:00',
    price: 'Free', ticketUrl: '', genres: ['Disco', 'Soul', 'Boogie'], badges: ['Free entry', 'Vinyl'],
    lineup: [{ name: 'Resident selectors', time: '19:00', note: 'On vinyl', listenUrl: '' }], desc: SAMPLE,
  },
  {
    id: 'seed-4', title: 'Pressure Point', presentedBy: 'Sample crew',
    venue: 'Neck of the Woods', date: day(2), start: '21:00', end: '03:00', busyFrom: '23:00',
    price: '$25', ticketUrl: '', genres: ['Hip-hop', 'Rap'], badges: ['R18', 'Safer space'],
    lineup: [
      { name: 'DJ Rua', time: '21:00', note: '', listenUrl: '' },
      { name: 'Lil Moana', time: '23:00', note: 'Live set', listenUrl: '' },
    ],
    desc: SAMPLE,
  },
  {
    id: 'seed-5', title: 'Morning People', presentedBy: 'Morning People',
    venue: 'Neck of the Woods', date: day(6), start: '06:30', end: '09:00', busyFrom: '',
    price: '$25', ticketUrl: '', genres: ['House', 'Techno'], badges: ['Alcohol-free'],
    lineup: [{ name: 'Guest DJ TBC', time: '06:30', note: 'Before-work rave, coffee included', listenUrl: '' }],
    desc: SAMPLE,
  },
];

// DJ and crew pages. Only facts we checked; add more as you go.
export const PROFILES = {
  'Christoph El Truento': {
    kind: 'DJ \u00b7 producer', sounds: ['Dub', 'Reggae', 'Jazz', 'Hip-hop', 'Footwork'],
    links: [{ label: 'Bandcamp', url: 'https://christoph-el-truento.bandcamp.com/' }],
    plays: ['Whammy Bar', 'Nami'], with: ['Rubi Du', 'Dylan Biscuit', 'Manuel Bundy'],
  },
  'Frank Booker': {
    kind: 'DJ \u00b7 producer', sounds: ['Disco', 'House', 'Boogie', 'Soul', 'Funk'],
    links: [], plays: ['Whammy Bar'], with: ['Samuel Harmony'],
  },
  'AJ Honeysuckle': {
    kind: 'DJ', sounds: ['Club', 'Bass'], links: [],
    plays: ['Neck of the Woods', 'Whammy Bar'], with: ['Dylan Biscuit'],
  },
  GoldTooth: {
    kind: 'DJ \u00b7 broadcaster', sounds: ['Garage', 'Dancehall', 'Bass', 'Global club'],
    links: [{ label: 'Instagram', url: 'https://www.instagram.com/_goldtooth_/' }],
    plays: ['Goblin', 'Neck of the Woods'], with: [],
  },
  'Morning People': {
    kind: 'Crew \u00b7 morning raves', sounds: ['House', 'Techno'], links: [],
    plays: ['Neck of the Woods'], with: [],
  },
};

export const defaultFollows = {
  names: ['Christoph El Truento', 'Frank Booker', 'AJ Honeysuckle', 'GoldTooth', 'Morning People'],
  venues: [],
};
