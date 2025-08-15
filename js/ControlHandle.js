import { rowH, colW, cellDefaultWidth ,cellDefaultHeight} from "./index.js";

export default class ControlHandle{
    constructor(i, toolCtx, vert=false){
        this.ctx = toolCtx
        this.i = i
        this.vert = vert
    
        // toolCtx.moveTo(offset+(i*cells[i][0].colWidth), 10); // Move the pen to (30, 50)
        // toolCtx.lineTo(offset+(i*cells[i][0].colWidth), 30); // Draw a line to (150, 100)
        this.drawHandle()
    }

    //  this.addEventListener("click", (e) => {
    //     console.log(this.className); // WARNING: `this` is not `my_element`
    //     console.log(e.currentTarget === this); // logs `false`
    // });

    drawHandle(){
        this.ctx.beginPath(); // Start a new path
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#9899ab' 
        if(this.vert){
            this.ctx.moveTo(3, rowH[this.i]+ 20); 
            this.ctx.lineTo(17, rowH[this.i] + 20); 
        }
        else{
            this.ctx.moveTo(colW[this.i] + 22, 0); 
            this.ctx.lineTo(colW[this.i] +22, 15); 
        }
        this.ctx.stroke(); // Render the path
        this.ctx.closePath()
    }

} 