import { WORDS } from "./words.js";

const MAX_GUESSES = 6;
let guessesRemaining = MAX_GUESSES;
let currentGuess = [];
let nextLetter = 0;

let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];

console.log(rightGuessString);

function initBoard() {
    let board = document.getElementById("gameBoard")

    for (let i = 0; i < MAX_GUESSES; i++) {
        
        let row = document.createElement("div")
        row.className = "letterRow"

        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letterBox"

            row.appendChild(box)

        }

        board.appendChild(row)

    }
}

initBoard()
