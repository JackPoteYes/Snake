const CELLS = [];
const GRID_LENGTH = 12;
const ROOT_ID = "root";
const SHADES_NB = 5;
const INITIAL_HEAD_INDEX = [0, 3];
var LOOP_PERIOD = 250;
var ACCELERATION = 20;
var SCORE = 0;

let direction = "right";
let count = 0;
let snake = [INITIAL_HEAD_INDEX];
let nbFireColoredCells = 0;

var lastBodyPartPreviousLocation = null;
var MAIN_LOOP = null;
var RUNNING = false;
var FOOD_LOCATION = getRandomLocation();

initPage();

function loop() {
  MAIN_LOOP = setInterval(() => {
    const headIndex = snake[0];
    let newHeadIndex = [null, null];
    switch (direction) {
      case "right":
        newHeadIndex =
          headIndex[1] % GRID_LENGTH === GRID_LENGTH - 1
            ? [headIndex[0], headIndex[1] - (GRID_LENGTH - 1)]
            : [headIndex[0], headIndex[1] + 1];
        break;
      case "left":
        newHeadIndex =
          headIndex[1] % GRID_LENGTH === 0
            ? [headIndex[0], headIndex[1] + (GRID_LENGTH - 1)]
            : [headIndex[0], headIndex[1] - 1];
        break;
      case "down":
        newHeadIndex =
          headIndex[0] % GRID_LENGTH === GRID_LENGTH - 1
            ? [headIndex[0] - (GRID_LENGTH - 1), headIndex[1]]
            : [headIndex[0] + 1, headIndex[1]];
        break;
      case "up":
        newHeadIndex =
          headIndex[0] % GRID_LENGTH === 0
            ? [headIndex[0] + (GRID_LENGTH - 1), headIndex[1]]
            : [headIndex[0] - 1, headIndex[1]];
        break;
    }
    moveSnake(newHeadIndex);
    if (snakeBitesItself()) {
      stopLoop();
      failAnimation();
    }
    if (snakeIsOnFood()) {
      growSnake();
      dropFood();
      accelerate();
      incrementScore();
    }
  }, LOOP_PERIOD);
  RUNNING = true;
}

function incrementScore() {
  const scoreElem = document.getElementById("score");
  console.log(scoreElem);
  scoreElem.innerText = (++SCORE).toString();
}

function accelerate() {
  LOOP_PERIOD = LOOP_PERIOD - ACCELERATION;
  stopLoop();
  loop();
  ACCELERATION = ACCELERATION > 4 ? ACCELERATION - 2 : ACCELERATION;
}

function failAnimation() {
  // Get the head coords
  const head = [...snake[0]];
  // Erase the snake
  snake.map(snakePart => emptyCell(getCell(...snakePart)));
  // Erase the food
  emptyCell(getCell(...FOOD_LOCATION));

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
  clearInterval(MAIN_LOOP);
  RUNNING = false;
}

function snakeIsOnFood() {
  return snake[0][0] == FOOD_LOCATION[0] && snake[0][1] == FOOD_LOCATION[1];
}

function growSnake() {
  snake.push([...lastBodyPartPreviousLocation]);
}

function dropFood() {
  FOOD_LOCATION = getRandomLocation();
  fillFoodCell(getCell(...FOOD_LOCATION));
}

function snakeBitesItself() {
  return (
    snake
      .slice(1)
      .filter(
        snakePart => snakePart[0] == snake[0][0] && snakePart[1] == snake[0][1],
      ).length > 0
  );
}

document.addEventListener("keydown", event => {
  switch (event.keyCode) {
    case 40:
      direction = "down";
      break;
    case 37:
      direction = "left";
      break;
    case 38:
      direction = "up";
      break;
    case 39:
      direction = "right";
      break;
    case 32:
      RUNNING ? stopLoop() : loop();
      break;
  }
});

function moveSnake(newIndex) {
  // Empty last bit
  emptyCell(getCell(...snake[snake.length - 1]));

  lastBodyPartPreviousLocation = snake[snake.length - 1];

  // Update snake's indexes
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i] = snake[i - 1];
  }
  snake[0] = newIndex;

  // Fill first bit (head)
  fillCell(getCell(...snake[0]));
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
  return CELLS[x][y];
}

function initPage() {
  const container = document.getElementById(ROOT_ID);
  const table = document.createElement("table");
  for (let row = 0; row < GRID_LENGTH; row++) {
    const tr = document.createElement("tr");
    CELLS.push([]);
    for (let col = 0; col < GRID_LENGTH; col++) {
      const cell = document.createElement("td");
      cell.y = row;
      cell.x = col;
      const cellContent = document.createElement("div");
      cellContent.className = "cell-content";
      cell.appendChild(cellContent);
      tr.appendChild(cell);
      CELLS[row].push(cell);
    }
    table.appendChild(tr);
  }
  container.appendChild(table);
  snake.map(cellIndex => fillCell(getCell(...cellIndex)));
  fillFoodCell(getCell(...FOOD_LOCATION));
}

function getRandomLocation() {
  do {
    var [x, y] = [
      (Math.random() * (GRID_LENGTH - 1)).toFixed(),
      (Math.random() * (GRID_LENGTH - 1)).toFixed(),
    ];
  } while (
    snake.filter(
      snakePartIndex => snakePartIndex[0] == x && snakePartIndex[1] == y,
    ).length > 0
  );
  return [x, y];
}
