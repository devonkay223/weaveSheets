
import { rowH, colW, cellDefaultWidth ,cellDefaultHeight, updateCanvas} from "./index.js";

export default class Cell{
    constructor(i, j, ctxIn, fillColor ='#dadbe5'){
        //Cell style
        // figure out stroke tracking
        this.inputValue = "";
        this.lineWidth = 1;
        this.fillStyle = fillColor;
        this.strokeStyle ="#9899ab"
        this.lineWidth = 1;

        this.ctx = ctxIn

        this.i = i;
        this.j = j;

        //maybe abstract into rows and column objs? 
        this.colWidth = cellDefaultWidth;
        this.rowHeight= cellDefaultHeight;
        this.loc = [colW[i],rowH[j]];

       

        this.ctx.font = this.rowHeight*.7 +"px Arial"

        //Cell value

    }

    drawCell(){
        this.ctx.beginPath(); // Start a new path
        this.ctx.fillStyle = this.fillStyle
        this.ctx.strokeStyle = this.strokeStyle
        this.ctx.lineWidth = this.lineWidth
        this.colWidth = colW[(this.i +1)]- colW[(this.i)]
        this.rowHeight = rowH[(this.j+1)]- rowH[(this.j)]
        this.ctx.rect(colW[this.i], rowH[this.j], this.colWidth, this.rowHeight); // Add a rectangle to the current path
        this.ctx.fill(); // Render the path
        this.ctx.stroke();
        this.ctx.fillStyle = "black"
        this.ctx.closePath();
        // this.ctx.fillText(this.inputValue, colW[this.i] + 2, rowH[this.j] + this.rowHeight*0.75)
        this.textSolver()
    }

    fillCell(color){
        this.fillStyle = color

        this.drawCell()
    }

   updateText(text){
        if(text){
            this.inputValue = text
            this.drawCell()
        }
   }

   textSolver(){
    let out  = this.inputValue
        if(this.inputValue[0] =="="){
            // TODO figure out how to do this securley? --> need to be able to ref cell ranges and proj variables 
           out = eval(this.inputValue.slice(1))
        }
        this.ctx.fillText(out, colW[this.i] + 2, rowH[this.j] + this.rowHeight*0.75)
   }

//    updateWidthRatio(size){
//         this.colWidth = cellDefaultWidth*size
//         colW[this.i] = colW[this.i-1] + this.colWidth
//    }
 
}

