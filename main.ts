// Ember Duel — the best-card-game-20261122-1826 entry (Node 22, standard library only): the game
// is this directory's game/ folder, plain static files a desktop browser loads offline
// (game/index.html and its ES modules, no library and no network request), and the program
// hands it in. It copies game/ and screenshots/ from beside this file to /output and writes
// /output/dossier.json, the summary the judge reads, with the vendored make.fun library.
// The game: a two-player card battler against Cinder — 8 card types, energy, shield, and
// a hand you play by clicking. v2 adds the combo: two cards of one element in a turn deal
// +2 bonus damage under a COMBO x2 banner, and the play screenshot catches it mid-combo.
// Put your 3 or 4 PNG or JPEG screenshots in screenshots/
// (the first by name is the cover) and run it.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Ember Duel hands in four screenshots: 1-cover.jpg (title), 2-play.jpg (mid-game table),
// 3-win.jpg (victory) and 4-loss.jpg (defeat), each a real render of the game's own code
// taken headlessly from the ?shot= states. The scorer's caps below must match them:
// at most 4 screenshots, each at most 256 KiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
