/**
 * Ordle
 * Martin Hansson, maha6445
 */

/* GLOBAL VARIABLES */
// Game
const words = [
  "MAGER",
  "GALEN",
  "ORTEN",
  "IDEAL",
  "DAGIS",
  "MÄRKE",
  "ÖNSKA",
  "ÖKÄND",
  "ZEBRA",
  "YNGEL",
  "ANEMI",
  "ÄDELT",
  "ÄLSKA",
  "ÄMNET",
  "ÄGARE",
  "ÄLGAR",
  "DAMER",
  "DELAT",
  "DISKO",
  "DOMNA",
  "DUNKA",
  "DEBUT",
  "FACIT",
  "FATÖL",
  "FICKA",
  "FIRAS",
  "FLANK",
  "ODÅGA",
  "OKLAR",
  "OLJIG",
  "OMGIV",
  "ORGAN",
  "OSADE",
  "OTÄCK",
  "CYSTA",
  "CYKLA",
  "CHIPS",
  "CHARM",
  "CHARK",
  "KAJEN",
  "KAMEL",
  "KELAR",
  "KILON",
  "KLART",
  "LADOR",
  "LAGEN",
  "LAGOM",
  "LEDAS",
  "LEDIG",
  "LERIG",
  "LYFTA",
  "LIMBO",
  "LIKÖR",
  "MAGER",
  "MANGO",
  "MANER",
  "MATCH",
  "MEDIA",
  "MELON",
  "MENAD",
  "MILDA",
  "MINUS",
  "MISÄR",
  "MOBIL",
  "MYCKET",
  "MÄTER",
  "HAJEN",
  "HALFT",
  "HEJDÅ",
  "HICKA",
  "HOTAD",
  "HUMÖR",
  "HYENA",
  "HÄMTA",
  "HÄVAS",
  "HÖFTA",
  "HÖJES",
];
let correctWord;
let guesses = 0;
let correct = false;
const $gameMessage = $("#game-message");

// Game statistics
let statsData = {
  played: 0,
  won: 0,
  percentage: 0,
  streak: 0,
  max: 0,
  guesses: [0, 0, 0, 0, 0, 0],
};

// Navigation
const $navBtns = $("nav").children("button");
const $helpBtn = $("#help-btn");
const $statsBtn = $("#stats-btn");

// Dialog
const dialogOptions = {
  autoOpen: false,
  modal: true,
  resizable: false,
  draggable: false,
  width: "auto",
  position: {
    my: "center",
    at: "center",
    of: window,
  },
  show: {
    effect: "fade",
  },
  hide: {
    effect: "fade",
  },
};
const $helpDialog = $("#help-dialog");
const $statsDialog = $("#stats-dialog");

// Board
let $activeRow = $(".active-row");
let $active = $(".active");

// Keyboard
const $keyboard = $(".keyboard");
const $keys = $keyboard.children().children(".key");
const $deleteBtn = $("#delete-btn");
const $enterBtn = $("#enter-btn");
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "Å",
  "Ä",
  "Ö",
];

/* FUNCTIONS */
// Change active row to next
const changeRow = () => {
  $activeRow.removeClass("active-row");
  $activeRow = $activeRow.next("div");
  $activeRow.addClass("active-row");
  $active = $($activeRow.children()[0]);
  $active.addClass("active");
};

// Log key in current tile and move to the right
const logKey = (text) => {
  if ($active.next().length === 0 && $active.hasClass("filled")) return;

  $active.append(text);
  $active.addClass("filled");

  if ($active.next().length > 0) {
    $active.removeClass("active");
    $active = $active.next();
    $active.addClass("active");
  }
};

// Check which key was pressed
const checkKeyCode = (key) => {
  if (key === "BracketLeft") key = "Å";
  else if (key === "Quote") key = "Ä";
  else if (key === "Semicolon") key = "Ö";
  else key = key.replace("Key", "");

  return key;
};

// Reset the background
const resetBg = (element) => {
  $(element).removeClass("grey yellow green");
};

// Update keyboard after guess is entered
const updateKeyboard = (div) => {
  const $div = $(div);

  for (let key of $keys) {
    let $key = $(key);
    if ($key.text() === $div.text()) {
      resetBg($key);

      if ($div.hasClass("grey")) {
        $key.addClass("grey");
      } else if ($div.hasClass("yellow")) {
        $key.addClass("yellow");
      } else {
        $(key).addClass("green");
      }
    }
  }
};

// Check if guessed word is the correct one
const checkGuess = () => {
  const guess = [];
  for (let div of $activeRow.children()) {
    guess.push($(div).text().toUpperCase());
    $(div).removeClass("filled");
  }

  for (let i = 0; i < guess.length; i++) {
    if (!correctWord.includes(guess[i])) {
      $($activeRow.children()[i]).addClass("grey");
    } else if (correctWord.includes(guess[i]) && guess[i] !== correctWord[i]) {
      $($activeRow.children()[i]).addClass("yellow");
    } else {
      $($activeRow.children()[i]).addClass("green");
    }

    updateKeyboard($activeRow.children()[i]);
  }

  guesses++;
  if (hasWon()) {
    correct = true;
    stopGame();
  } else if (guesses === 6 && !hasWon()) {
    stopGame();
  }
};

// Check if player has won
const hasWon = () => {
  for (let div of $activeRow.children()) {
    if (!$(div).hasClass("green")) {
      return false;
    }
  }

  return true;
};

// Initialises game
const startGame = () => {
  // Välj ett random ord från listan
  const randIndex = Math.floor(Math.random() * words.length);
  correctWord = words[randIndex];

  updateStats();

  $helpDialog.dialog(dialogOptions);
  $statsDialog.dialog(dialogOptions);
  $(".ui-button").html('<span class="material-symbols-rounded"> close </span>');
};

// End game
const stopGame = () => {
  if (!correct) {
    $gameMessage.text(`Rätt ord: ${correctWord}`);
  }

  $gameMessage.show("fade");

  setTimeout(() => {
    $gameMessage.hide("fade");
  }, 5000);

  $(document).off("keydown", handleKey);
  $keys.off("click", handleKeyBtn);
  $deleteBtn.off("click", deleteKey);
  $enterBtn.off("click", enterWord);

  setStats();
  updateStats();
};

// Get data from localStorage
const getStats = () => {
  statsData.played = Number(localStorage.getItem("played")) || 0;
  statsData.won = Number(localStorage.getItem("won")) || 0;
  statsData.streak = Number(localStorage.getItem("streak")) || 0;
  statsData.max = Number(localStorage.getItem("max")) || 0;

  // Hämta gissningar
  for (let i = 0; i < statsData.guesses.length; i++) {
    statsData.guesses[i] = Number(localStorage.getItem(`guess-${i + 1}`) || 0);
  }
};

// Sets data in localStorage
const setStats = () => {
  localStorage.setItem("played", statsData.played + 1);

  // Update if player won the game
  if (correct) {
    localStorage.setItem("won", statsData.won + 1);
    localStorage.setItem("streak", statsData.streak + 1);

    if (statsData.max <= statsData.streak)
      localStorage.setItem("max", statsData.max + 1);

    localStorage.setItem(
      `guess-${guesses}`,
      statsData.guesses[guesses - 1] + 1
    );
  } else {
    localStorage.setItem("streak", 0); // Reset streak if player lost
  }
};

// Updates statsDialog with data
const updateStats = () => {
  getStats();

  if (statsData.played) {
    statsData.percentage = Math.round((statsData.won / statsData.played) * 100);
  }

  // Uppdatera statistiken
  $("#games-played").text(statsData.played);
  $("#win-percentage").text(statsData.percentage);
  $("#current-streak").text(statsData.streak);
  $("#max-streak").text(statsData.max);

  // Uppdatera grafen över gissningar
  let maxGuess = 0;
  for (let i = 0; i < statsData.guesses.length; i++) {
    if (maxGuess < statsData.guesses[i]) {
      maxGuess = statsData.guesses[i];
    }
  }

  for (let i = 0; i < statsData.guesses.length; i++) {
    if (statsData.guesses[i]) {
      $(`#guess-${i + 1}`).text(statsData.guesses[i]);
      if (maxGuess) {
        let width = Math.round((statsData.guesses[i] / maxGuess) * 100);
        $(`#guess-${i + 1}`).css("width", `${width}%`);
      }
    }
  }
};

/* EVENT HANDLERS */
// Logs pressed key from the keyboard module
const handleKeyBtn = (e) => {
  logKey($(e.target).text());
};

// Checks keycode and handles key
const handleKey = (e) => {
  const key = checkKeyCode(e.code);

  if (alphabet.includes(key)) logKey(key);
  else if (e.code === "Backspace") deleteKey();
  else if (e.code === "Enter") enterWord();
};

// Deletes letter from tile
const deleteKey = () => {
  if ($active.prev().length === 0) return;

  if ($active.next().length === 0 && $active.hasClass("filled")) {
    $active.empty();
    $active.removeClass("filled");
  } else {
    $active.removeClass("active");
    $active = $active.prev();
    $active.addClass("active");
    $active.removeClass("filled");
    $active.empty();
  }
};

// Checks if entered word is correct and changes row
const enterWord = () => {
  if ($active.next().length === 0 && $active.hasClass("filled")) {
    checkGuess();
    changeRow();
  }
};

// Opens the dialog and changes close button icon
const openDialog = (e) => {
  const $target = $(e.target).parent();

  if ($target.is($helpBtn)) $helpDialog.dialog("open");
  else if ($target.is($statsBtn)) $statsDialog.dialog("open");
};

/* EVENT LISTENERS */
$(document).on("keydown", handleKey);
$keys.on("click", handleKeyBtn);
$deleteBtn.on("click", deleteKey);
$enterBtn.on("click", enterWord);
$navBtns.on("click", openDialog);

// Start game
startGame();
