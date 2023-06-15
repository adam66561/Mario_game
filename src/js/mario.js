const canvas = document.getElementById("canvasBox");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = .5;

class Player {
    constructor(){
        this.position = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        this.width = 30;
        this.height = 30;
        this.velocity = {
            x: 0,
            y: 0
        }
    }

    update(){
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        if (this.position.y < canvas.height - this.height - this.velocity.y){
            this.velocity.y += gravity;
        }else{
            this.velocity.y = 0;
            keys.up.count = 0;
            
        }
    }

    draw(){
        const {x, y} = this.position;
        c.fillStyle = "red";
        c.fillRect(x - this.width / 2, y - this.height / 2, this.width, this.height) 
    }
}

class Platform {
    constructor(){
        this.position = {
            x: 0,
            y: 0
        };
        this.width = 200;
        this.height = 20;
    }

    draw(){
        c.fillStyle = "blue";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const player = new Player();
const platform = new Platform();
platform.draw();
const keys = {
    right:{
        pressed: false
    },
    left:{
        pressed: false
    },
    up:{
        pressed: false,
        count: 0
    },
    down:{
        pressed: false
    }
}

const animate = () => {
    const animationFrame = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    player.update();

    if(keys.right.pressed){
        player.velocity.x = 5;
    }else if(keys.left.pressed){
        player.velocity.x = -5;
    }else{
        player.velocity.x = 0;
    }
    if(keys.up.pressed && keys.up.count <= 1){
        player.velocity.y = -16;
        keys.up.count++;
    }
    
}

animate();

addEventListener("keydown", ({key}) => {
    switch(key) {
        case "ArrowRight":
            keys.right.pressed = true;
            break
        case "ArrowLeft":
            keys.left.pressed = true;
            break
        case "ArrowUp":
            keys.up.pressed = true;
            break
        case "ArrowDown":
            keys.down.pressed = true;
            break
        default:
            break
    } 
})

addEventListener("keyup", ({key}) => {
    switch(key) {
        case "ArrowRight":
            keys.right.pressed = false;
            break
        case "ArrowLeft":
            keys.left.pressed = false;
            break
        case "ArrowUp":
            keys.up.pressed = false;
            break
        case "ArrowDown":
            keys.down.pressed = false;
            break
        default:
            break


    }
})