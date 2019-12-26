// Config
const INITIAL_CONFIG = {
  CELLS: [],
  GRID_LENGTH: 12,
  ROOT_CONTAINER: document.getElementById("root"),
  SNAKE: [[0, 3]],
  LOOP_PERIOD: 250,
  ACCELERATION: 20,
  SCORE: 0,
  STATE_FAIL: false,
  DIRECTION: "right",
  MAIN_LOOP: null,
  LAST_BODY_PART_PREVIOUS_LOCATION: null,
  RUNNING: false,
  FOOD_LOCATION: null,
};

// Globals
var GLOBALS = null;

initPage();

function loop() {
  GLOBALS.MAIN_LOOP = setInterval(() => {
    const headIndex = GLOBALS.SNAKE[0];
    let newHeadIndex = [null, null];
    switch (GLOBALS.DIRECTION) {
      case "right":
        newHeadIndex =
          headIndex[1] % GLOBALS.GRID_LENGTH === GLOBALS.GRID_LENGTH - 1
            ? [headIndex[0], headIndex[1] - (GLOBALS.GRID_LENGTH - 1)]
            : [headIndex[0], headIndex[1] + 1];
        break;
      case "left":
        newHeadIndex =
          headIndex[1] % GLOBALS.GRID_LENGTH === 0
            ? [headIndex[0], headIndex[1] + (GLOBALS.GRID_LENGTH - 1)]
            : [headIndex[0], headIndex[1] - 1];
        break;
      case "down":
        newHeadIndex =
          headIndex[0] % GLOBALS.GRID_LENGTH === GLOBALS.GRID_LENGTH - 1
            ? [headIndex[0] - (GLOBALS.GRID_LENGTH - 1), headIndex[1]]
            : [headIndex[0] + 1, headIndex[1]];
        break;
      case "up":
        newHeadIndex =
          headIndex[0] % GLOBALS.GRID_LENGTH === 0
            ? [headIndex[0] + (GLOBALS.GRID_LENGTH - 1), headIndex[1]]
            : [headIndex[0] - 1, headIndex[1]];
        break;
    }
    moveSnake(newHeadIndex);
    if (snakeBitesItself()) {
      GLOBALS.STATE_FAIL = true;
      stopLoop();
      failAnimation();
      setTimeout(displayTryAgain(), 1000);
    }
    if (snakeIsOnFood()) {
      growSnake();
      dropFood();
      accelerate();
      incrementScore();
    }
  }, GLOBALS.LOOP_PERIOD);
  GLOBALS.RUNNING = true;
}

function tryAgain() {
  removeTryAgain();
  GLOBALS.STATE_FAIL = false;
  const rootElem = document.getElementById("root");
  // Remove all its children
  while (rootElem.firstChild) {
    rootElem.removeChild(rootElem.firstChild);
  }
  rootElem.innerHtml = "";
  initPage();
}

function displayTryAgain() {
  const tryAgainConteainer = document.getElementById("try-again-container");
  tryAgainConteainer.className = "";
}

function removeTryAgain() {
  const tryAgainConteainer = document.getElementById("try-again-container");
  tryAgainConteainer.className = "dontdisplay";
}

function incrementScore() {
  setScore(++GLOBALS.SCORE);
}

function setScore(nb) {
  const scoreElem = document.getElementById("score");
  scoreElem.innerText = nb.toString();
}

function accelerate() {
  GLOBALS.LOOP_PERIOD = GLOBALS.LOOP_PERIOD - GLOBALS.ACCELERATION;
  stopLoop();
  loop();
  GLOBALS.ACCELERATION =
    GLOBALS.ACCELERATION > 4 ? GLOBALS.ACCELERATION - 2 : GLOBALS.ACCELERATION;
}

function failAnimation() {
  // Get the head coords
  const head = [...GLOBALS.SNAKE[0]];
  // Erase the snake
  GLOBALS.SNAKE.map(snakePart => emptyCell(getCell(...snakePart)));
  // Erase the food
  emptyCell(getCell(...GLOBALS.FOOD_LOCATION));

  // Explosion 1
  const iterateSuite = [0, -1, 1];
  let count = 0;
  iterateSuite.map(x =>
    iterateSuite.map(y =>
      setTimeout(() => {
        fillFireCell(getCell(head[0] + x, head[1] + y));
      }, ++count * 10),
    ),
  );

  // Explosion 2 (Extra layer)
  setTimeout(() => {
    const suite = [-2, -1, 0, 1, 2];
    let count2 = 0;
    suite.map(x =>
      suite.map(y =>
        setTimeout(() => {
          try {
            fillFireCell(getCell(head[0] + x, head[1] + y));
          } catch (e) {
            // pass
          }
        }, ++count2 * 5),
      ),
    );
  }, 50);
}

function stopLoop() {
  clearInterval(GLOBALS.MAIN_LOOP);
  GLOBALS.RUNNING = false;
}

function snakeIsOnFood() {
  return (
    GLOBALS.SNAKE[0][0] == GLOBALS.FOOD_LOCATION[0] &&
    GLOBALS.SNAKE[0][1] == GLOBALS.FOOD_LOCATION[1]
  );
}

function growSnake() {
  GLOBALS.SNAKE.push([...GLOBALS.LAST_BODY_PART_PREVIOUS_LOCATION]);
}

function dropFood() {
  GLOBALS.FOOD_LOCATION = getRandomLocation();
  fillFoodCell(getCell(...GLOBALS.FOOD_LOCATION));
}

function snakeBitesItself() {
  return (
    GLOBALS.SNAKE.slice(1).filter(
      snakePart =>
        snakePart[0] == GLOBALS.SNAKE[0][0] &&
        snakePart[1] == GLOBALS.SNAKE[0][1],
    ).length > 0
  );
}

document.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case 40:
      GLOBALS.DIRECTION = "down";
      break;
    case 37:
      GLOBALS.DIRECTION = "left";
      break;
    case 38:
      GLOBALS.DIRECTION = "up";
      break;
    case 39:
      GLOBALS.DIRECTION = "right";
      break;
    case 32:
      GLOBALS.STATE_FAIL ? tryAgain() : GLOBALS.RUNNING ? stopLoop() : loop();
      break;
  }
});

function moveSnake(newIndex) {
  // Empty last bit
  emptyCell(getCell(...GLOBALS.SNAKE[GLOBALS.SNAKE.length - 1]));

  GLOBALS.LAST_BODY_PART_PREVIOUS_LOCATION =
    GLOBALS.SNAKE[GLOBALS.SNAKE.length - 1];

  // Update snake's indexes
  for (let i = GLOBALS.SNAKE.length - 1; i > 0; i--) {
    GLOBALS.SNAKE[i] = GLOBALS.SNAKE[i - 1];
  }
  GLOBALS.SNAKE[0] = newIndex;

  // Fill first bit (head)
  fillCell(getCell(...GLOBALS.SNAKE[0]));
}

function toggleCell(cellElement) {
  cellElement.className =
    cellElement.className.length > "cell-content".length
      ? "cell-content"
      : "cell-content snake";
}

function fillFoodCell(cellElement) {
  cellElement.className = "cell-content food";
}

function fillFireCell(cellElement) {
  cellElement.className = "cell-content fire";
}

function fillCell(cellElement) {
  cellElement.className = "cell-content snake";
}

function emptyCell(cellElement) {
  cellElement.className = "cell-content";
}

function getCell(x, y) {
  return GLOBALS.CELLS[x][y];
}

function initPage() {
  GLOBALS = { ...INITIAL_CONFIG };
  setScore(GLOBALS.SCORE);
  GLOBALS.FOOD_LOCATION = getRandomLocation();
  const table = document.createElement("table");
  for (let row = 0; row < GLOBALS.GRID_LENGTH; row++) {
    const tr = document.createElement("tr");
    GLOBALS.CELLS.push([]);
    for (let col = 0; col < GLOBALS.GRID_LENGTH; col++) {
      const cell = document.createElement("td");
      cell.y = row;
      cell.x = col;
      const cellContent = document.createElement("div");
      cellContent.className = "cell-content";
      cell.appendChild(cellContent);
      tr.appendChild(cell);
      GLOBALS.CELLS[row].push(cell);
    }
    table.appendChild(tr);
  }
  GLOBALS.ROOT_CONTAINER.appendChild(table);
  GLOBALS.SNAKE.map(cellIndex => {
    console.log([...cellIndex]);
    fillCell(getCell(...cellIndex));
  });
  fillFoodCell(getCell(...GLOBALS.FOOD_LOCATION));
}

function getRandomLocation() {
  do {
    var [x, y] = [
      (Math.random() * (GLOBALS.GRID_LENGTH - 1)).toFixed(),
      (Math.random() * (GLOBALS.GRID_LENGTH - 1)).toFixed(),
    ];
  } while (
    GLOBALS.SNAKE.filter(
      snakePartIndex => snakePartIndex[0] == x && snakePartIndex[1] == y,
    ).length > 0
  );
  return [x, y];
}
