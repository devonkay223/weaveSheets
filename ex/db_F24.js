import { actionOnSelectedCells, cellActions, avgHex, colW, cellDefaultWidth} from "../js/index.js";

let widthIn = 20;
let heightIn = 26.66;
let EPI = 20;
let layers = 2;


let ends = widthIn*layers*EPI

let palette = ["#bbe6f7", "#96c9e5",  "#529cda", "#2b58cf", "#f5d497", "#f2c496", "#ca5f62", "#841817"]

let colorsA = [palette[0], avgHex(palette[0], palette[1]), palette[1], avgHex(palette[1], palette[2]), palette[2], avgHex(palette[2], palette[3]), palette[3]]
let colorsB = [palette[4], avgHex(palette[4], palette[5]), palette[5], avgHex(palette[5], palette[6]), palette[6], avgHex(palette[6], palette[7]), palette[7]]

let distA = [[0, 0.5], [0, 1.25], [1, 1.25], [2, 1.25], [3, 1.25], [4, 1.25], [5, 1.25], [6, 1.25], [0, 0.3], [2, 0.3], [3, 0.1] ]
let distB = [[0, 0.5], [6, 1.25], [5, 1.25], [4, 1.25], [3, 1.25], [2, 1.25], [1, 1.25], [0, 1.25], [6, 0.3], [4, 0.3], [2, 0.1] ]

// setWidth(distA, [5,5])
colorsDist(distA, [5,5])



function colorsDist(dist=[], cellA){
    let cellX = cellA[0]
    let cellY = cellA[1]
    for(let i =0; i<dist.length; i++){
        cellActions["fill"](cellX, cellY, colorsA[dist[i][0]])
        cellActions["width"](cellX, cellY, dist[i][1])
        cellActions["fill"](cellX, cellY+1, colorsB[distB[i][0]])
        cellActions["text"](cellX, cellY+2, "=this.colWidth/cellDefaultWidth")
        cellActions["text"](cellX, cellY+3, "=this.colWidth/cellDefaultWidth*20")

        cellX+=1
    }
    for(let i=dist.length-2; i>=0; i--){
        cellActions["fill"](cellX, cellY, colorsA[dist[i][0]])
        cellActions["width"](cellX, cellY, dist[i][1])
        cellActions["fill"](cellX, cellY+1, colorsB[distB[i][0]])
        cellActions["text"](cellX, cellY+2, "=this.colWidth/cellDefaultWidth")

        // cellActions["text"](cellX, cellY+2, parseFloat((colW[cellX]-colW[cellX-1])/cellDefaultWidth))
        // cellActions["text"](cellX, cellY+2, parseFloat((colW[cellX]-colW[cellX-1])/cellDefaultWidth))
        cellActions["text"](cellX, cellY+3, "=this.colWidth/cellDefaultWidth*20")
        cellX+=1
    }
}



