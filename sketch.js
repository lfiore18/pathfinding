let posArray = [];
let cellSize = 40;

let start;
let end;

let isPaintingPath = false;
let isPaintingObstacle = false;
let isPaintingReached = false;

let perimeterPQueue;
let reached = [];

let cameFrom = new Map();
let costMap = new Map();

let boardHeight;
let boardWidth;

function setup() {
    createCanvas(800, 800);
    boardHeight = height/cellSize;
    boardWidth = width/cellSize;
    buildArray(boardHeight, boardWidth);
    
    // Specify start and end (goal) co-ordinates
    start = {y: 2, x: 3};
    end = {y: 11, x: 2};
    
    posArray[0][0] = {type: "obstacle", cost: "n/a"};
    posArray[0][1] = {type: "obstacle", cost: "n/a"};
    posArray[0][2] = {type: "obstacle", cost: "n/a"};
    posArray[0][3] = {type: "obstacle", cost: "n/a"};
    
    posArray[4][0] = {type: "obstacle", cost: "n/a"};
    posArray[4][1] = {type: "obstacle", cost: "n/a"};
    posArray[4][2] = {type: "obstacle", cost: "n/a"};
    posArray[4][3] = {type: "obstacle", cost: "n/a"};
    

    posArray[5][3] = {type: "empty", cost: 3};
    posArray[5][4] = {type: "empty", cost: 4};
    posArray[6][5] = {type: "empty", cost: 3};
    posArray[5][6] = {type: "empty", cost: 5};
    

    posArray[start.y][start.x] = {type: "start", cost: 0};
    posArray[end.y][end.x] = {type: "end", cost: 0};
}

function draw() {
    
    perimeterPQueue = new PriorityQueue();

    // Draw the grid and any obstacles
    drawGrid();
    drawOccupiedCells();

    search(200);
    
    let path = tracePath();

    // Draw reached nodes in tan orange
    fillCellsFromArray(reached, "#A37D2C");
    
    // Draw the search perimeter in blue
    //fillCellsFromArray(perimeter, "#8686D8");

    // Draw the calculated path in cyan
    //fillCellsFromArray(path, "#5FB7B7");

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
function search() {
    // Clear the priority queue before starting the search
    perimeterPQueue.clear();

    // Start the perimeter queue by adding the starting position and its cost, 0
    perimeterPQueue.enqueue({ y: start.y, x: start.x }, 0);

    let startKey = createKey(start.y, start.x);

    cameFrom.set(startKey, { y: "None", x: "None" });
    setCost(startKey, 0);

    let foundGoal = false;

    while (!perimeterPQueue.isEmpty() && !foundGoal) {
        let current = perimeterPQueue.front();
        foundGoal = checkNeighbours(current);
        perimeterPQueue.dequeue();
    }
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


    let newCost;

    for (let y = startCheckY; y <= endCheckY; y++) {
        
        // if the neighbour currently being considered isn't the original cell, or a cell with an obstacle
        if (y != cell.y && !cellHasObstacle(y, posX)) {
            
            let newPosKey = createKey(y, posX);
            newCost = calculateMovementCost(posY, posX, y, posX);
            let currentCost = getCurrentCost(newPosKey);
            
            if (newCost < currentCost || !hasCost(newPosKey))
            {
                setCost(newPosKey, newCost);
                cameFrom.set(newPosKey, {y: posY, x: posX});
                perimeterPQueue.enqueue({y: y, x: posX}, newCost);
                reached.push({y: y, x: posX});
            }

            if (y == end.y && posX == end.x) {
                return true;
            }
        }
    }

    for (let x = startCheckX; x <= endCheckX; x++) {

        if (x != cell.x && !cellHasObstacle(posY, x)) {
            
            let newPosKey = createKey(posY, x);
            newCost = calculateMovementCost(posY, posX, posY, x);
            let currentCost = getCurrentCost(newPosKey);
            
            if (newCost < currentCost || !hasCost(newPosKey))
            {
                setCost(newPosKey, newCost);
                cameFrom.set(newPosKey, {y: posY, x: posX});
                perimeterPQueue.enqueue({y: posY, x: posX}, newCost);
                reached.push({y: posY, x: x});
            }

            if (posY == end.y && x == end.x) {
                return true;
            }
        }

    }

    return false;
}

function newPos(newY, newX)
{
    return {y: newY, x: newX};
}

function setCost(key, cost)
{
    costMap.set(key, cost);
}

function hasCost(key)
{
    return costMap.has(key);
}

function getCurrentCost(key)
{
    if (costMap.has(key))
        return costMap.get(key);
    else
        return -1;
}

function calculateMovementCost(parentY, parentX, neighbourY, neighbourX)
{
    return posArray[parentY][parentX].cost + posArray[neighbourY][neighbourX].cost;
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

function cameFromNeighbour(pos)
{
    let key = createKey(pos.y, pos.x);
    return cameFrom.has(key);
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
    posArray[y][x].type = "start";
    posArray[y][x].cost = 0;
}

function clearPosition(x, y)
{
    posArray[y][x].type = "empty";
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

            if (cell > 6 && cell < 9 || row < 6 && row > 9)
            {
                posArray[row][cell] = {type: "empty", cost: Math.round(Math.random() * 5)};
            } else 
            {
                posArray[row][cell] = {type: "empty", cost: 1};
            }
        }
    }
    
    //console.log("height: " + posArray.length + " width: " + posArray[0].length);
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
            posArray[yStart][xStart] = {type: "obstacle", cost: "n/a"}
        } else if (isPaintingReached) {
            posArray[yStart][xStart].type = "reached";
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
        console.log("Currently Painting Path: " + isPaintingPath);
    }

    if (key === 'o') {
        isPaintingObstacle = !isPaintingObstacle;
        isPaintingPath = false;
        isPaintingReached = false;
        console.log("Currently Painting Path: " + isPaintingObstacle);
    }

    if (key === 'r') {
        isPaintingReached = !isPaintingReached;
        isPaintingPath = false;
        isPaintingObstacle = false;
        console.log("Currently Painting Path: " + isPaintingReached);
    }
}