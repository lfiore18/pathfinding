let posArray = [];
let cellSize = 40;

let start;
let end;

let isPaintingPath = false;
let isPaintingObstacle = false;
let isPaintingReached = false;
let isPaintingHighCostCells = false;

let perimeterPQueue = new PriorityQueue();
let reached = [];

let cameFrom = new Map();
let costMap = new Map();

let boardHeight;
let boardWidth;

function setup() {
    // Specify start and end (goal) co-ordinates
    start = {y: 7, x: 10};
    end = {y: 11, x: 2};

    createCanvas(1200, 1200);
    boardHeight = height/cellSize;
    boardWidth = width/cellSize;
    buildArray(boardHeight, boardWidth);
    

    posArray[0][0] = newCell("obstacle", "n/a");
    posArray[0][1] = newCell("obstacle", "n/a");
    posArray[0][2] = newCell("obstacle", "n/a");
    posArray[0][3] = newCell("obstacle", "n/a");
    
    posArray[4][0] = newCell("obstacle", "n/a");
    posArray[4][1] = newCell("obstacle", "n/a");
    posArray[4][2] = newCell("obstacle", "n/a");
    posArray[4][3] = newCell("obstacle", "n/a");
    

    posArray[start.y][start.x] = {type: "start", cost: 0};
    posArray[end.y][end.x] = {type: "end", cost: 0};
}

function draw() {
    // Draw the grid and any obstacles
    drawGrid();
    drawOccupiedCells();

    search(82);
    
    let path = tracePath();

    // Draw reached nodes in tan orange
    //fillCellsFromArray(reached, "#A37D2C");
    
    // Draw the search perimeter in blue
    //fillCellsFromArray(perimeter, "#8686D8");

    // Draw the calculated path in cyan
    fillCellsFromArray(path, "#5FB7B7");

    // Overlay the start and end cells
    fillCell(start.x, start.y, "#008000");
    fillCell(end.x, end.y, "#FF0000");

    // Empty the arrays
    cameFrom = new Map();
    costMap = new Map();
    perimeterPQueue = new PriorityQueue();
    reached = [];
    path = [];
}


function tracePath() 
{
    // Follow the trail of breadcrumbs back to the starting position
    let path = [];

    // Find the target cell in cameFrom
    let lastCellKey = createKey(end.y, end.x);

    // Get the end cell
    let lastCell = cameFrom.get(lastCellKey);
    
    path.push(lastCell);
    if (lastCell != null)
    {       
        while (lastCell.y != "None" && 
                lastCell.x != "None")
        {
            lastCellKey = createKey(lastCell.y, lastCell.x);
            lastCell = cameFrom.get(lastCellKey);

            path.push(lastCell);    
        }
    }

    return path;
}

function search(endCountAt) {
    
    // Enqueue the start point so it's the first searched cell in the perimeter
    perimeterPQueue.enqueue(start, 0);

    // Create a record of the start cell so we don't revisit it
    cameFrom.set(createKey(start.y, start.x), {y: "None", x: "None"});
    
    // Create a record of the start cell so we don't revisit it
    costMap.set(createKey(start.y, start.x), 0);
    

    let current = perimeterPQueue.front();
    perimeterPQueue.dequeue();
    checkNeighbours(current);
    console.log(current);


    let count = 0;
    let foundGoal = false;
    while(!perimeterPQueue.isEmpty() && !foundGoal)
    //while(count < endCountAt)
    {
        current = perimeterPQueue.front();
        perimeterPQueue.dequeue();
        foundGoal = checkNeighbours(current);

        fillCell(current.x, current.y, "#8686D8");

        count++;
    }
    console.log("Found in: " + count + " loops");
}

function checkNeighbours(cell)
{
    let posX = cell.x;
    let posY = cell.y;

    // if the position is 0, subtracting from it will make it less than 0, so 
    let startCheckX = posX - 1 < 0 ? posX : posX - 1;
    let endCheckX   = posX + 1 >= posArray[0].length ? posX : posX + 1;
    let startCheckY = posY - 1 < 0 ? posY : posY - 1;
    let endCheckY   = posY + 1 >= posArray.length ? posY : posY + 1;

    for (let y = startCheckY; y <= endCheckY; y++) {
        
        // if the neighbour currently being considered isn't the original cell, or a cell with an obstacle
        if (y != cell.y && !cellHasObstacle(y, posX)) {
            
            let key = createKey(y, posX);
            let cost = calculateMovementCostFromStart(y, posX) + costMap.get(createKey(posY, posX));
            let oldCost = costMap.has(key) ? costMap.get(key) : 1000;

            if (!cameFrom.has(key) || cost < oldCost) {
                perimeterPQueue.enqueue({y: y, x: posX}, cost);
                cameFrom.set(key, {y: posY, x: posX});
                costMap.set(key, cost);
                reached.push({y: y, x: posX});
                fillCell(posX, y, "#A37D2C");
            }

            if (y == end.y && posX == end.x)
                return true;
        }
    }

    for (let x = startCheckX; x <= endCheckX; x++) {

        if (x != cell.x && !cellHasObstacle(posY, x)) {

            let key = createKey(posY, x);
            let cost = calculateMovementCostFromStart(posY, x) + costMap.get(createKey(posY, posX));
            let oldCost = costMap.has(key) ? costMap.get(key) : 1000;

            if (!cameFrom.has(key) || cost < oldCost) {
                perimeterPQueue.enqueue({y: posY, x: x}, cost);
                cameFrom.set(key, {y: posY, x: posX});
                costMap.set(key, cost);
                reached.push({y: posY, x: x});
                fillCell(x, posY, "#A37D2C");
            }

            if(posY == end.y && x == end.x)
                return true;
        }

    }

    console.log(perimeterPQueue);

    return false;
}


function calculateMovementCostFromStart(y, x)
{
    if (y == "None" && x == "None")
    {
        return 0;
    }

    let posVal = Math.abs(start.x - x) + Math.abs(start.y - y);
    
    if (posArray[y][x].cost != "n/a")
    {
        posVal += posArray[y][x].cost;
    } else {
        posVal = "n/a";
    }

    return posVal;
}

function cellHasObstacle(y, x)
{
    return posArray[y][x].type == "obstacle";
}

function createKey(y, x)
{
    return `${y},${x}`;
} 

function removePosition(y, x)
{
    const key = createKey(y, x);
    
    if (cameFrom.has(key)) {
        cameFrom.delete(key);
    }
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
    posArray[y][x] = newCell("start", 0);
}

function clearPosition(x, y)
{
    posArray[y][x] = newCell("empty", 1);
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
            if(posArray[y][x].type == "filled") {
                fillCell(x, y, "#FF");
            }
            
            if(posArray[y][x].type == "start") {
                fillCell(x, y, "#008000");
            }
            
            if(posArray[y][x].type == "end") {
                fillCell(x, y, "#FF0000");
            }
            
            if(posArray[y][x].type == "empty") {
                fillCell(x, y, "#000000");
            }
            
            if(posArray[y][x].type == "path") {
                fillCell(x, y, "#8686D8");
            }
            
            if(posArray[y][x].type == "obstacle") {
                fillCell(x, y, "#808080");
            }

            if(posArray[y][x].type == "reached") {
                fillCell(x, y, "#ffb600");
            }

            if(posArray[y][x].cost >= 10) {
                fillCell(x, y, "#2c8261");
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
    let posVal = calculateMovementCostFromStart(y, x);

    // Fill the cell
    fill(hexColor);
    square(x * cellSize, y * cellSize, cellSize);

    textSize(18);
    fill("white");
    textAlign(CENTER, CENTER); // Center the text
    text("" + posVal + "", (cellSize * x) + cellSize / 2, (cellSize * y) + cellSize / 2);
}

function drawTextOverlay(str, hexColor, textSize)
{
    textSize(textSize);
    fill(hexColor);
    textAlign(CENTER, CENTER); // Center the text

    let halfCellSize = cellSize / 2;
    text("" + str + "", (cellSize * x) + halfCellSize, (cellSize * y) + halfCellSize);
}

function buildArray(rows, columns)
{ 
    posArray = new Array(rows);
    for(let row = 0; row < rows; row++) {

        posArray[row] = new Array(columns);
        for(let cell = 0; cell < columns; cell++) {
            // NOTE: This is where we assign movement cost

            if ((cell > 6 && cell < 9) || (row < 6 && row > 9))
            {
                posArray[row][cell] = newCell("empty", Math.floor(Math.random() * (20 - 10 + 1)) + 10);
            } else 
            {
                posArray[row][cell] = newCell("empty", 1);
            }
        }
    }
}

function newCell(typeStr, costNum)
{
    return {type: typeStr, cost: costNum};
}

function mouseClicked()
{
    let xStart = floor(mouseX/cellSize);
    let yStart = floor(mouseY/cellSize);

    let mouseClickInBounds = (xStart < boardWidth && xStart >= 0) && (yStart < boardHeight && yStart >= 0);

    if (mouseClickInBounds){
        console.log("y: " + yStart + ", x: " + xStart);
        if (isPaintingPath) {
            posArray[yStart][xStart].type = "path";
        } else if (isPaintingObstacle) {
            posArray[yStart][xStart] = newCell("obstacle", "n/a");
        } else if (isPaintingReached) {
            posArray[yStart][xStart].type = "reached";
        } else if (isPaintingHighCostCells) {
            posArray[yStart][xStart] = newCell("empty", 10);
        } else {
            setStartPosition(xStart, yStart);
        }
    }
}

function keyPressed() {
    // Bitfield
    // 'c' is 0 
    if (key === 'c') {
        isPaintingPath = !isPaintingPath;
        isPaintingObstacle = false;
        isPaintingReached = false;
        isPaintingHighCostCells = false;
        console.log("Currently Painting Path: " + isPaintingPath);
    }

    if (key === 'o') {
        isPaintingObstacle = !isPaintingObstacle;
        isPaintingPath = false;
        isPaintingReached = false;
        isPaintingHighCostCells = false;
        console.log("Currently Painting Path: " + isPaintingObstacle);
    }

    if (key === 'r') {
        isPaintingReached = !isPaintingReached;
        isPaintingPath = false;
        isPaintingObstacle = false;
        isPaintingHighCostCells = false;
        console.log("Currently Painting Path: " + isPaintingReached);
    }

    if (key === 'e') {
        isPaintingHighCostCells = !isPaintingHighCostCells;
        isPaintingPath = false;
        isPaintingObstacle = false;
        isPaintingReached = false;
        console.log("Currently Painting Path: " + isPaintingHighCostCells);
    }
}