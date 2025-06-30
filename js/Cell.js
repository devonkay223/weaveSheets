
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

        //maybe abstract into rows and column objs? 
        this.colWidth = 30;
        this.rowHeight= 20;
        this.loc = [i*this.colWidth,j*this.rowHeight];

        this.ctx.font = this.rowHeight*.7 +"px Arial"

        //Cell value

    }

    //TODO figure out why text gets overwrittena s empty

    drawCell(){
        this.ctx.beginPath(); // Start a new path
        this.ctx.fillStyle = this.fillStyle
        this.ctx.strokeStyle = this.strokeStyle
        this.ctx.lineWidth = this.lineWidth
        this.ctx.rect(this.loc[0], this.loc[1], this.colWidth, this.rowHeight); // Add a rectangle to the current path
        this.ctx.fill(); // Render the path
        this.ctx.stroke();
        this.ctx.fillStyle = "black"
        this.ctx.closePath();
        this.ctx.fillText(this.inputValue, this.loc[0] + 2, this.loc[1]+(this.rowHeight)*.7)
    }

    fillCell(color){
        this.fillStyle = color

        this.drawCell()
    }

    resizeCol(width){

    }

   updateText(text){
        if(text){
            this.inputValue = text
            this.drawCell()
        }
   }
   
   //TODO write edit text
   editText(){

   }
}

