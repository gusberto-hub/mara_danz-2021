"use strict";

const canvas = document.querySelector("#canvas_1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray = [];
const imgSrc = document.querySelector("#bg_image img").src;
const image1 = new Image();

// handle mouse
const mouse = {
  x: null,
  y: null,
  radius: 40,
};
window.addEventListener("pointermove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

image1.src = imgSrc;

image1.addEventListener("load", function () {
  ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
  const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const scannedData = scannedImage.data;

  for (let i = 0; i < scannedData.length; i += 4) {
    const total = scannedData[i] + scannedData[i + 1] + scannedData[i + 2];
    const averageColorData = total / 3;

    scannedData[i] = averageColorData;
    scannedData[i + 1] = averageColorData;
    scannedData[i + 2] = averageColorData;
  }
  scannedImage.data = scannedData;
  ctx.putImageData(scannedImage, 0, 0);
});

ctx.fillStyle = "white";
ctx.font = "80px Courier";
ctx.fillText(`Von wilhelm`, 10, 60);

// ctx.strokeStyle = "white";
// ctx.strokeRect(0, 0, 100, 100);
const textCoordinates = ctx.getImageData(0, 0, 600, 100);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 40 + 6;
  }

  draw() {
    ctx.fillStyle = `rgba(255,255,255,1)`;
    ctx.beginPath();
    // ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.rect(this.x, this.y, this.size, this.size);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;
    const resetPositionSpeed = 10;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / resetPositionSpeed;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / resetPositionSpeed;
      }
    }

    // if (distance < mouse.radius / 2) {
    //   this.size = mouse.radius / 7;
    // } else if (distance < mouse.radius) {
    //   this.size = mouse.radius / 5;
    // } else {
    //   this.size = 3;
    // }
  }
}

function init() {
  particlesArray = [];
  scale = 3;

  // for (let i = 0; i < 1000; i++) {
  //   let x = Math.random() * canvas.width;
  //   let y = Math.random() * canvas.height;
  //   particlesArray.push(new Particle(x, y));
  // }
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
      ) {
        let positionX = x;
        let positionY = y;
        particlesArray.push(new Particle(positionX * scale, positionY * scale));
      }
    }
  }
}

init();
console.log(particlesArray);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].draw();
    particlesArray[i].update();
  }
  // connect();
  requestAnimationFrame(animate);
}
animate();

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 50) {
        opacityValue = 1 - distance / 50;
        ctx.strokeStyle = `rgba(255,255,255,${opacityValue})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}