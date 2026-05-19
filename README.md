# Nexis Games — Project Structure

Welcome! This is the source repository for **[nexisgd.com](https://nexisgd.com)** — Nexis Games.

The site is a fully static, GitHub-Pages-ready React (Babel-runtime) application
whose application source is **encrypted at rest** so that visitors who hit
`view-source:` only see a loader stub and an unreadable bundle — while you
(the owner) keep the readable source in `/src/core.js` and can drop in / fix
games in `/games/` without touching obfuscated code.

---

## Quick start

1. **Clone / push to GitHub.**
2. In your repository **Settings → Pages**, set the source to your `main`
   branch, root folder.
3. Make sure your DNS `CNAME` record points `nexisgd.com` to
   `<your-github-user>.github.io`. (The included `CNAME` file pins the
   custom domain inside Pages.)
4. Visit `https://nexisgd.com/` — your site is live.

---

## Directory map

```
/
├── index.html              ← entry page (metadata, favicon, og tags)
├── 404.html                ← custom 404 page
├── robots.txt              ← search-engine rules
├── sitemap.xml             ← search-engine sitemap
├── CNAME                   ← custom domain for GitHub Pages (nexisgd.com)
├── .nojekyll               ← disables Jekyll on GitHub Pages
├── .gitignore
│
├── app/
│   ├── loader.js           ← public bootstrap that decodes the bundle
│   └── core.dat            ← encrypted application bundle (DO NOT edit)
│
├── data/
│   └── games.js            ← ★ PLAINTEXT game registry — edit to add games
│
├── games/                  ← ★ drop your game HTML files here
│   ├── README.md
│   └── _examples/
│       └── sample-game.html
│
├── assets/                 ← favicons, og images, game thumbnails
│   └── README.md
│
├── src/
│   └── core.js             ← ★ PLAINTEXT React source (your editable copy)
│
├── tools/
│   ├── build.html          ← browser-based re-encryptor (no Node needed)
│   └── build.py            ← CLI re-encryptor (python 3.6+)
│
└── .github/
    └── workflows/
        └── pages.yml       ← optional auto-deploy on push (GitHub Pages)
```

`★` = the only files you normally need to touch.

---

## How to add a new game

1. Drop the game's HTML file (or its assets folder) into `/games/`
   – e.g. `games/MyNewGame.html`.
2. Open `data/games.js` and append a new entry to the array:

```js
{
  id: 'my-new-game',
  title: 'My New Game',
  developer: 'YourName',
  src: 'games/MyNewGame.html',
  theme: 'from-cyan-600 to-blue-900',
  tags: ['Action', 'Arcade']
}
```

3. (Optional) Drop a 512×512 PNG named **exactly** `My New Game.png` into
   `/assets/` so the game card shows your art.
4. Commit & push. **No re-build needed** — `data/games.js` is plaintext.

## How to fix / edit a game

Just edit the HTML inside `/games/`. The change is live on next push.

## How to edit the application UI / logic

1. Edit `/src/core.js` (plaintext React + JSX).
2. Re-encrypt the bundle:

   **Option A — CLI (recommended)**
   ```
   python3 tools/build.py
   ```

   **Option B — Browser** (no install needed)
   - Open `/tools/build.html` locally in a browser.
   - Paste the new `core.js` contents.
   - Click **"Encrypt"** and download the resulting `core.dat`.
   - Replace `/app/core.dat`.

3. Commit & push.

---

## Why is the source encrypted?

`view-source:` and `Ctrl+U` on `index.html` will only reveal:

- The loading screen markup
- A tiny loader (`app/loader.js`)
- The plaintext games list (`data/games.js`) — intentionally readable

The actual React application (~2 100 lines) is XOR-ciphered and base64-armoured
into `app/core.dat`. Casual users cannot read it from the page source.

> **Note:** This obfuscation defeats *casual inspection*, not a determined
> reverse-engineer who can attach a debugger. If you ever need real
> server-side secrets, never embed them client-side.

---

## Local preview

Because of the importmap + module loader, you must serve the folder over HTTP
(not `file://`). The simplest way:

```bash
cd nexis-site
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

---

## Credits

Built and maintained by **Nexis GD**.
© Nexis Games — All rights reserved.
