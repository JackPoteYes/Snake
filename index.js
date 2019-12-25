const CELLS = [];
const GRID_LENGTH = 12;
const ROOT_ID = "root";
const SHADES_NB = 5;
const INITIAL_HEAD_INDEX = [0, 0];
const LOOP_PERIOD = 100;

let direction = "right";
let count = 0;
let headIndex = INITIAL_HEAD_INDEX;

let MAIN_LOOP = null;

initPage(() => {
  loop();
});

function loop() {
  MAIN_LOOP = setInterval(() => {
    let newIndex = [null, null];
    switch (direction) {
      case "right":
        newIndex =
          headIndex[1] % 12 === 11
            ? [headIndex[0], headIndex[1] - 11]
            : [headIndex[0], headIndex[1] + 1];
        break;
      case "left":
        newIndex =
          headIndex[1] % 12 === 0
            ? [headIndex[0], headIndex[1] + 11]
            : [headIndex[0], headIndex[1] - 1];
        break;
      case "down":
        newIndex =
          headIndex[0] % 12 === 11
            ? [headIndex[0] - 11, headIndex[1]]
            : [headIndex[0] + 1, headIndex[1]];
        break;
      case "up":
        newIndex =
          headIndex[0] % 12 === 0
            ? [headIndex[0] + 11, headIndex[1]]
            : [headIndex[0] - 1, headIndex[1]];
        break;
    }
    updateHead(newIndex);
  }, LOOP_PERIOD);
}

function stopLoop() {
  clearInterval(MAIN_LOOP);
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
  }
});

function updateHead(newIndex) {
  toggleCell(getCell(...headIndex));
  toggleCell(getCell(...newIndex));
  headIndex = newIndex;
}

function toggleCell(cellElement) {
  cellElement.className =
    cellElement.className.length > "cell-content".length
      ? "cell-content"
      : "cell-content snake";
}

function getCell(x, y) {
  return CELLS[x][y];
}

function initPage(cb) {
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
  toggleCell(getCell(...INITIAL_HEAD_INDEX));
  cb();
}
