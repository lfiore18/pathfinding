let posArray = [];
let cellSize = 40;

let start;
let end;

let isPaintingPath = false;
let isPaintingObstacle = false;


function setup() {
    createCanvas(600, 600);
    buildArray(height/cellSize, width/cellSize);
    
    start = {y: 2, x: 2};
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
    
    let pathArray = calculatePath();
    drawPath(pathArray);
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
        setPosition(xStart, yStart, "start");
    }
}

function calculatePath()
{
    let distance = cellToEndPointDist(start.x, start.y);
    let pathArray = [];
    let checkedPositions = checkPositions(start.x, start.y);

    let closestCell;
    if (checkedPositions.length > 0) {    
        closestCell = checkedPositions[0];
        let count = 0;
        //while (closestCell.distance.total > 0) {
        while(count < 20) {
            for (let i = 0; i < checkedPositions.length; i++) {
                pathArray.push(checkedPositions[i]);
                if (checkedPositions[i].distance.total < closestCell.distance.total)         {
                closestCell = checkedPositions[i];
                }
                count++;
            }
            console.log("Current Closest Cell: " + closestCell.Y + " " + closestCell.X);
            //pathArray.push(closestCell);
            checkedPositions = checkPositions(closestCell.X, closestCell.Y);
        }
        console.log("Closest Neighbour Cell to End Point: " + closestCell.Y + ", " + closestCell.X);
        return pathArray;
    }
}

function checkPositions(x, y)
{
    // look up left, up, up right
    // left, ignore center, right
    // look down left, down, down right
    
    // to determine value of cell, look at the distance the cell is from the end point, in terms of x and y,
    
    // For example, if the starting position is at 0y, 4x and the ending position is at 11y, 2x, we subtract the xy values of the new cell from the ending position and add up the value to get a final value.
    // for arguments sake, let's say the cell is at 1y, 4x
    // (11y + 1y) + (2x + 4x) = 10 + 2 = 12
    // and do the same for the cell at 1y, 3x
    // (11y + 1y) + (2x + 3x) = 10 + 1 = 11
    // The second cell is the better movement choice
    // Starting from this cell, we do the same again

    let startCheckX = x - 1 < 0 ? x : x - 1;
    let endCheckX = x + 1 > posArray[0].length ? x : x + 1;
    let startCheckY = y - 1 < 0 ? y : y - 1;
    let endCheckY = y + 1 > posArray.length ? y : y + 1;
    
    console.log("startCheckY: " + startCheckY + ", endCheckY: " + endCheckY + "\nstartCheckX: " + startCheckX + ", endCheckX: " + endCheckX);
    
    let distances = [];
    
    for (let i = startCheckY; i <= endCheckY; i++) {
        for (let j = startCheckX; j <= endCheckX; j++) {
            console.log(i + " " + j);
            if ((i != y || j != x) && posArray[i][j] != "obstacle") {
                distances.push({
                    X: j, 
                    Y: i, 
                    distance: cellToEndPointDist(j, i)
                });
            }
        }
    }
    
    return distances;
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

function setPosition(x, y, state)
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

function drawPath(pathArray)
{
    for (let i = 0; i < pathArray.length - 1; i++) {
        fillCell(pathArray[i].X, pathArray[i].Y, "#8686D8");
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