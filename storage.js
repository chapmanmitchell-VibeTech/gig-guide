// Saving on the phone. Later: swap these functions for a shared online database.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { seedGigs, defaultFollows } from './seed';

const K = { gigs: 'gigguide.v2.gigs', follows: 'gigguide.v2.follows', saved: 'gigguide.v2.saved' };

const get = async (key, fallback) => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return fallback;
};
const set = async (key, value) => {
  try { await AsyncStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
};

export const loadAll = async () => {
  let gigs = await get(K.gigs, null);
  if (!Array.isArray(gigs)) { gigs = seedGigs(); await set(K.gigs, gigs); }
  const follows = await get(K.follows, defaultFollows);
  const saved = await get(K.saved, []);
  return { gigs, follows, saved };
};

export const saveGigs = (gigs) => set(K.gigs, gigs);
export const saveFollows = (follows) => set(K.follows, follows);
export const saveSaved = (saved) => set(K.saved, saved);
export const newId = () => `g-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
