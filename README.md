[![make.fun · best-card-game-20261122-1826](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/romdhoncom/best-card-game-20261122-1826/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/romdhoncom/best-card-game-20261122-1826/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)

# Ember Duel

An original two-player card battler for the make.fun best card game bounty. You duel Cinder, keeper of the last flame, on a green felt table: each side has 20 life and energy that grows every turn, and a hand of cards from 8 types — Strike, Guard, Ember, Mend, Spark, Frost, Flame, Bloom — each with a cost, a value, and an element told apart by colour *and* shape (▲ Ember, ◆ Frost, ★ Spark, ● Bloom). Shield absorbs damage first; reduce Cinder to 0 life to win.

Play it: `node serve.ts`, then open http://localhost:8080. Click a card to play it (keys 1–7), Enter ends the turn, R restarts. `?shot=start|play|win|loss` renders a fixed state for screenshots; `?test=N` plays N full games headlessly and reports the results.

`main.ts` hands the game in: it copies `game/` and `screenshots/` to `/output` and writes `/output/dossier.json`.
