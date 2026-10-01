# CLAUDE.md — Gig Guide

Read this first. It's the project brief, copied from the planning doc:
https://claude.ai/code/artifact/d96f83c0-6f5c-47b4-9aad-239fad2efdfd
If this file and the doc disagree, the doc wins — ask the user.

## Notes for Claude Code

- **Talk to the user in short replies and plain words.** They are not a coder. One step at a time.
- **Stack:** Expo (SDK 57), React Native, JavaScript. No navigation library; tabs and a simple screen stack live in `App.js`.
- **Files:** `App.js` (fonts, tabs, screen stack, saving), `theme.js` (colours, fonts, the four venues, genres, badges),
  `dates.js` (date and time helpers), `seed.js` (starting gigs and DJ/crew profiles — samples are marked),
  `storage.js` (saves on the phone with AsyncStorage — swap this for the shared database later),
  `components.js` (posters, chips, gig cards), and `screens/` (Home, Gig, Artist, Saved, Venues, AddGig).
- **Libraries:** expo-font + @expo-google-fonts (Anton, Instrument Serif, Space Grotesk), expo-navigation-bar
  (hides the Android home bar), @react-native-community/datetimepicker, @expo/vector-icons (Feather).
- **Running it:** the user tests on an Android phone with Expo Go on the same wifi. Prefer Expo Go over
  local Android builds. When an installable build is needed, use Expo cloud build (EAS), not a local SDK.
- **Target look:** the design mockups linked below. Warm, dark brown, amber accent, light grain,
  serif title, big posters.
- **Don't** add venues beyond the four, or features not listed in "What's next", without asking.


Sep 24, 2026 · @Mitchell

## What it is

A phone app listing what's on at four venues in Tāmaki Makaurau: Goblin and Nami on Ponsonby Road, Neck of the Woods and Whammy Bar on K Road. Punters browse gigs and follow their favourite DJs and crews. Promoters add gigs fast, by typing or pasting an Instagram post.

It's a passion project. Android first, then iPhone.

## Who it's for

Three of the four venues are DJ-led, so this is mostly a club and DJ guide, with Whammy as the band room. These characters come from simulated research, not real interviews.

| Who | What they're into | What they need from the app |
| --- | --- | --- |
| Kiri, 26 | Club and hip-hop DJs, Neck of the Woods | Know the moment a DJ she follows is booked |
| Ben, 38 | Disco and house, Music First crowd, Nami and Goblin | Set lengths, finish times, plan ahead |
| Priya, 31 | Morning People raves before work | A morning filter, alcohol-free nights |
| Tane, 24 | Crate digger, listens to 95bFM | Hear a DJ before paying |
| Rua, 25 | Punk and indie at Whammy | Line-up with set times |
| Promoters and crews | Already post on Instagram | List a gig in under a minute, credit the crew |

## Decisions made

- **Four venues only for now:** Goblin, Nami, Neck of the Woods, Whammy Bar (including Double Whammy and the Public Bar).
- **Follow DJs and crews**, not just venues. Alerts only cover the four venues.
- **Look:** warm and sleek. Dark brown background, amber accent, light grain, serif title, big posters.
- **Home opens on Tonight**, with Tomorrow and Weekend one tap away.
- **Filters:** venue and time of day (morning, early evening, late).
- **Every gig shows:** presented-by crew, line-up with set times, several genres, start and finish time, price, badges (R18, free, safer space, etc.).
- **Every gig can:** Listen (Bandcamp, SoundCloud, Mixcloud, radio), Send to mates, Save.
- **Promoters add gigs** by typing, pasting a post, or (in the real app) scanning a poster photo.
- **Android first.** Test with Expo Go before paying for store accounts.
- **Planning happens in Claude chat; building happens in Claude Code.**

## What's built

| Piece | Where | State |
| --- | --- | --- |
| Phone app (Expo / React Native) | On your Mac, run by Claude Code, opened in Expo Go | Browse and add gigs work. Gigs save on the phone only, not shared. Uses the old look. |
| Web prototype | [Gig Guide prototype](https://claude.ai/artifact/UBWdA6qX1sT9zvmjfU87v7) | Shared list, paste-a-post autofill works. Photo reading doesn't work in this preview. |
| Design mockups | [Research-led design](https://claude.ai/artifact/RVDfHq4dG2ajrEzCERtQiZ) | Three screens: home, gig detail, DJ page. This is the target look. |

Known fixes in progress on the phone app: tab bar sitting behind the Android home bar, hiding the home bar until you swipe up.

## What's next

In order. Each one is a job for Claude Code unless it says otherwise.

- [ ] Put this brief into the app folder as `CLAUDE.md` so Claude Code knows the story
- [ ] Finish the Android home bar fix and check it on your phone
- [ ] Swap typed dates and times for proper pickers
- [ ] Restyle the app to match the mockups (warm, sleek, big posters)
- [ ] Add the new gig fields: presented-by, line-up with set times, several genres, finish time, price, badges, listen links
- [ ] Add DJ and crew pages with Follow
- [ ] Decide how gigs get approved (open question below) — plan in chat
- [ ] Move gigs to a shared online database so everyone sees the same list
- [ ] Add paste-a-post and poster scanning for promoters
- [ ] Show it to a few real punters and promoters, note what confuses them
- [ ] Build an installable Android file with Expo cloud build
- [ ] Google Play account ($25 once) and first store release

## Open questions

- **Who can post gigs?** Anyone, only invited promoters, or you approve each one. Apple and Google both expect a way to remove bad posts and block users.
- **What's the app called?** "Gig Guide" is a working name.
- **Where do DJ profiles come from?** You write them, the DJs claim them, or they're built from gig listings.
- **Which shared database?** Supabase is the likely pick; not decided.
- **When to add more venues?** The research says followers will miss gigs at The Mothership, Kemuri Hi-Fi and Leigh Sawmill.
- **Do the venues know?** Worth asking Goblin, Nami, Neck of the Woods and Whammy before launch.

## How to work

**"Should we…?" → Claude chat.** Planning, decisions, research, design.

**"Make it…" → Claude Code.** Running the app, fixing bugs, changing code.

They can't hear each other. When you decide something here, update this brief. When Claude Code changes something big, tell chat. Keep `CLAUDE.md` in the app folder matching this brief.

Preference for both: short replies, plain words.
