const symbols = ['🍒', '🍋', '🔔', '🍉', '🍇', '⭐'];
const reels = [
  document.querySelector('#reel1 .symbols'),
  document.querySelector('#reel2 .symbols'),
  document.querySelector('#reel3 .symbols')
];

const betInput = document.getElementById('bet-input');
const balanceDisplay = document.getElementById('balance');
const spinSound = document.getElementById('spin-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const winScreen = document.getElementById('win-screen');
const winAmountDisplay = document.getElementById('win-amount');
const instructionsModal = document.getElementById('instructions-modal');

let balance = parseInt(localStorage.getItem('cassino-balance')) || 1000;
balanceDisplay.textContent = `Créditos: R$ ${balance}`;

function saveBalance() {
  localStorage.setItem('cassino-balance', balance);
}

function generateSymbols(reel, count = 20) {
  reel.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const symbol = document.createElement('div');
    symbol.className = 'symbol';
    symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    reel.appendChild(symbol);
  }
}

function startSpin() {
  const bet = parseInt(betInput.value);
  if (isNaN(bet) || bet <= 0 || bet > balance) {
    alert('Aposta inválida!');
    return;
  }

  balance -= bet;
  updateBalance();
  spinSound.play();

  reels.forEach((reel, index) => {
    generateSymbols(reel);
    const duration = 2000 + index * 500;
    reel.style.transition = 'none';
    reel.style.top = '0px';
    requestAnimationFrame(() => {
      reel.style.transition = `top ${duration}ms ease-out`;
      reel.style.top = `-${reel.scrollHeight - 150}px`;
    });
  });

  setTimeout(() => checkResult(bet), 3000);
}

function checkResult(bet) {
  const finalSymbols = reels.map(reel => {
    const children = reel.children;
    return children[children.length - 3].textContent;
  });

  const allEqual = finalSymbols.every(sym => sym === finalSymbols[0]);

  if (allEqual) {
    const winnings = bet * 2;
    balance += winnings;
    updateBalance();
    winAmountDisplay.textContent = `Você ganhou R$ ${winnings}!`;
    winScreen.classList.remove('hidden');
    winSound.play();
  } else {
    loseSound.play();
  }
}

function updateBalance() {
  balanceDisplay.textContent = `Créditos: R$ ${balance}`;
  saveBalance();
}

function closeWinScreen() {
  winScreen.classList.add('hidden');
}

function resetGame() {
  balance = 1000;
  updateBalance();
  alert('Jogo reiniciado!');
}

function showInstructions() {
  instructionsModal.classList.remove('hidden');
}

function closeInstructions() {
  instructionsModal.classList.add('hidden');
}

reels.forEach(reel => generateSymbols(reel));
