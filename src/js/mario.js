const platform = "../../src/img/platform.png";
const hills = "../../src/img/hills.png";
const background = "../../src/img/background.png";

const canvas = document.getElementById("canvasBox");
const c = canvas.getContext("2d");
canvas.width = 1600;
canvas.height = 900;

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
        if (this.position.y < canvas.height - this.height / 2 - this.velocity.y){
            this.velocity.y += gravity;
        }else{
            this.velocity.y = 0;            
        }
    }

    draw(){
        const {x, y} = this.position;
        c.fillStyle = "red";
        c.fillRect(x - this.width / 2, y - this.height / 2, this.width, this.height ) 
    }
}

class Platform {
    constructor({x, y, image}){
        this.position = {
            x,
            y
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y);     
    }
}

class GenericObject {
    constructor({x, y, image}){
        this.position = {
            x,
            y
        };
        this.image = image;
        this.width = image.width;
        this.height = canvas.height;
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height + 10);     
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

function createImage(imageSrc){
    const image = new Image();
    image.src = imageSrc;
    return image
}


let scrollOffset = 0;
const player = new Player();
const platforms = [];
const genericObjects = [];
const hillsArray = [];
const platformImage = createImage(platform);
const backgroundImage = createImage(background);
const hillsImage = createImage(hills);
const init = () => {
    let w = 200;
    let z = 500;
    w += 700;
    z -= 0;
    platforms.push(new Platform({x: 0, y: canvas.height - platformImage.height, image: platformImage }))
    platforms.push(new Platform({x: platformImage.width - 3, y: canvas.height - platformImage.height, image: platformImage }))
    platforms.push(new Platform({x: platformImage.width * 2 + 100, y: canvas.height - platformImage.height, image: platformImage }))
    genericObjects.push(new GenericObject({x: -1, y: -1, image: backgroundImage}))
    genericObjects.push(new GenericObject({x: -1, y: -1, image: hillsImage}))
}

const animate = () => {
    const animationFrame = requestAnimationFrame(animate);
    c.fillStyle = "white";
    c.fillRect(0, 0, canvas.width, canvas.height);

    genericObjects.forEach(genericObject => {
        genericObject.draw();
    })

    hillsArray.forEach(hill => {
        hill.draw();
    })

    if(keys.right.pressed && player.position.x <= canvas.width / 2){
        player.velocity.x = 5;
    }else if(keys.left.pressed && player.position.x >= 100){
        player.velocity.x = -5;
    }else{
        player.velocity.x = 0;
        if (keys.right.pressed){
            scrollOffset += 5;     
            platforms.forEach(platform => {
                platform.position.x -= 5;
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= 3;
            })
        }else if(keys.left.pressed){
            scrollOffset -= 5;
            platforms.forEach(platform => {
                platform.position.x += 5;
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += 3;
            })
        }
    }

    // jumping 
    if(keys.up.pressed && keys.up.count <= 1){
        player.velocity.y = -20;
        keys.up.count++;
    }

    //platform detection
    //detection to disallow multiple jumping PART 1
    platforms.forEach(platform => {
        platform.draw();

        if(player.position.y + player.height / 2 <= platform.position.y 
        && player.position.y + player.height / 2+ player.velocity.y >= platform.position.y
        && (player.position.x + player.width / 2 >= platform.position.x && player.position.x <= platform.position.x + platform.width)){
            player.velocity.y = 0;
            keys.up.count = 0;
        }
        //detection if player touched bottom
        if(player.position.y == canvas.height - player.height / 2 - player.velocity.y){
            keys.up.count = 0;
            console.log("you lost");
        }
    })

    
    
    if (scrollOffset > 2000){
        console.log("You won");
    }

    player.update();

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


addEventListener("resize", () =>{
    location.reload(true);
})