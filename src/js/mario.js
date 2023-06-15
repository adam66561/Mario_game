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
        if (this.position.y < canvas.height - this.height / 2 - this.velocity.y - 30){
            this.velocity.y += gravity;
        }else{
            this.velocity.y = 0;            
        }
    }

    draw(){
        const {x, y} = this.position;
        c.fillStyle = "red";
        c.fillRect(x - this.width / 2, y - this.height / 2, this.width, this.height) 
    }
}

class Platform {
    constructor({x, y}){
        this.position = {
            x,
            y
        };
        this.width = 200;
        this.height = 20;
    }

    draw(){
        c.fillStyle = "blue";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}


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

const player = new Player();
const platforms = [];
const init = () => {
    let x = 200;
    let y = 600;
    for (let i=0; i<50; i++){
        x += 300;
        y -= 100;
        platforms.push(new Platform({x, y}));
    }

}

const animate = () => {
    const animationFrame = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "yellow";
    c.fillRect(0, canvas.height - 30, canvas.width, 30);

    player.update();

    if(keys.right.pressed && player.position.x <= canvas.width / 2){
        player.velocity.x = 5;
    }else if(keys.left.pressed && player.position.x >= 100){
        player.velocity.x = -5;
    }else{
        player.velocity.x = 0;
        if (keys.right.pressed){
            platforms.forEach(platform => {
                platform.position.x -= 5;
            })
        }else if(keys.left.pressed){
            platforms.forEach(platform => {
                platform.position.x += 5;
            })
        }
    }

    // jumping 
    if(keys.up.pressed && keys.up.count <= 1){
        player.velocity.y = -16;
        keys.up.count++;
    }

    //platform detection
    //detection to disallow multiple jumping PART 1
    platforms.forEach(platform => {
        platform.draw();

        if(player.position.y + player.height / 2 <= platform.position.y 
        && player.position.y + player.height / 2+ player.velocity.y >= platform.position.y
        && (player.position.x > platform.position.x && player.position.x < platform.position.x + platform.width)){
            player.velocity.y = 0;
            keys.up.count = 0;
        }
        //detection to disallow multiple jumping PART 2
        if(player.position.y == canvas.height - player.height / 2 - player.velocity.y - 30){
            keys.up.count = 0;
        }
    })
    

    console.log(keys.up.count);
}

init();
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