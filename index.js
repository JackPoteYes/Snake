const shadesNb = 5;
let count = 0;
var loopPeriod = 75;
let cells = document.getElementsByClassName("cell-content");
let direction = "right";
let headIndex = 0;
toggleCell(cells[headIndex]);

var mainLoop = setInterval(() => {
  let newIndex = 0;
  switch (direction) {
    case "right":
      newIndex = headIndex % 12 === 11 ? headIndex - 11 : headIndex + 1;
      break;
    case "left":
      newIndex = headIndex % 12 === 0 ? headIndex + 11 : headIndex - 1;
      break;
    case "down":
      newIndex = (headIndex + 12) % cells.length;
      break;
    case "up":
      newIndex =
        headIndex < 12 ? cells.length - 12 + headIndex : headIndex - 12;
      break;
  }
  updateHead(newIndex);
}, 100);

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
  cells[headIndex].className = "cell-content";
  cells[newIndex].className = "cell-content snake";
  headIndex = newIndex;
}

function toggleCell(cellElement) {
  cellElement.className =
    cellElement.className.length > "cell-content".length
      ? "cell-content"
      : "cell-content snake";
}
