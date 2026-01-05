const MAX_GUESSES = 6;
let guessesRemaining = MAX_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let validWords = [];
let rightGuessString = "";
const MS_PER_DAY = 86400000;

const EPOCH = new Date(Date.UTC(2026, 0, 1));

function daysSinceEpoch(epoch) {
  const now = new Date();

  const todayUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  const epochUTC = Date.UTC(
    epoch.getUTCFullYear(),
    epoch.getUTCMonth(),
    epoch.getUTCDate()
  );

  return Math.floor((todayUTC - epochUTC) / MS_PER_DAY);
}

const loadWords = async () => {
  const response = await fetch("cipher.txt");
  const text = await response.text();
  validWords = text
    .split("\n")
    .map((w) => w.trim())
    .filter((w) => w.length === 5 && /^[a-z]+$/.test(w));
  rightGuessString = validWords[daysSinceEpoch(EPOCH)];
};

// Load words when the page loads
loadWords();

// console.log(rightGuessString); // my little brother wrote this ❤️

const animateCSS = (element, animation, prefix = "animate__") =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = element;

    node.style.setProperty("--animate-duration", "0.25s");
    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("animation Ended");
    }
    node.addEventListener("animationend", handleAnimationEnd, { once: "true" });
  });

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

  animateCSS(box, "pulse");
  box.textContent = pressedKey;
  box.classList.add("filled-box");

  currentGuess.push(pressedKey);
  nextLetter += 1;
}

function deleteLetter() {
  let row = document.getElementsByClassName("letterRow")[6 - guessesRemaining];
  let box = row.children[nextLetter - 1];

  animateCSS(box, "pulse");
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
    toastr.error("Not Enough Letters!");
    return;
  }

  if (!validWords.includes(guessString)) {
    toastr.error("Not a Word!");
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
      animateCSS(box, "bounceIn");
      box.style.backgroundColor = guessColors[i];
      shadeKeyboard(currentGuess[i], guessColors[i]);
    }, delay);
  }

  if (guessString === rightGuessString) {
    setTimeout(() => {
      toastr.success("You Guessed it right, game over");
    }, 1250);
    guessesRemaining = 0;
    return;
  }

  guessesRemaining -= 1;
  currentGuess = [];
  nextLetter = 0;

  if (guessesRemaining === 0) {
    setTimeout(() => {
      toastr.error("You have run out of moves!");
    }, 1250);
  }
}

function shadeKeyboard(letter, color) {
  for (const element of document.getElementsByClassName("keyboard-button")) {
    if (element.textContent.toLowerCase() === letter.toLowerCase()) {
      let oldColor = element.getAttribute("data-color");

      if (oldColor === "green") {
        return;
      }

      if (oldColor === "yellow" && color !== "green") {
        return;
      }

      if (color === "grey" && (oldColor === "yellow" || oldColor === "green")) {
        return;
      }

      // Apply new color and save status
      element.style.backgroundColor = color;
      animateCSS(element, "bounceIn");
      element.setAttribute("data-color", color);
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

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;
  if (!target.classList.contains("keyboard-button")) {
    return;
  }
  let key = target.textContent;

  animateCSS(target, "bounceIn");
  if (key === "Del") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});
