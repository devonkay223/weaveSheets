import MainCanvas from "./MainCanvas.js";
import Cell from "./Cell.js";
import ControlHandle from "./ControlHandle.js";
// import * from "./codemirror-5.65.19/"

let cellMC = new MainCanvas("cell", 0)
let selectionMC = new MainCanvas("selection", 1)

const cells = [];
const handlesRow =[];
const handlesCol=[]
let columns= 30
let rows = 30
export var cellDefaultWidth = 40
export let cellDefaultHeight = 18
export let rowH = Array.from({length: rows+1}, (_, j) => j * cellDefaultHeight)
export let colW = Array.from({length: columns+1}, (_, i) => i * cellDefaultWidth)

let selected=[]

let topOffset = 80;
let leftOffset = 30;

let mouse=false;
let index =null;





// window.onload = () =>{
//     const [inputArea, outputArea] = document.querySelectorAll(".codemirror-textarea")
//   // configs
//     let inputCodeMirror = CodeMirror.fromTextArea(inputArea, {
//         lineNumbers: true,
//         mode: 'javascript',
//         // extraKeys: {"Ctrl-Space": "autocomplete"}
//     });

// }



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
    let l = new ControlHandle(i, toolCtx, false)
    handlesCol.push(l)
}

//TODO put into control handle
for(let j=0; j<rows; j++){
    let l = new ControlHandle(j, toolCtx, true)
    handlesRow.push(l)
}

console.log(colW)
// createDesignArea(20, 26.666, 20, 2, [5,5])
// createWarpPalette(["#bbe6f7", "#96c9e5", "#529cda", "#2b58cf"])


// _____PAGE INTERACTIONS ________
selectionMC.canvas.addEventListener("click", gridPointerInteraction);
selectionMC.canvas.addEventListener("dblclick", gridDblInteraction);
toolCanvas.addEventListener("mouseup", handlesDragInteraction);
toolCanvas.addEventListener("mousedown", handlesMouseDown);
// toolCanvas.addEventListener("mouseup", () => {
//     mouse=false;
//     index=null;
// });



function gridPointerInteraction(e){
        var rect = document.getElementById("cellCanvas").getBoundingClientRect();
    selectionMC.clearContext();
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
        // console.log(x1, y1, x2, y2)

        let w = colW[x2]-colW[x1]
        let h  = rowH[y2]-rowH[y1]
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
    selectionMC.clearContext()
    
    let x = e.pageX - window.pageXOffset  - rect.left;
    let y = e.pageY - window.pageYOffset - rect.top;  
    let [xIndex, yIndex] = findCells(x, y)
    
    if (hasInput) return;
    addInput(colW[xIndex], rowH[yIndex], cells[xIndex][yIndex].inputValue) //cells[xIndex][yIndex].loc[0], cells[xIndex][yIndex].loc[1]);
}

function handlesMouseDown(e){
    let x = e.pageX - window.pageXOffset - 30;
    let y = e.pageY - window.pageYOffset - topOffset +20; 
    if(y<19 && x>25) {
        for(let i=0; i<colW.length; i++){
            // console.log(colW[i])
            if(colW[i]-10<x && colW[i]+10> x){
                index = i; 
            }
        }
    } 
    mouse= true;
}

function handlesDragInteraction(e){
    if(mouse){
        let offset = colW[index] - e.clientX +30;
        // colW[index] = e.clientX-30
        if(colW[index] -offset < colW[index-1]){
             offset = colW[index] - colW[index-1] - 12
        }
        for(let i = index; i<colW.length; i++){
            colW[i] -= offset
        }
        updateCanvas()
        mouse= false
        index = null
    }
}



//Function to dynamically add an input box: 
function addInput(x, y, valIn) {

    input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = x + leftOffset+'px';
    input.style.top = y  + topOffset + 'px';
    input.value = valIn

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

//TODO add delete key to clear cell value, add styling clear too w key combo? 
const ctrlShortcuts = {
//   a: () => console.log("select all?"),
//   z: () => undo(),
//   s: () => dispatch({ showDownload: true }),
  f: () => actionOnSelectedCells(selected[0], selected.pop(), "fill", "green"),
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



// ________CELL ACTIONS HERE________
export var cellActions = {
  fill: (i, j, color) => cells[i][j].fillCell(color),
  width: (i, j, size) => sizeUpdate(size, i),
  text: (i, j, textIn) => cells[i][j].updateText(textIn)
};




function drawSelectedCell(x1, y1, w=0, h=0){
        selectionMC.ctx.beginPath(); // Start a new path
        selectionMC.ctx.strokeStyle ="#000dff"
        selectionMC.ctx.lineWidth = 1
        selectionMC.ctx.rect(colW[x1], rowH[y1], w==0?cells[x1][y1].colWidth:w, h==0?cells[x1][y1].rowHeight:h); // Add a rectangle to the current path
        selectionMC.ctx.stroke();
}

export function actionOnSelectedCells(cellA, cellB=cellA, action, var1){
    let prev = cellA; //selected[0]
    let prev2 = cellB; //selected.pop()
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

    for(let i=0; i<colW.length; i++){
        if(x<colW[i+1] && x>colW[i]){
            xIndex =i
            break;
        }
    }

    for(let j=0; j<rowH.length; j++){
         if(y<rowH[j+1] && y>rowH[j]){
            yIndex =j
            break;
        }
    }
    return [xIndex, yIndex]
}

function hexToRgb(h){return['0x'+h[1]+h[2]|0,'0x'+h[3]+h[4]|0,'0x'+h[5]+h[6]|0]}
function rgbToHex(r,g,b){return"#"+((1<<24)+(r<<16)+(g<<8)+ b).toString(16).slice(1);}

export function avgHex(h1,h2){
    let a=hexToRgb(h1);
    let b=hexToRgb(h2); 
    return rgbToHex(~~((a[0]+b[0])/2),~~((a[1]+b[1])/2),~~((a[2]+b[2])/2));
}

function sizeUpdate(size, loc){
    let offset = colW[loc +1] - colW[loc] - size*(cellDefaultWidth)
    for(let i=loc+1; i<colW.length; i++){ //col
        colW[i] -=offset
    }
    updateCanvas()
}



export function updateCanvas(){
    var rect = document.getElementById("toolCanvas").getBoundingClientRect();
    toolCtx.clearRect(0, 0, rect.width, rect.height);
    cellMC.clearContext()
    selectionMC.clearContext()

    for(let i=0; i<columns; i++){ //col
        handlesCol[i].drawHandle()
        for(let j=0; j<rows; j++){ //row
            cells[i][j].drawCell()
            if(i==0){
                handlesRow[j].drawHandle()
            }
        }
    }
}
