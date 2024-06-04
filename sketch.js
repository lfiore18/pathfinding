let posArray = [];
let cellSize = 40;

let start;
let end;

let isPaintingPath = false;
let isPaintingObstacle = false;

let perimeter = [];
let reachedMap = new Map();

const createKey = (y, x) => `${y},${x}`;
const removePosition = (y, x) => {
    const key = createKey(y, x);
    if (reachedMap.has(key)) {
        reachedMap.delete(key);
    }
};

function setup() {
    createCanvas(600, 600);
    buildArray(height/cellSize, width/cellSize);
    
    start = {y: 8, x: 8};
    end = {y: 11, x: 2};
    
    posArray[0][0] = "obstacle";
    posArray[0][1] = "obstacle";
    posArray[0][2] = "obstacle";
    posArray[0][3] = "obstacle";
    
    posArray[4][0] = "obstacle";
    posArray[4][1] = "obstacle";
    posArray[4][2] = "obstacle";
    posArray[4][3] = "obstacle";
    
    posArray[start.y][start.x] = "start";
    posArray[end.y][end.x] = "end";
}

function draw() {
    drawGrid();
    drawOccupiedCells();

    calculatePath();
    // Draw the path in blue
    fillCellsFromArray(perimeter, "#8686D8");
    reachedMap = new Map();
    perimeter = [];
}

function mouseClicked()
{
    let xStart = floor(mouseX/cellSize);
    let yStart = floor(mouseY/cellSize);
    console.log("y: " + yStart + ", x: " + xStart);

    if (isPaintingPath) {
        posArray[yStart][xStart] = "path";
    } else if (isPaintingObstacle) {
        posArray[yStart][xStart] = "obstacle";
    } else {
        setStartPosition(xStart, yStart);
    }
}

function calculatePath()
{
    // Check the cells above, below, left and right of the start position to begin
    let currentCell = start;

    let count = 0;
    let found = false;
    perimeter.push(currentCell);
    while(found == false)
    { 
        found = checkPositions(currentCell.x, currentCell.y);
        console.log(found);
        count++;
        currentCell = perimeter[count];        
    }
}

function checkPositions(posX, posY)
{
    // let index = perimeter.findIndex(pos => 
    //     pos.y == posY && pos.x == posX
    // );

    // if (index != -1)
    // {
    //     console.log("Removing: " + index);
    //     perimeter.splice(index, 1);
    // }

    let startCheckX = posX - 1 < 0 ? posX : posX - 1;
    let endCheckX   = posX + 1 >= posArray[0].length ? posX : posX + 1;
    let startCheckY = posY - 1 < 0 ? posY : posY - 1;
    let endCheckY   = posY + 1 >= posArray.length ? posY : posY + 1;
    
    //console.log("startCheckY: " + startCheckY + ", endCheckY: " + endCheckY + "\nstartCheckX: " + startCheckX + ", endCheckX: " + endCheckX);
    
    for (let i = startCheckY; i <= endCheckY; i++) {

        let posKey = createKey(i, posX);
        if (checkCellForObstacle(posX, i, posX, posY) && 
            posArray[i][posX] != posArray[start.y][start.x]) {
            
            if (posX == end.x && i == end.y)
            {
                return true;
            }
            reachedMap.set(posKey);           
            perimeter.push({y: i, x: posX});
        }
    }

    for (let i = startCheckX; i <= endCheckX; i++) {
        let posKey = createKey(i, posX);
        if (checkCellForObstacle(i, posY, posX, posY) && 
            posArray[posY][i] != posArray[start.y][start.x] ) {

            if (i == end.x && posY == end.y)
            {
                return true;
            }

            reachedMap.set(posKey);  
            perimeter.push({y: posY, x: i});
        }
    }

    return false;
}

function checkCellForObstacle(x1, y1, x2, y2)
{
    return ((y1 != y2 || x1 != x2) && posArray[y1][x1] != "obstacle");
}

function cellToEndPointDist(startX, startY)
{
    distance = {
        onY: (end.y - startY), 
        onX: (end.x - startX), 
    };

    distance.total = Math.abs(distance.onY) + Math.abs(distance.onX); 
    //console.log("Distance between start and end points: \nOn Y-axis: " + (distance.onY) + "\nOn X-axis: " + (distance.onX) + "\nTotal distance: " + (distance.totalDistance));
    return distance;
}

function setStartPosition(x, y)
{
    clearPosition(start.x, start.y);
    start.x = x;
    start.y = y;
    posArray[y][x] = "start";
}

function clearPosition(x, y)
{
    posArray[y][x] = "empty";
}

function drawGrid()
{
    //background(220);
    for (let i = 0; i <= height/cellSize; i++) {
        stroke(255)
        line(0, i * cellSize, width, i * cellSize)    
        line(i * cellSize, 0, i * cellSize, height)
    }
}

function drawOccupiedCells()
{
    for (let y = 0; y < posArray.length; y++) {
        for (let x = 0; x < posArray[y].length; x++) {      
            if(posArray[y][x] == "filled") {
                fillCell(x, y, "#FF");
            }
            
            if(posArray[y][x] == "start") {
                fillCell(x, y, "#008000");
            }
            
            if(posArray[y][x] == "end") {
                fillCell(x, y, "#FF0000");
            }
            
            if(posArray[y][x] == "empty") {
                fillCell(x, y, "#000000");
            }
            
            if(posArray[y][x] == "path") {
                fillCell(x, y, "#8686D8");
            }
            
            if(posArray[y][x] == "obstacle") {
                fillCell(x, y, "#808080");
            }
        }
    }
}

function fillCellsFromArray(cellArray, hexColor)
{
    for (let i = 0; i < cellArray.length; i++) {
        fillCell(cellArray[i].x, cellArray[i].y, hexColor);
    }
}

function fillCell(x, y, hexColor)
{
    fill(hexColor);
    square(x * cellSize, y * cellSize, cellSize);
}

function buildArray(rows, columns)
{ 
    posArray = new Array(rows);
    for(let row = 0; row < rows; row++) {
        posArray[row] = new Array(columns);
        
        for(let cell = 0; cell < columns; cell++) {
            posArray[row][cell] = "empty";    
        }
    }
    
    console.log("height: " + posArray.length + " width: " + posArray[0].length);
}



function keyPressed() { 
    if (key === 'c') {
        isPaintingPath = !isPaintingPath;
        isPaintingObstacle = false;
        console.log("Currently Painting Path: " + isPaintingPath);
    }
    if (key === 'o') {
        isPaintingObstacle = !isPaintingObstacle;
        isPaintingPath = false;
        console.log("Currently Painting Path: " + isPaintingObstacle);
    }
}