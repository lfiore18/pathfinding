let posArray = [];
let cellSize = 40;

let start;
let end;

let isPaintingPath = false;
let isPaintingObstacle = false;
let isPaintingReached = false;

let perimeter = [];
let reached = [];

let reachedMap = new Map();
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
    posArray[end.y][end.x] = {type: "start", cost: 0};
}

function draw() {
    
    // Draw the grid and any obstacles
    drawGrid();
    drawOccupiedCells();

    search(4);
    
    let path = tracePath();
    console.log(path);

    // Draw reached nodes in tan orange
    fillCellsFromArray(reached, "#A37D2C");
    
    // Draw the search perimeter in blue
    fillCellsFromArray(perimeter, "#8686D8");

    // Draw the calculated path in cyan
    fillCellsFromArray(path, "#5FB7B7");

    // Overlay the start and end cells
    fillCell(start.x, start.y, "#008000");
    fillCell(end.x, end.y, "#FF0000");

    PriorityQueueTest(2, 3);

    // Empty the arrays
    reachedMap = new Map();
    perimeter = [];
    reached = [];
    path = [];
}

function PriorityQueueTest(y, x)
{
    costMap.set(createKey(y, x), {cost: 2});
    
}


function tracePath() 
{
    // Follow the trail of breadcrumbs back to the starting position
    let path = [];

    // Find the target cell in reachedMap
    let lastCellKey = createKey(end.y, end.x);

    // Get the end cell
    let lastCell = reachedMap.get(lastCellKey);
    
    path.push(lastCell);
    if (lastCell != null)
    {       
        while (lastCell.y != "None" && 
                lastCell.x != "None")
        {
            lastCellKey = createKey(lastCell.y, lastCell.x);
            lastCell = reachedMap.get(lastCellKey);

            path.push(lastCell);    
        }
    }

    return path;
}

function search(endAtCount)
{
    perimeter.push(start);
    reachedMap.set(createKey(start.y, start.x), {y: "None", x: "None"});

    let foundGoal = false;

    let count = 0;
    while(perimeter.length > 0 && !foundGoal)
    //while(count < endAtCount)
    {
        // Remove the current perimeter node
        let current = perimeter.shift();
        
        foundGoal = checkNeighbours(current);
        count++;
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
    
    for (let y = startCheckY; y <= endCheckY; y++) {
        
        if (y != cell.y && !cellHasObstacle(y, posX)) {
            
            let newPosition = newPos(y, posX);
            if (neighbourNotInReached(newPosition)) {              
                perimeter.push(newPosition);
                reachedMap.set(createKey(newPosition.y, newPosition.x), {y: posY, x: posX});
                reached.push({y: y, x: posX});
            }

            if (newPosition.y == end.y && newPosition.x == end.x) {
                return true;
            }
        }

    }

    for (let x = startCheckX; x <= endCheckX; x++) {

        if (x != cell.x && !cellHasObstacle(posY, x)) {
            
            let newPosition = newPos(posY, x);
            if (neighbourNotInReached(newPosition)) {                
                perimeter.push(newPosition);
                reachedMap.set(createKey(newPosition.y, newPosition.x), {y: posY, x: posX});
                reached.push({y: posY, x: x});
            }

            if (newPosition.y == end.y && newPosition.x == end.x)
            {
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

function neighbourNotInReached(pos)
{
    let key = createKey(pos.y, pos.x);
    return !reachedMap.has(key);
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
    
    if (reachedMap.has(key)) {
        reachedMap.delete(key);
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
    let posVal = calculateMovementCost(y, x);

    // Fill the cell
    fill(hexColor);
    square(x * cellSize, y * cellSize, cellSize);

    textSize(18);
    fill("white");
    textAlign(CENTER, CENTER); // Center the text
    text("" + posVal + "", (cellSize * x) + cellSize / 2, (cellSize * y) + cellSize / 2);
}

function calculateMovementCost(y, x)
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
                posArray[row][cell] = {type: "empty", cost: 0};
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