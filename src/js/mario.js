const platform = "../../src/img/platform.png";
const hills = "../../src/img/hills.png";
const background = "../../src/img/background.png";
const platformSmallTall = "../../src/img/platformSmallTall.png";
const spriteRunLeft = "../../src/img/spriteRunLeft.png";
const spriteRunRight = "../../src/img/spriteRunRight.png";
const spriteStandLeft = "../../src/img/spriteStandLeft.png";
const spriteStandRight = "../../src/img/spriteStandRight.png";

const canvas = document.getElementById("canvasBox");
const c = canvas.getContext("2d");
canvas.width = 1600;
canvas.height = 900;

const gravity = .5;

class Player {
    constructor() {
        this.position = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        this.width = 66;
        this.height = 150;
        this.velocity = {
            x: 0,
            y: 0
        }
        this.speed = 15;
        this.image = createImage(spriteStandRight);
        this.frames = 0;
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width: 127.875
            }
        }
        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = 177;
    }

    update() {
        this.frames++;
        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) {
            this.frames = 0;
        } else if (this.frames > 30 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) {
            this.frames = 0;
        }
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        if (this.position.y < canvas.height - this.height / 2 - this.velocity.y) {
            this.velocity.y += gravity;
        }/*else{
            this.velocity.y = 0;            
        }*/
    }

    draw() {
        const { x, y } = this.position;
        c.drawImage(this.currentSprite, this.currentCropWidth * this.frames, 0, this.currentCropWidth, 400, this.position.x, this.position.y, this.width, this.height);
    }
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        };
        this.image = image;
        this.width = image.width;
        this.height = canvas.height;
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height + 10);
    }
}
let lastKey;
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false,
        count: 0
    },
    down: {
        pressed: false
    }
}

function createImage(imageSrc) {
    const image = new Image();
    image.src = imageSrc;
    return image
}


let scrollOffset = 0;
let player = new Player();
let platforms = [];
let genericObjects = [];
let hillsArray = [];
let platformImage = createImage(platform);
let platformSmallImage = createImage(platformSmallTall);
let backgroundImage = createImage(background);
let hillsImage = createImage(hills);
const init = () => {
    scrollOffset = 0;
    player = new Player();
    platforms = [];
    genericObjects = [];
    hillsArray = [];
    let w = 200;
    let z = 500;
    w += 700;
    z -= 0;
    platforms.push(new Platform({ x: 0 - platformImage.width, y: canvas.height - platformImage.height, image: platformImage }))
    platforms.push(new Platform({ x: 0, y: canvas.height - platformImage.height, image: platformImage }))
    platforms.push(new Platform({ x: platformImage.width - 3, y: canvas.height - platformImage.height, image: platformImage }))
    platforms.push(new Platform({ x: platformImage.width * 2 + 100, y: canvas.height - platformImage.height, image: platformImage }))
    platforms.push(new Platform({ x: platformImage.width * 3 + 300, y: canvas.height - platformImage.height - 200, image: platformImage }))
    platforms.push(new Platform({ x: platformImage.width * 4 + 500, y: canvas.height - platformImage.height, image: platformImage }))
    platforms.push(new Platform({ x: platformImage.width * 5 + 210, y: canvas.height - platformImage.height - 225, image: platformSmallImage }))
    platforms.push(new Platform({ x: platformImage.width * 6 + 210, y: canvas.height - platformImage.height - 450, image: platformSmallImage }))
    platforms.push(new Platform({ x: platformImage.width * 7 + 330, y: canvas.height - platformImage.height, image: platformSmallImage }))
    platforms.push(new Platform({ x: platformImage.width * 8 + 330, y: canvas.height - platformImage.height, image: platformImage }))
    platforms.push(new Platform({ x: platformImage.width * 9 + 327, y: canvas.height - platformImage.height, image: platformImage }))
    genericObjects.push(new GenericObject({ x: -1, y: -1, image: backgroundImage }))
    genericObjects.push(new GenericObject({ x: -1, y: -1, image: hillsImage }))
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

    if (keys.right.pressed && player.position.x <= canvas.width / 2) {
        player.velocity.x = player.speed;
    } else if (keys.left.pressed && player.position.x >= 100) {
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0;
        if (keys.right.pressed) {
            scrollOffset += player.speed;
            platforms.forEach(platform => {
                platform.position.x -= player.speed;
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed - 3;
            })
        } else if (keys.left.pressed && scrollOffset != 0) {
            scrollOffset -= player.speed;
            platforms.forEach(platform => {
                platform.position.x += player.speed;
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed - 3;
            })
        }
    }

    // jumping 
    if (keys.up.pressed && keys.up.count <= 1) {
        player.velocity.y = -15;
        keys.up.count++;
    }

    //platform detection
    //detection to disallow multiple jumping PART 1
    platforms.forEach(platform => {
        platform.draw();

        if (player.position.y + player.height  <= platform.position.y
            && player.position.y + player.height  + player.velocity.y >= platform.position.y
            && (player.position.x + player.width  >= platform.position.x && player.position.x <= platform.position.x + platform.width)) {
            player.velocity.y = 0;
            keys.up.count = 0;
        }

    })

    //switching sprites
    if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right){
        player.frames = 1;
        player.currentSprite = player.sprites.run.right;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
    }
    else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left){
        player.frames = 1;
        player.currentSprite = player.sprites.run.left;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
    }
    else if (keys.right.pressed == false && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right){
        player.frames = 1;
        player.currentSprite = player.sprites.stand.left;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
    }
    else if (keys.left.pressed == false && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left){
        player.frames = 1;
        player.currentSprite = player.sprites.stand.left;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
    }


    //detection if player touched bottom == lose
    if (player.position.y >= canvas.height) {
        /*keys.up.count = 0;*/
        // console.log("you lost");
        init();
    }

    if (scrollOffset > platformImage.width * 9) {
        console.log("You won");
    }

    player.update();

    // console.log(scrollOffset);
}

init();
animate();

addEventListener("keydown", ({ key }) => {
    switch (key) {
        case "ArrowRight":
            keys.right.pressed = true;
            lastKey = 'right';
            break
        case "ArrowLeft":
            keys.left.pressed = true;
            lastKey = 'left';
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

addEventListener("keyup", ({ key }) => {
    switch (key) {
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


addEventListener("resize", () => {
    location.reload(true);
})