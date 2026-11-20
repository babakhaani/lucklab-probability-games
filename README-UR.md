# LuckyLab — Probability Practice Games

A small, editable, browser-based practice project with three games:
- Dice Challenge
- Coin Flip
- Number Guess
- Recent activity history

## Run locally
Open `index.html` in a modern browser.

## Deploy on Cloudflare Pages
1. Extract this ZIP.
2. In Cloudflare Pages, choose **Upload your static files** (or upload the extracted project).
3. Upload the project contents so `index.html`, `style.css`, and `app.js` are at the site root.
4. No build command is needed for this static project.

## Edit later
Open `app.js` and edit the `CONFIG` object near the top:
- `diceSides`: number of sides on the dice
- `numberMin` / `numberMax`: number guessing range
- `historyLimit`: maximum visible recent results kept in memory

Edit `style.css` to change colors, spacing, and layout. Edit `index.html` to change the page title or main text.

## Important
This is a probability-learning demo only. It has no real-money wallet, TRX deposits, withdrawals, betting, cash prizes, or payment processing. History is held in the current browser page session and clears when the page is refreshed.


## Sign up / Login and activity tabs
- Sign up / Login is a local front-end profile preview. It stores only a nickname in this browser's local storage; it is **not secure authentication** and must not be used for real accounts.
- `My Bet` shows your own practice guesses from the current page session.
- `All Bet` shows fictional sample activity to preview the interface. It is clearly marked as sample data, not live users or real wagers.
- For a real production login system, use a secure authentication provider and server-side validation; do not store passwords in browser storage.
