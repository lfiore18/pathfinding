let posArray = [];
let cellSize = 40;

let start;
let end;

let isPaintingPath = false;
let isPaintingObstacle = false;
let isPaintingReached = false;

let perimeter = [];
let reachedMap = new Map();

let boardHeight;
let boardWidth;

function setup() {
    createCanvas(600, 600);
    boardHeight = height/cellSize;
    boardWidth = width/cellSize;
    buildArray(boardHeight, boardWidth);
    
    start = {y: 2, x: 3};
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

    calculatePath(100);

    // Draw the path in blue
    fillCellsFromArray(perimeter, "#8686D8");

    const paintCell = (e) => { e.x != "None" && e.y != "None" ? fillCell(e.x, e.y, "#a37d2c") : console.log(e); };

    reachedMap.forEach(console.log);
    reachedMap.forEach(paintCell);
    reachedMap = new Map();
    perimeter = [];
    fillCell(start.x, start.y, "#008000");
}



function calculatePath(endAtCount)
{
    perimeter.push(start);
    reachedMap.set(createKey(start.y, start.x), {y: "None", x: "None"});

    let foundGoal = false;

    let count = 0;
    //while(perimeter.length > 0 && !foundGoal)
    while(count < endAtCount)
    {
        let current = perimeter.shift();
        
        // Remove the current perimeter node
        

        foundGoal = checkNeighbours(current);
        count++;
    }

    console.log(perimeter)
    console.log("found goal: " + foundGoal);
    // Breadth-first:
    // For the purposes of this exercise, assume the starting cell is not the goal
    // Start from Cell(2, 3) 
        // CheckNeighbours(2, 3)
            // CheckCell(1, 3),(3, 3)(2, 2)(2, 4)                
                // is in "reached" list
                    // end CheckCell
                // has the same x, y as goal's x, y
                    // end CheckCell
                // has the same x, y as start's x, y
                    // end CheckCell 
                // else
                    // is occupied by an obstacle?
                        // add to "reached"
                        // end CheckCell
                    // else
                        // add to "perimeter"
                        // add to "reached"
                        // end CheckCell
                    
    

        // If (checked)
            // 
}

function checkNeighbours(cell)
{

    let posX = cell.x;
    let posY = cell.y;

    console.log("posX: " + posX + " endX: " + end.x + " posY: " + posY + " endY: " + end.y);
    if (posX == end.x && posY == end.y)
    {
        return true;
    }

    

    // if the position is 0, subtracting from it will make it less than 0, so 
    let startCheckX = posX - 1 < 0 ? posX : posX - 1;
    let endCheckX   = posX + 1 >= posArray[0].length ? posX : posX + 1;
    let startCheckY = posY - 1 < 0 ? posY : posY - 1;
    let endCheckY   = posY + 1 >= posArray.length ? posY : posY + 1;
    
    //console.log("startCheckY: " + startCheckY + ", endCheckY: " + endCheckY + "\nstartCheckX: " + startCheckX + ", endCheckX: " + endCheckX);
    
    //reachedMap.set(createKey)
    for (let y = startCheckY; y <= endCheckY; y++) {
        
        if (y != cell.y && !cellHasObstacle(y, posX)) {
            
            let newPosition = newPos(y, posX);
            if (neighbourNotInReached(newPosition)) {              
                perimeter.push(newPosition);
                reachedMap.set(createKey(newPosition.y, newPosition.x), {y: posY, x: posX})
            }

        }

    }

    for (let x = startCheckX; x <= endCheckX; x++) {

        if (x != cell.x && !cellHasObstacle(posY, x)) {
            
            let newPosition = newPos(posY, x);
            if (neighbourNotInReached(newPosition)) {                
                perimeter.push(newPosition);
                reachedMap.set(createKey(newPosition.y, newPosition.x), {y: posY, x: posX});
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
    return posArray[y][x] == "obstacle";
}

// function checkCellForObstacle(x1, y1, x2, y2)
// {
//     return ((y1 != y2 || x1 != x2) && posArray[y1][x1] != "obstacle");
// }

function createKey(y, x){
    return `${y},${x}`;
} 
function removePosition(y, x){
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

            if(posArray[y][x] == "reached") {
                fillCell(x, y, "#ffb600")
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

function mouseClicked()
{
    let xStart = floor(mouseX/cellSize);
    let yStart = floor(mouseY/cellSize);



    let mouseClickInBounds = (xStart < boardWidth && xStart >= 0) && (yStart < boardHeight && yStart >= 0);

    if (mouseClickInBounds){
        console.log("y: " + yStart + ", x: " + xStart);
        if (isPaintingPath) {
            posArray[yStart][xStart] = "path";
        } else if (isPaintingObstacle) {
            posArray[yStart][xStart] = "obstacle";
        } else if (isPaintingReached) {
            posArray[yStart][xStart] = "reached";
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