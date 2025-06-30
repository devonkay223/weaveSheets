export default class MainCanvas {
    constructor(name, zIn) {
        this.canvas = document.getElementById(name+"Canvas");
        this.ctx =  this.canvas.getContext("2d");
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = "80px";
        this.canvas.style.left = "30px";
        this.canvas.style.zIndex = zIn

    }

    clearContext(){
       this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}