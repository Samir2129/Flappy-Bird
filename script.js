const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdImg = new Image();
birdImg.src = "images/bird.png"; // Make sure this path is correct

let bird = {
  x: 80,
  y: 150,
  width: 40,
  height: 40,
  gravity: 0.6,
  lift: -10,
  velocity: 0
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function createPipe() {
  let topHeight = Math.random() * 200 + 50;
  let gap = 120;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 50
  });
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.fillStyle = "#228B22";
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (frame % 100 === 0) createPipe();

  pipes.forEach(pipe => {
    pipe.x -= 2;

    // Collision
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      gameOver = true;
    }

    // Score
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;
      pipe.passed = true;
    }
  });

  // Ground/ceiling collision
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }

  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "24px sans-serif";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();
}

function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    frame++;
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = "#000";
    ctx.font = "36px sans-serif";
    ctx.fillText("Game Over", 120, 300);
  }
}

document.addEventListener("keydown", () => {
  bird.velocity = bird.lift;
});

birdImg.onload = () => {
  gameLoop();
};
