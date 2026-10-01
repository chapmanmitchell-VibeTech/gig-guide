# Gig Guide — how to run it on your phone

A gig listings app for four Auckland venues: Goblin and Nami in Ponsonby,
Neck of the Woods and Whammy Bar on K Road.

---

## What you need first

**On your Android phone**
- Install **Expo Go** from the Play Store. It's free.

**On your Mac**
- Install **Node.js** from https://nodejs.org — take the button on the left
  (the "LTS" one). Run the installer, click through, done.

**Both on the same wifi.** This matters — your phone finds your Mac over the
network.

---

## Running it

Open **Terminal** on your Mac (press Cmd+Space, type "Terminal", hit Enter).

Type these four lines, pressing Enter after each. Replace the path in the
first line with wherever you saved this folder.

```
cd ~/Documents/gig-guide
export PATH=/opt/homebrew/bin:$PATH
npm install
npx expo start
```

The first line moves into the project folder.
The second picks the right Node.js — needed in every new Terminal window.
The third downloads the pieces the app needs — takes a few minutes the first
time, and it's noisy. That's normal.
The fourth starts it.

A **QR code** appears in the Terminal.

Open **Expo Go** on your phone, tap **Scan QR code**, point it at your screen.
The app loads. That's it.

Leave the Terminal window open while you're using it. To stop, click the
Terminal and press `Ctrl+C`.

---

## Using it

**Gigs tab** — scroll what's on, grouped by day. Search by band or venue.
Filter by Today, This weekend, or Next 7 days.

**Add a gig tab** — fill in the act, tap a venue, tap Date and Time to pick
them, pick a vibe, add a short description. Tap Add gig.

---

## Where the gigs are stored

On your phone, and only on your phone. Nobody else sees what you add, and if
you delete the app the gigs go with it.

Making it shared — so promoters add gigs and punters see them — is the next
job. It needs a database that lives on the internet rather than on your
handset. The file `storage.js` is where that swap happens; everything else
stays as it is.

---

## Changing things yourself

**Venues** — open `theme.js`, find the `VENUES` list, add or edit an entry.
The picker on the Add tab updates by itself.

**Colours** — also `theme.js`, at the top.

**Genres** — the `VIBES` list in the same file.

---

## The files, briefly

| File | What it does |
|---|---|
| `App.js` | The frame: header, the two tabs, and the gig list everything shares |
| `BrowseScreen.js` | The Gigs tab — search, filters, the cards |
| `AddGigScreen.js` | The Add a gig tab — the form |
| `storage.js` | Saving and loading gigs. Swap this for a real database later |
| `dates.js` | Date and time formatting |
| `theme.js` | Colours, venues, genres |

---

## If something goes wrong

**"command not found: npm"** — Node.js isn't installed, or the Terminal window
was open before you installed it. Close Terminal, open it again.

**Errors when starting** — you skipped the `export` line. Run it, then
`npx expo start` again.

**Expo Go says "incompatible"** — update Expo Go.

**QR code scans but nothing loads** — phone and Mac aren't on the same wifi.
Check both.

**Red error screen on the phone** — shake the phone, tap Reload. If it keeps
happening, the error text on screen is the useful bit; send it over.
