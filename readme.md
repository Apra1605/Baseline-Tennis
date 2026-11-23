# Tennis Game

A browser based 3D tennis game! So basically.. You need a controller and you play as the tutorial shows in game. Please DO USE THE TUTORIAL! (its in the first career mode). Enjoy!

## What is in the project

- `index.html` — sign in / entry page.
- `main.html` — main menu, career and match setup.
- `game.html` — single player match against the computer.
- `local-multiplayer.html` — two players sharing one keyboard.
- `tutorial.html` — guided lessons and practice drills.
- `animation-preview.html` — character animation preview. (for devs only:D)
- `models/`, `images/`, and `audio/` — game assets. `licenses/` contains asset licensing information.

Alr soo.. The game includes 3D courts and characters, different court surfaces and venues, match scoring and serving, player attributes and stamina, sound and music, and career progression. The menu and sign-in pages coordinate with the game pages using browser storage.

## Technology

- HTML, CSS, and JavaScript, with each screen implemented as a standalone HTML page.
- [Three.js](https://threejs.org/) for 3D rendering, with its FBX and OBJ loaders and skeleton utilities.
- Three.js and its loaders are imported from jsDelivr, so the game needs an internet connection to load them.
- Firebase Web SDK (Firebase Authentication and Realtime Database) on the sign-in and main menu flows.
- Browser `localStorage` for profile, settings, and career/match handoff data.

There is no npm build step or package manifest at present.

## Run locally

1. Install a modern desktop browser (Chrome or Edge recommended) and Python 3. Alternatively, use any static HTTP server.
2. Download or clone this repository and open a terminal in its root directory.
3. Start a local web server:

   ```powershell
   py -m http.server 8000
   ```

   On systems where `py` is unavailable, use `python -m http.server 8000`.

4. Visit [http://localhost:8000](http://localhost:8000) and open `index.html`. You can also open `main.html` directly to skip the sign-in page.

Use the HTTP address rather than opening the HTML files with `file://`: browser module imports and asset loading may be blocked or behave differently when opened directly. Keep the server running while playing. An internet connection is required for the CDN-hosted Three.js modules and Firebase services.

### Firebase sign-in

The sign-in page uses Firebase Authentication and the menu uses Firebase Realtime Database. The repository contains a Firebase web configuration in `main.html`; the configured Firebase project must be available and permit the app's domain for those online features to work. For a different Firebase project, create a web app in Firebase, enable the authentication method used by the sign-in page and Realtime Database, then replace the configuration in the relevant HTML pages. Firebase web configuration identifies a client project; database security rules should still restrict access appropriately.

If Firebase is unavailable, you can still try opening `main.html` directly through the local server, though features that depend on an authenticated profile or cloud database may not work as expected.

## Controls

Controls are shown in the in-game pause/control screens and can vary by mode. The game supports keyboard controls and gamepad input in match play. In local multiplayer, each player uses a separate keyboard key group. Check the Controls screen before starting a match for the current bindings and shot actions.

## Development notes and challenges

This project grew into several connected game flows rather than one isolated match screen. Keeping the menu, tutorial, career handoff, AI match, and local multiplayer in sync is a recurring challenge: they pass profile and match state through browser storage, so changes to one screen can affect another.

The most demanding gameplay problem is making a tennis rally feel fair in 3D. Ball flight, bounce and net calls, court boundaries, player movement, shot timing, and opponent reach all need to agree about where the ball is. Small tuning changes can make a shot feel either impossible to reach or too easy to return. Animation blending and varied 3D assets also need to stay smooth while the game runs in the browser.

The project currently keeps substantial logic inside large HTML files. That makes it easy to run without a build tool, but makes shared behavior and cross-mode changes harder to maintain. The CDN imports also mean a network connection is needed at runtime. These are useful areas to improve as the game grows: extract shared modules, centralize configuration, and add repeatable checks for gameplay flows.

## Credits

Music and audio credits are retained below from the original project notes:

- “Uncharted” by NIVIRO, provided by [NoCopyrightSounds](https://ncs.io/N_Uncharted).
- Music by [Dmitrii Spis](https://pixabay.com/users/nastelbom-48128234/) via Pixabay.
- Music by [Dmitrii Kolesnikov](https://pixabay.com/users/the_mountain-3616498/) via Pixabay.
- Music by [voiceofruthie](https://pixabay.com/users/voiceofruthie-46882009/) via Pixabay.

See [`licenses/`](licenses/) for additional asset licensing details.
