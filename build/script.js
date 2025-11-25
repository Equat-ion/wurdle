import { WORDS } from "./words.js";

const MAX_GUESSES = 6;
let guessesRemaining = MAX_GUESSES;
let currentGuess = [];
let nextLetter = 0;

let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];

console.log(rightGuessString)

function initBoard() {
  let board = document.getElementById("gameBoard");

  for (let i = 0; i < MAX_GUESSES; i++) {
    let row = document.createElement("div");
    row.className = "letterRow";

    for (let j = 0; j < 5; j++) {
      let box = document.createElement("div");
      box.className = "letterBox";

      row.appendChild(box);
    }

    board.appendChild(row);
  }
}

function insertLetter(pressedKey) {
  if (nextLetter === 5) {
    return;
  }
  pressedKey = pressedKey.toLowerCase();

  let row = document.getElementsByClassName("letterRow")[6 - guessesRemaining];
  let box = row.children[nextLetter];

  box.textContent = pressedKey;
  box.classList.add("filled-box");

  currentGuess.push(pressedKey);
  nextLetter += 1;
}

function deleteLetter() {
  let row = document.getElementsByClassName("letterRow")[6 - guessesRemaining];
  let box = row.children[nextLetter - 1];

  box.textContent = "";
  box.classList.remove("filled-box");

  currentGuess.pop();
  nextLetter -= 1;
}

function checkGuess() {
  let row = document.getElementsByClassName("letterRow")[6 - guessesRemaining];
  let guessString = "";

  let rightGuess = Array.from(rightGuessString);

  for (const val of currentGuess) {
    guessString += val;
  }

  if (guessString.length != 5) {
    alert("not enough letters");
    return;
  }

  if (!WORDS.includes(guessString)) {
    alert("not in word list");
    return;
  }

  let guessColors = new Array(5).fill("grey");

  // First pass: Check for Green
  for (let i = 0; i < 5; i++) {
    if (currentGuess[i] === rightGuessString[i]) {
      guessColors[i] = "green";
      rightGuess[i] = "#";
    }
    shadeKeyboard(currentGuess[i], guessColors[i]);
  }

  // Second pass: Check for Yellow
  for (let i = 0; i < 5; i++) {
    if (guessColors[i] === "green") continue;

    let letter = currentGuess[i];
    let index = rightGuess.indexOf(letter);

    if (index !== -1) {
      guessColors[i] = "yellow";
      rightGuess[index] = "#";
    }
    shadeKeyboard(currentGuess[i], guessColors[i]);
  }

  for (let i = 0; i < 5; i++) {
    let box = row.children[i];
    let delay = 250 * i;
    setTimeout(() => {
      box.style.backgroundColor = guessColors[i];
      shadeKeyboard(currentGuess[i], guessColors[i]);
    }, delay);
  }
  
  if (guessString === rightGuessString) {
    setTimeout(() => {
        alert("You Guessed it right, game over")
    },1250)
    guessesRemaining = 0
    return
  }

  guessesRemaining -= 1
  currentGuess = []
  nextLetter = 0

  if (guessesRemaining === 0) {
    setTimeout(() => {
        alert("You have run out of moves!")
        alert(`game over, the right word was: "${rightGuessString}"`)
    },1250)
  }
}

function shadeKeyboard(letter, color) {
    for (const element of document.getElementsByClassName("keyboard-button")) {
        if (element.textContent.toLowerCase() === letter.toLowerCase()) {
            
            let oldColor = element.getAttribute('data-color');
            
            // Priority: green > yellow > grey
            // If already green, never override
            if (oldColor === 'green') {
                return;
            }
            
            // If already yellow, only override with green
            if (oldColor === 'yellow' && color !== 'green') {
                return;
            }
            
            // If trying to set grey but already have yellow or green, skip
            if (color === 'grey' && (oldColor === 'yellow' || oldColor === 'green')) {
                return;
            }

            // Apply new color and save status
            element.style.backgroundColor = color;
            element.setAttribute('data-color', color);
            break;
        }
    }
}

initBoard();

document.addEventListener("keyup", (e) => {
  if (guessesRemaining === 0) {
    return;
  }

  let pressedKey = String(e.key);

  if (pressedKey === "Backspace" && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  if (pressedKey === "Enter") {
    checkGuess();
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});

document.querySelectorAll(".keyboard-button").forEach(button => {
  button.addEventListener("click", (e) => {
    if (guessesRemaining === 0) {
      return;
    }

    let pressedKey = e.target.textContent;

    if (pressedKey === "Del" && nextLetter !== 0) {
      deleteLetter();
      return;
    }

    if (pressedKey === "Enter") {
      checkGuess();
      return;
    }

    let found = pressedKey.match(/[a-z]/gi);
    if (!found || found.length > 1) {
      return;
    } else {
      insertLetter(pressedKey);
    }
  });
});
