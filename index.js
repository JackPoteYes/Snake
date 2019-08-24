const shadesNb = 5;
let count = 0;
var loopPeriod = 75;
let cells = document.getElementsByClassName("cell-content");
toggleCell(cells[0])

let cellsObjects = [];
for (let i = 0; i < cells.length; i ++)
{
    cellsObjects.push(
        {
            element: cells[i],
            state: i % shadesNb,
        }
    );
}



var mainLoop = createMainLoopInterval(loopPeriod);


function changeLoopSpeed(increase)
{
    clearInterval(mainLoop);
    loopPeriod += increase ? -10 : 10;
    mainLoop = createMainLoopInterval(loopPeriod);
}

function createMainLoopInterval(loopPeriod)
{
    return setInterval(() => {
        for (let i = 0; i < cellsObjects.length; i++)
        {
            cellsObjects[i].state ++;
            cellsObjects[i].element.className = "cell-content selected-" + (cellsObjects[i].state % shadesNb).toString();
        }
    }, loopPeriod);
}


function toggleCell(cellElement) {
    cellElement.className = (cellElement.className.length > "cell-content".length ? "cell-content" : "cell-content selected");
}

document.addEventListener("keydown", (event) => {
    if (event.keyCode === 40)
    {
        changeLoopSpeed(false);
    }
    else if(event.keyCode === 38)
    {
        changeLoopSpeed(true);
    }
})