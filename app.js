/*
  EDITABLE SETTINGS
  Change these values to customize the practice games.
  This project intentionally has no real-money wallet, deposits, withdrawals, or wagering.
*/
const CONFIG = {
  appName: "LuckyLab",
  diceSides: 6,
  numberMin: 1,
  numberMax: 10,
  historyLimit: 30,
  sampleActivityCount: 8
};

const state = {
  view: "dice",
  diceChoice: null,
  rounds: 0,
  correct: 0,
  history: [],
  numberTarget: null,
  profile: localStorage.getItem("luckylab_demo_profile") || "",
  authMode: "signup",
  myPlays: []
};

const panel = document.getElementById("game-panel");
const tabs = [...document.querySelectorAll(".tab")];
const sampleAllActivity = [
  {name:"NovaFox",game:"Dice",detail:"Picked 4 · Result 4",status:"Correct",time:"09:42"},
  {name:"SkyByte",game:"Coin Flip",detail:"Picked Heads · Tails",status:"Try again",time:"09:40"},
  {name:"RiverMoon",game:"Number Guess",detail:"Picked 7 · Target 3",status:"Try again",time:"09:37"},
  {name:"PixelAce",game:"Dice",detail:"Picked 2 · Result 2",status:"Correct",time:"09:35"},
  {name:"LunaPlay",game:"Coin Flip",detail:"Picked Tails · Heads",status:"Try again",time:"09:31"},
  {name:"EchoStar",game:"Number Guess",detail:"Picked 5 · Target 5",status:"Correct",time:"09:28"},
  {name:"MintWave",game:"Dice",detail:"Picked 6 · Result 1",status:"Try again",time:"09:24"},
  {name:"BlueComet",game:"Coin Flip",detail:"Picked Heads · Heads",status:"Correct",time:"09:20"}
];
const authModal = document.getElementById("auth-modal");
const authOpen = document.getElementById("auth-open");
const authClose = document.getElementById("auth-close");
const authSubmit = document.getElementById("auth-submit");
const authName = document.getElementById("profile-name");
const authMessage = document.getElementById("auth-message");
const authTitle = document.getElementById("auth-title");
const userLabel = document.getElementById("user-label");
function updateProfileUI(){userLabel.textContent=state.profile?state.profile:"Guest mode";authOpen.textContent=state.profile?"Change profile":"Sign up / Login";}
function openAuth(){authModal.hidden=false;authName.value=state.profile;authName.focus();}
function closeAuth(){authModal.hidden=true;}
authOpen.addEventListener("click",openAuth);authClose.addEventListener("click",closeAuth);
authModal.addEventListener("click",e=>{if(e.target===authModal)closeAuth();});
document.querySelectorAll("[data-auth]").forEach(b=>b.addEventListener("click",()=>{state.authMode=b.dataset.auth;document.querySelectorAll("[data-auth]").forEach(x=>x.classList.toggle("active",x===b));authTitle.textContent=state.authMode==="signup"?"Create profile":"Login to this browser";authSubmit.textContent=state.authMode==="signup"?"Create demo profile":"Continue";authMessage.textContent=state.authMode==="signup"?"Choose a nickname for this demo.":"Enter the nickname saved in this browser.";}));
authSubmit.addEventListener("click",()=>{const name=authName.value.trim();if(!/^[a-zA-Z0-9 _-]{2,20}$/.test(name)){authMessage.textContent="Use 2–20 letters, numbers, spaces, _ or -.";return;}const saved=localStorage.getItem("luckylab_demo_profile")||"";if(state.authMode==="login"&&saved.toLowerCase()!==name.toLowerCase()){authMessage.textContent="No matching local demo profile found. Choose Sign up first.";return;}state.profile=name;localStorage.setItem("luckylab_demo_profile",name);updateProfileUI();closeAuth();});
updateProfileUI();

function setView(view) {
  state.view = view;
  tabs.forEach(t => t.classList.toggle("active", t.dataset.view === view));
  render();
}
tabs.forEach(t => t.addEventListener("click", () => setView(t.dataset.view)));

function addHistory(game, guess, result, success) {
  const item={ game, guess, result, success, time: new Date().toLocaleTimeString() };
  state.history.unshift(item);
  state.history = state.history.slice(0, CONFIG.historyLimit);
  state.myPlays.unshift({...item, name:state.profile||"Guest"});
  state.myPlays=state.myPlays.slice(0,CONFIG.historyLimit);
}

function statsHTML() {
  const accuracy = state.rounds ? Math.round(state.correct / state.rounds * 100) : 0;
  return `<div class="stat-row"><div class="stat"><strong>${state.rounds}</strong><span>Rounds played</span></div><div class="stat"><strong>${state.correct}</strong><span>Correct guesses</span></div><div class="stat"><strong>${accuracy}%</strong><span>Accuracy</span></div></div>`;
}

function renderDice() {
  const options = Array.from({length: CONFIG.diceSides}, (_, i) => i + 1);
  panel.innerHTML = `<div class="game-heading"><div><p class="eyebrow">GAME 01</p><h2>Dice Challenge</h2></div><span class="pill">1–${CONFIG.diceSides}</span></div>
  <p class="instruction">Choose the number you think will appear, then roll the dice.</p>
  <div class="dice-face" id="dice-face">⚄</div>
  <div class="choice-grid">${options.map(n => `<button class="choice ${state.diceChoice===n?'selected':''}" data-choice="${n}">${n}</button>`).join("")}</div>
  <button class="primary-btn" id="play-btn" ${state.diceChoice===null?"disabled":""}>Roll dice <span>→</span></button>
  <p class="result-message" id="result-message">Choose a number to begin.</p>${statsHTML()}`;
  panel.querySelectorAll("[data-choice]").forEach(b => b.addEventListener("click", () => {state.diceChoice=Number(b.dataset.choice);renderDice();}));
  document.getElementById("play-btn").addEventListener("click", () => {
    if (state.diceChoice===null) return;
    const result = 1 + Math.floor(Math.random()*CONFIG.diceSides);
    const success = result===state.diceChoice;
    state.rounds++; if(success) state.correct++;
    addHistory("Dice", `Picked ${state.diceChoice}`, `Rolled ${result}`, success);
    renderDice();
    document.getElementById("dice-face").textContent = ["⚀","⚁","⚂","⚃","⚄","⚅"][result-1] || String(result);
    const msg=document.getElementById("result-message");
    msg.textContent=success ? "Correct guess! Great observation." : `The result was ${result}. Try another round.`;
    msg.className=`result-message ${success?"good":"bad"}`;
  });
}

function renderCoin() {
  panel.innerHTML=`<div class="game-heading"><div><p class="eyebrow">GAME 02</p><h2>Coin Flip</h2></div><span class="pill">50 / 50</span></div>
  <p class="instruction">Choose heads or tails and see how a fair coin behaves over repeated flips.</p>
  <div class="coin" id="coin-face">🪙</div>
  <div class="two-buttons"><button class="secondary-btn" data-side="Heads">Heads</button><button class="secondary-btn" data-side="Tails">Tails</button></div>
  <p class="result-message" id="coin-result">Pick a side to flip the coin.</p>${statsHTML()}`;
  panel.querySelectorAll("[data-side]").forEach(b=>b.addEventListener("click",()=>{
    const guess=b.dataset.side, result=Math.random()<.5?"Heads":"Tails", success=guess===result;
    state.rounds++;if(success)state.correct++;addHistory("Coin Flip",`Picked ${guess}`,result,success);
    renderCoin();document.getElementById("coin-face").textContent=result==="Heads"?"🟡":"⚪";
    const m=document.getElementById("coin-result");m.textContent=`${result}. ${success?"Correct guess!":"Not this time."}`;m.className=`result-message ${success?"good":"bad"}`;
  }));
}

function renderNumber() {
  panel.innerHTML=`<div class="game-heading"><div><p class="eyebrow">GAME 03</p><h2>Number Guess</h2></div><span class="pill">${CONFIG.numberMin}–${CONFIG.numberMax}</span></div>
  <p class="instruction">A number is selected at random. Enter your guess and check the result.</p>
  <input class="guess-input" id="number-input" type="number" min="${CONFIG.numberMin}" max="${CONFIG.numberMax}" placeholder="Enter a number">
  <button class="primary-btn" id="guess-btn">Check guess <span>→</span></button>
  <p class="result-message" id="number-result">Ready when you are.</p>${statsHTML()}`;
  document.getElementById("guess-btn").addEventListener("click",()=>{
    const input=document.getElementById("number-input"),guess=Number(input.value);
    if(!input.value||guess<CONFIG.numberMin||guess>CONFIG.numberMax){document.getElementById("number-result").textContent=`Enter a number from ${CONFIG.numberMin} to ${CONFIG.numberMax}.`;return;}
    const result=state.numberTarget ?? (CONFIG.numberMin+Math.floor(Math.random()*(CONFIG.numberMax-CONFIG.numberMin+1)));
    state.numberTarget=null;const success=guess===result;state.rounds++;if(success)state.correct++;
    addHistory("Number Guess",`Picked ${guess}`,`Target ${result}`,success);renderNumber();
    const m=document.getElementById("number-result");m.textContent=success?"Correct! You found the number.":`The number was ${result}.`;m.className=`result-message ${success?"good":"bad"}`;
  });
}

function renderMyBets() {
  panel.innerHTML=`<div class="game-heading"><div><p class="eyebrow">PERSONAL PRACTICE</p><h2>My Bet</h2></div><span class="pill">Practice only</span></div>
  <p class="instruction">Your own game rounds from this browser session. These are guesses, not wagers.</p>
  ${state.myPlays.length?`<div class="history-list">${state.myPlays.map(h=>`<div class="history-item"><div><strong>${h.game}</strong><br><small>${h.guess} · ${h.time}</small></div><div style="text-align:right"><strong>${h.success?"Correct":"Try again"}</strong><br><small>${h.result}</small></div></div>`).join("")}</div>`:`<div class="empty">No personal rounds yet. Play a game to see your activity here.</div>`}`;
}

function renderAllBets() {
  panel.innerHTML=`<div class="game-heading"><div><p class="eyebrow">COMMUNITY PREVIEW</p><h2>All Bet</h2></div><span class="pill">Sample feed</span></div>
  <p class="instruction">Illustrative sample activity for layout preview only. These entries are fictional and are not live users or real bets.</p>
  <div class="sample-banner">SAMPLE DATA · FICTIONAL ACTIVITY</div>
  <div class="history-list">${sampleAllActivity.slice(0,CONFIG.sampleActivityCount).map(h=>`<div class="history-item"><div><strong>${h.name} <span class="feed-game">${h.game}</span></strong><br><small>${h.detail}</small></div><div style="text-align:right"><strong>${h.status}</strong><br><small>${h.time}</small></div></div>`).join("")}</div>`;
}

function render() {
  if(state.view==="dice")renderDice();
  else if(state.view==="coin")renderCoin();
  else if(state.view==="number")renderNumber();
  else if(state.view==="mybets")renderMyBets();
  else renderAllBets();
}
render();
