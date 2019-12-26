const CELLS = [];
const GRID_LENGTH = 12;
const ROOT_ID = "root";
const SHADES_NB = 5;
const INITIAL_HEAD_INDEX = [0, 1];
const LOOP_PERIOD = 100;

let direction = "right";
let count = 0;
let snake = [INITIAL_HEAD_INDEX, [0, 0]];

var MAIN_LOOP = null;
var RUNNING = false;

initPage();

function loop() {
  MAIN_LOOP = setInterval(() => {
    const headIndex = snake[0];
    let newHeadIndex = [null, null];
    switch (direction) {
      case "right":
        newHeadIndex =
          headIndex[1] % 12 === 11
            ? [headIndex[0], headIndex[1] - 11]
            : [headIndex[0], headIndex[1] + 1];
        break;
      case "left":
        newHeadIndex =
          headIndex[1] % 12 === 0
            ? [headIndex[0], headIndex[1] + 11]
            : [headIndex[0], headIndex[1] - 1];
        break;
      case "down":
        newHeadIndex =
          headIndex[0] % 12 === 11
            ? [headIndex[0] - 11, headIndex[1]]
            : [headIndex[0] + 1, headIndex[1]];
        break;
      case "up":
        newHeadIndex =
          headIndex[0] % 12 === 0
            ? [headIndex[0] + 11, headIndex[1]]
            : [headIndex[0] - 1, headIndex[1]];
        break;
    }
    moveSnake(newHeadIndex);
  }, LOOP_PERIOD);
  RUNNING = true;
}

function stopLoop() {
  clearInterval(MAIN_LOOP);
  RUNNING = false;
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

  // Update snake's indexes
  for (let i = 0; i < snake.length - 1; i++) {
    snake[i + 1] = snake[i];
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
}
