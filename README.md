[![make.fun · best-card-game-20261122-1826](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/romdhoncom/best-card-game-20261122-1826/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/romdhoncom/best-card-game-20261122-1826/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826?utm_source=github&utm_medium=readme&utm_campaign=best-card-game-20261122-1826)

# Ember Duel

An original two-player card battler for the make.fun best card game bounty. You duel Cinder, keeper of the last flame, on a green felt table: each side has 20 life and energy that grows every turn (3, then +1 a turn, up to 6), and a hand of cards from 8 types — Strike, Guard, Ember, Mend, Spark, Frost, Flame, Bloom — each with a cost, a value, and an element told apart by colour *and* shape (▲ Ember, ◆ Frost, ★ Spark, ● Bloom). Shield absorbs damage first; reduce Cinder to 0 life to win.

**The combo (new in v2):** play two cards of the same element in one turn and the second one lands with **+2 bonus damage** under a big **COMBO x2** banner — and Cinder can do it to you too. The decision every hand turns on is which element to double up on — hold your Ember cards for the pair, or spend them one at a time.

Cinder plays greedily and readably: it heals when hurt, guards when threatened, and otherwise spends its energy on the hardest hit it can afford — so you can see its plan coming and counter it.

Play it: `node serve.ts`, then open http://localhost:8080. Click a card to play it (keys 1–7), Enter ends the turn, R restarts. `?shot=start|play|win|loss` renders a fixed state for screenshots — the play shot catches the table mid-combo, both hands on the felt; `?test=N` plays N full games headlessly and reports the tally.

`main.ts` hands the game in: it copies `game/` and `screenshots/` to `/output` and writes `/output/dossier.json`.
