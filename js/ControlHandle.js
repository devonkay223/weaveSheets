export default class ControlHandle{
    constructor(i, cells, toolCtx, vert=false){
        toolCtx.beginPath(); // Start a new path
        toolCtx.lineWidth = 2;
        toolCtx.strokeStyle = '#9899ab' 
        // toolCtx.moveTo(offset+(i*cells[i][0].colWidth), 10); // Move the pen to (30, 50)
        // toolCtx.lineTo(offset+(i*cells[i][0].colWidth), 30); // Draw a line to (150, 100)
        if(vert){
            toolCtx.moveTo(3, cells[0][i].loc[1]+ 20); 
            toolCtx.lineTo(17, cells[0][i].loc[1] + 20); 
        }
        else{
            toolCtx.moveTo(cells[i][0].loc[0] + 22, 0); 
            toolCtx.lineTo(cells[i][0].loc[0] +22, 15); 
        }
        toolCtx.stroke(); // Render the path
        toolCtx.closePath()
    }

    //  this.addEventListener("click", (e) => {
    //     console.log(this.className); // WARNING: `this` is not `my_element`
    //     console.log(e.currentTarget === this); // logs `false`
    // });

} 