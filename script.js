// script.js

// Get DOM elements
const gameBoard = document.getElementById('game-board');
const incorrectDisplay = document.getElementById('incorrect');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
const resetButton = document.getElementById('reset-btn');

// Game variables
let shuffledCards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let incorrectGuesses = 0;
let matches = 0;

// Shuffle Function 
function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

// Start or reset the game
function startGame() {
    gameBoard.innerHTML = '';
    messageDisplay.textContent = '';
    incorrectGuesses = 0;
    matches = 0;
    incorrectDisplay.textContent = 'Incorrect: 0';
    scoreDisplay.textContent = 'Score: 0';

    shuffledCards = shuffle([...cardsArray]);

    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;
        cardElement.innerHTML = `
            <div class="card-front"></div>
            <div class="card-back">${card.content}</div>
        `;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });

    // Show all cards for 2 seconds
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.add('flip'));
    setTimeout(() => {
        allCards.forEach(card => card.classList.remove('flip'));
    }, 2000);
}


// Flip card logic
function flipCard() {
    if (lockBoard || this.classList.contains('flip')) return;

    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

// Check for Match
function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

// If matched 
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matches++;
    scoreDisplay.textContent = `Score: ${matches}`;

    resetBoard();

    if (matches === cardsArray.length / 2) {
        messageDisplay.textContent = "🎉 You Won!";
        messageDisplay.classList.add('win-animation'); // <-- small w
        messageDisplay.style.visibility = 'visible'; // <-- correct spelling
    }
}


// If not matched 
function unflipCards() {
    incorrectGuesses++;
    incorrectDisplay.textContent = `Incorrect: ${incorrectGuesses}`;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);

    if (incorrectGuesses >= 3) {
        setTimeout(() => {
            messageDisplay.textContent = "❌ Game Over! Try Again.";
            messageDisplay.classList.remove('win-animation');
            messageDisplay.style.display = 'block'; // FIXED here
    
            // Delay restarting game after showing message
            setTimeout(() => {
                startGame();
            }, 3000); // wait 3 seconds before restarting
        }, 500);
    }    
    
}


// Reset flipped cards
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Reset Button Listener
resetButton.addEventListener('click', startGame);

// Start the game for the first time
startGame(); 