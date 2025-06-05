const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let birdImg = new Image();
birdImg.src = "images/bird.png";

let bird = {
  x: 80,
  y: 150,
  width: 40,
  height: 40,
  gravity: 0.6,
  lift: -10,
  velocity: 0,
  rotation: 0
};

let pipes = [];
let frame = 0;
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let gameOver = false;

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  bird.rotation = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  gameLoop();
}

function drawBird() {
  ctx.save();
  ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
  ctx.rotate(bird.rotation);
  ctx.drawImage(birdImg, -bird.width / 2, -bird.height / 2, bird.width, bird.height);
  ctx.restore();
}

function createPipe() {
  let topHeight = Math.random() * 200 + 50;
  let gap = 120;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 50,
    passed: false
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

  // Rotate based on velocity
  bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity / 10));

  if (frame % 100 === 0) createPipe();

  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      gameOver = true;
    }

    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      score++;
      pipe.passed = true;
    }
  });

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver = true;
  }

  pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Best: ${bestScore}`, 10, 60);
}

function drawGameOver() {
  ctx.fillStyle = "#000";
  ctx.font = "36px sans-serif";
  ctx.fillText("Game Over", 110, 270);
  ctx.font = "20px sans-serif";
  ctx.fillText("Press Space to Restart", 90, 310);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();
  if (gameOver) drawGameOver();
}

function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    frame++;
    requestAnimationFrame(gameLoop);
  } else {
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem("bestScore", bestScore);
    }
    draw();
  }
}

function handleTap() {
  if (gameOver) {
    resetGame();
  } else {
    bird.velocity = bird.lift;
  }
}

canvas.addEventListener("click", handleTap);
canvas.addEventListener("touchstart", handleTap);


birdImg.onload = () => {
  gameLoop();
};
