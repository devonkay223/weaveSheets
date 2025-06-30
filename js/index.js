import MainCanvas from "./MainCanvas.js";
import Cell from "./Cell.js";
import ControlHandle from "./ControlHandle.js";

let cellMC = new MainCanvas("cell", 0)
let selectionMC = new MainCanvas("selection", 1)

const cells = [];
let rowH = []
let colW = []

let selected=[]

let topOffset = 80;
let leftOffset = 30;

let columns= 30
let rows = 30



// ______ PAGE SETUP______
for(let i=0; i<columns; i++){ //col
    cells[i]=[]
    for(let j=0; j<rows; j++){ //row
        let c = new Cell(i, j, cellMC.ctx)

        colW.push(c.colWidth)
        rowH.push(c.rowHeight)
        // console.log(((i%5==0) ?"blue":"pink"))
        c.drawCell()
        cells[i][j] = c;
    }
}


const toolCanvas = document.getElementById("toolCanvas");
const toolCtx = toolCanvas.getContext("2d");
toolCtx.canvas.width  = window.innerWidth;
toolCtx.canvas.height = window.innerHeight;
toolCtx.canvas.style.position = 'absolute';
toolCtx.canvas.style.top = topOffset-20+ "px";
for(let i=0; i<columns; i++){
    let l = new ControlHandle(i, cells, toolCtx)
}

//TODO put into control handle
for(let j=0; j<rows; j++){
    let l = new ControlHandle(j, cells, toolCtx, true)
}



// _____PAGE INTERACTIONS ________
selectionMC.canvas.addEventListener("click", gridPointerInteraction);
selectionMC.canvas.addEventListener("dblclick", gridDblInteraction);


function gridPointerInteraction(e){
    var rect = document.getElementById("cellCanvas").getBoundingClientRect();
    selectionMC.ctx.clearRect(0, 0, selectionMC.canvas.width, selectionMC.canvas.height);
    if(hasInput) {handleEnter()}
    
    let x = e.pageX - window.pageXOffset  - rect.left;
    let y = e.pageY - window.pageYOffset - rect.top;  
    let [xIndex, yIndex] = findCells(x, y)

    let prev = selected[0]
    // console.log(selected, prev)
    if(e.shiftKey ==true){
        let x1 = xIndex<prev[0]? xIndex: prev[0];
        let x2 = xIndex<=prev[0]? prev[0]+1: xIndex+1;
        let y1 = yIndex<prev[1]? yIndex: prev[1];
        let y2 = yIndex<=prev[1]? prev[1]+1: yIndex+1;


        let w = selectionSize(x1, x2, colW)
        let h  = selectionSize(y1, y2, rowH)
        drawSelectedCell(x1, y1, w, h); // Add a rectangle to the current path
    }
    else{
        selected = []
        if(prev!=undefined){
            // console.log(cells[a1][b1], "redrawCell")
            cells[prev[0]][prev[1]].drawCell()
        }
        drawSelectedCell(xIndex, yIndex)
    }
    selected.push([xIndex, yIndex])
}


let hasInput = false;
let input;
function gridDblInteraction(e){
    var rect = document.getElementById("cellCanvas").getBoundingClientRect();
    selectionMC.ctx.clearRect(0, 0, selectionMC.canvas.width, selectionMC.canvas.height);
    
    let x = e.pageX - window.pageXOffset  - rect.left;
    let y = e.pageY - window.pageYOffset - rect.top;  
    let [xIndex, yIndex] = findCells(x, y)
    
    if (hasInput) return;
    addInput(cells[xIndex][yIndex].loc[0], cells[xIndex][yIndex].loc[1]);
}



//Function to dynamically add an input box: 
function addInput(x, y) {

    input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = x + leftOffset+'px';
    input.style.top = y  + topOffset + 'px';

    document.body.appendChild(input);

    input.focus();

    hasInput = true;
}

//Key handler for input box:
function handleEnter() {
    document.body.removeChild(input);
    hasInput = false;
    drawText(input.value, parseInt(input.style.left, 10), parseInt(input.style.top, 10));

}

//Draw the text onto canvas:
function drawText(text, x, y) {
    let [xIndex, yIndex] = findCells(x-20, y-70)
    cells[xIndex][yIndex].updateText(text)
}

const ctrlShortcuts = {
  a: () => console.log("select all?"),
  z: () => undo(),
  s: () => dispatch({ showDownload: true }),
  f: () => actionOnSelectedCells("fill", "green"),
};


function addListeners() {
    window.addEventListener("keypress", (e) => {
        //TODO fix to in scheme and ignore keys that are not in the hash
       if (e.key === 'Enter' || e.keyCode === 13) {
        // Do something
            handleEnter();
        }
        else if(!hasInput){
            ctrlShortcuts[e.key]()
        }
            
    });
}
addListeners()

function selectionSize(i1, i2, sizeArr){
    let size=0;
    for(let i=i1; i<i2; i++){
         size+=sizeArr[i]
    }
    return size
}

var cellActions = {
  fill: (i, j, color) => cells[i][j].fillCell(color),
};

function drawSelectedCell(x1, y1, w=0, h=0){
        selectionMC.ctx.beginPath(); // Start a new path
        selectionMC.ctx.strokeStyle ="#000dff"
        selectionMC.ctx.lineWidth = 1
        selectionMC.ctx.rect(cells[x1][y1].loc[0], cells[x1][y1].loc[1], w==0?cells[x1][y1].colWidth:w, h==0?cells[x1][y1].rowHeight:h); // Add a rectangle to the current path
        selectionMC.ctx.stroke();
}

function actionOnSelectedCells(action, var1){
    let prev = selected[0]
    let prev2 = selected.pop()
    let x1 = prev2[0]<prev[0]? prev2[0]: prev[0];
    let x2 = prev2[0]<=prev[0]? prev[0]+1: prev2[0]+1;
    let y1 = prev2[1]<prev[1]? prev2[1]: prev[1];
    let y2 = prev2[1]<=prev[1]? prev[1]+1: prev2[1]+1;

    for(let i=x1; i<x2; i++){
        for(let j=y1; j<y2; j++){
                cellActions[action](i, j, var1)
        }
    }
}

function findCells(x, y){
    let xIndex = 0;
    let yIndex =0;

    for(let i=0; x>0; i++){
        x -= colW[i]
            xIndex= i;
    }

    for(let j=0; y>0; j++){
        y -= rowH[j]
        if(y<=0){
            yIndex= j;
        }
    }
    return [xIndex, yIndex]
}