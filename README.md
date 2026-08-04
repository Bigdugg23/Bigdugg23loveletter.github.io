# A Letter for Someone Who Changed My World

A single-page, cinematic love-letter experience — password gate, blooming
garden, wax-sealed envelope, a slow ink-written letter with little
ambient animations, a hidden Easter egg, and a night-sky ending.
Pure HTML/CSS/JS, no build step, no backend.

## 🚀 Put it on GitHub Pages

1. Create a new GitHub repo and upload these items to the root:
   `index.html`, `style.css`, `script.js`, `assets/`
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, choose the `main` branch and `/ (root)`, then Save.
4. GitHub gives you a URL like `https://yourname.github.io/repo-name/`
   within a minute or two. That's it — no server, no database.

You can also just double-click `index.html` to preview it locally first.

## 🔐 The password

Default is **"smiles"** — change it (and every line of the letter) in
the `CONFIG` object at the very top of `script.js`.

## 🎵 The music

The song is **"Summers Over Interlude" by Drake (feat. Majid Jordan)**.
Since a commercial track can't be hosted or bundled as a file, it plays
through **Spotify's own official embedded player** (the iFrame API) —
that's the only legitimate way to include a specific real recording on
a static site. Two practical notes that come with that:

- Spotify's terms require their player widget to stay **visibly on the
  page** — it sits as a small framed player in the top-right corner
  rather than hiding behind a custom icon.
- Full playback (not just a 30-second preview) generally requires the
  visitor to be logged into Spotify in that browser. The site tries to
  start it automatically right when the password is unlocked, but if a
  browser blocks that, the visitor can just tap play on the widget.

To use a different song instead, open `script.js`, find `TRACK_URI`
near the top of the MUSIC section, and swap in another track's
Spotify URI (open.spotify.com → the track's "···" menu → Share →
Copy Song Link, then use the ID from that link).

## ✏️ Customizing

Everything text-related lives in `CONFIG` in `script.js`:
password, the welcome line, the ribbon text, the letter's title and
every line (with its little animation), the signature, the
Easter-egg message, the Polaroid caption, and the closing P.S.

- **Photo**: drop an image at `assets/images/us.jpg`, then in
  `index.html` find the `POLAROID` comment in the Secret Scene and
  swap the placeholder `<span>` for an `<img>` tag (instructions are
  right there in the comment).
- **Colors/fonts**: all at the top of `style.css` under "DESIGN TOKENS".

## 🥚 The Easter egg

Tap the little heart next to the signature five times to unlock a
secret scene with a personal message and a Polaroid frame.

## ♿ Notes

- Respects `prefers-reduced-motion` (fewer particles, instant reveals).
- Fully keyboard/focus-accessible form and buttons.
- Tested at desktop (1280×800) and mobile (390×844) widths.
