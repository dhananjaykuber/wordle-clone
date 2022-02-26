const tileContainer = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');

let wordle;

const getWordle = async () => {
  await fetch('https://wordle-clone-app.vercel.app/word')
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      wordle = json.message.toUpperCase();
    })
    .catch((err) => console.log(err));
};

getWordle();

const keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'ENTER',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  'BACK',
];

const guessRows = [
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
  ['', '', '', '', '', ''],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement('div');
  rowElement.setAttribute('id', `guessRow-${guessRowIndex}`);

  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement('div');
    tileElement.setAttribute(
      'id',
      `guessRow-${guessRowIndex}-tile-${guessIndex}`
    );
    tileElement.classList.add('tile');
    rowElement.append(tileElement);
  });

  tileContainer.append(rowElement);
});

keys.forEach((key) => {
  const button = document.createElement('button');
  button.textContent = key;
  button.setAttribute('id', key);
  button.addEventListener('click', () => handleClick(key));
  keyboard.append(button);
});

const handleClick = (letter) => {
  if (!isGameOver) {
    console.log(letter);
    if (letter === 'BACK') {
      console.log('backspace');
      deleteLetter();
      return;
    }
    if (letter === 'ENTER') {
      console.log('check row');
      checkRow();
      return;
    }
    addLetter(letter);
  }
};

const addLetter = (letter) => {
  if (currentTile <= 5 && currentRow <= 5) {
    const tile = document.getElementById(
      `guessRow-${currentRow}-tile-${currentTile}`
    );
    tile.textContent = letter;
    tile.setAttribute('data', letter);
    guessRows[currentRow][currentTile] = letter;
    currentTile++;
    console.log(guessRows);
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      `guessRow-${currentRow}-tile-${currentTile}`
    );
    tile.textContent = '';
    guessRows[currentRow][currentTile] = '';
    tile.setAttribute('data', '');
    console.log(guessRows);
  }
};

const checkRow = () => {
  const guess = guessRows[currentRow].join('');

  if (currentTile > 5) {
    document.querySelector('#ENTER').disabled = true;

    fetch(`https://wordle-clone-app.vercel.app/check/${guess}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json.message === "The word doesn't exists.") {
          alert('word not in list');
          document.querySelector('#ENTER').disabled = false;
          return;
        } else {
          flipTile();
          console.log(guess + ' ' + wordle);
          if (wordle === guess) {
            isGameOver = true;
            alert('Won');
            document.querySelector('#ENTER').disabled = false;
            return;
          } else {
            if (currentRow >= 5) {
              isGameOver = true;
              alert('Game over');
              return;
            }
            if (currentRow <= 5) {
              currentRow++;
              currentTile = 0;
            }
            document.querySelector('#ENTER').disabled = false;
          }
        }
      });
  }
};

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
};

const flipTile = () => {
  const rowTiles = document.querySelector(`#guessRow-${currentRow}`).childNodes;
  rowTiles.forEach((tile, index) => {
    const dataLetter = tile.getAttribute('data');

    setTimeout(() => {
      tile.classList.add('flip');
      if (dataLetter === wordle[index]) {
        tile.classList.add('green-overlay');
        addColorToKey(dataLetter, 'green-overlay');
      } else if (wordle.includes(dataLetter)) {
        tile.classList.add('yellow-overlay');
        addColorToKey(dataLetter, 'yellow-overlay');
      } else {
        tile.classList.add('grey-overlay');
        addColorToKey(dataLetter, 'grey-overlay');
      }
    }, 500 * index);
  });
};
