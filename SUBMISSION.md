# Dynasty Spin Royale — Assignment Submission

## 1. Public game URL

https://domenicmenta.github.io/dynasty-spin-royale/

The game is publicly accessible and does not require an account or sign-in. A second production deployment is available at https://dynasty-spin.domenictommenta.chatgpt.site/.

## 2. Repository and source

https://github.com/DomenicMenta/dynasty-spin-royale

The repository contains the game interface, player database, scoring and spin logic, leaderboard API, database migrations, simulation script, and deployment configuration.

## 3. Concise AI/build log

| Stage | Major prompt or decision | Implemented change | Human verification |
| --- | --- | --- | --- |
| Concept | Build a dynasty fantasy game using historic 100+ point seasons and an eight-slot roster. | Created QB, RB, RB, WR, WR, TE, FLEX, and bench roster flow with the requested PPR scoring. | Played full franchises and checked roster totals. |
| Dynasty strategy | Add first-, second-, and third-round rookie picks with different risk and value. | Added 70/40/20 Dynasty Value picks, mandatory bench-pick trade, and guaranteed point-improving respins. | Repeated play exposed weak trade incentives; upgrade returns were rebalanced. |
| Database and rarity | Add more players and adjust rarity by position. | Expanded to 4,000+ player-seasons and calculated Platinum, Ruby, Gold, Emerald, Silver, and Bronze independently within each position. | Compared displayed rarity for players at multiple positions and seasons. |
| Visual design | Replace the mining concept with a black-and-gold spin/casino identity. | Renamed the game Dynasty Spin Royale, added the custom DA logo, player cutouts, rarity treatments, and a responsive card system. | Iterative visual comments corrected card layout, photo scale, Gold/Platinum styling, labels, and header copy. |
| Draft interaction | Spin two players and let the user decide which player and position to fill. | Added dual animated reels for starters, a single reel for the bench, no duplicate player names per franchise, and a Ruby-or-better safety rule. | Played repeated franchises; fixed disappearing reel photos and bench probability behavior. |
| Transactions | Make every pick trade understandable. | Added complete transaction history showing outgoing player, pick, incoming player, point change, and Dynasty Value change. | Verified trade wording and changed “spent” to “pick traded.” |
| Records | Grade teams using roster points plus remaining pick value. | Simulated 1,000 strategy-varied franchises, seeded the live database with labeled simulation teams, and derived the 17-game record curve from the result distribution. | Checked final values, percentile labels, and record output across completed teams. |
| Leaderboard | Track named completed drafts and the Top 100. | Added end-of-run draft naming, persistent public rankings, simulated-entry labels, and live ranking against the full result database. | Verified that the leaderboard returns 100 entries and that new results join the same field. |
| Responsive revision | Show a complete roster on one screen. | Compressed all eight roster cards into a four-by-two desktop grid and a compact mobile grid. | Reviewed desktop and mobile layouts and refined text/photo sizing. |
| Final cleanup | Remove presentation-only explanatory controls and copy. | Removed the Build Log navigation button and calibration note from the game UI while preserving documentation here. | Verified successful production builds and public deployment. |

AI was used for implementation, data processing, simulation, debugging, copy refinement, and deployment assistance. The project owner supplied the concept, scoring system, probability decisions, visual direction, repeated gameplay feedback, and final revision choices.

## 4. Unfamiliar-user test note

This section must describe a real test by someone who did not help build the game. Do not claim the test until it occurs.

### Five-minute test script

1. Open the public URL in a signed-out/incognito window.
2. Without coaching, ask the tester to begin a franchise and explain what they think the goal is.
3. Have them make at least three two-player choices, inspect rookie picks, and trade one pick if they can determine how.
4. Ask them to complete the roster, name the draft, and locate it on the leaderboard.
5. Record the first point of hesitation, revise that issue, and have the tester repeat the affected action.

### Submission-ready note — fill in the brackets after the test

> On **[date]**, **[tester first name or “one classmate”]**, who had not seen Dynasty Spin Royale before, tested the game on **[phone/laptop]**. The main friction observed was **[specific hesitation or misunderstanding]**. I revised **[specific interface text, placement, styling, or behavior]** by **[what changed]**. In a second attempt, the tester **[completed the action without help / understood the choice / found the control]**, verifying the revision.

### Suggested issue to watch

The most likely unfamiliar-user friction is understanding when to preserve a rookie pick’s Dynasty Value versus trading it for an immediate point upgrade. If the tester pauses there, add or revise one short explanation in the trade dialog, then verify that they can explain the tradeoff in their own words.

## In-class demonstration outline

1. **Premise (15 seconds):** “Dynasty Spin Royale turns historic fantasy seasons into a two-player choice game. The goal is to build the strongest eight-player franchise.”
2. **Core loop (30 seconds):** Spin two players, compare position-adjusted rarity and fantasy points, select one, and explain that duplicate players cannot appear.
3. **Strategy (30 seconds):** Show the 70/40/20 DV rookie picks, then explain the choice between preserving DV and trading a pick for a guaranteed scoring upgrade or the bench.
4. **Result (20 seconds):** Show Franchise Value, the 17-game record, draft naming, and the Top 100 leaderboard.
5. **Technical point (15 seconds):** Mention the 4,000+ season database, 1,000-run calibration, persistent leaderboard, responsive layout, and public deployment.

## Reflection

The strongest lesson was that balancing a game is as important as implementing it. Early versions worked technically but made elite outcomes too rare and pick trades insufficiently rewarding. Repeated playtesting led to position-adjusted rarity, two-player choices, guaranteed upgrade rules, pick-specific bench probabilities, and a 1,000-franchise calibration. The project also showed that interface language matters: labels such as “Trade Pick for Respin,” complete transaction details, and clearer roster presentation made the strategy easier to understand. If development continued, the next step would be broader unfamiliar-user testing and ongoing analysis of real completed drafts to refine the probability and record curves.
