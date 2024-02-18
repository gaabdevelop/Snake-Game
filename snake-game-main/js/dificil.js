const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");
const deathAudio = new Audio("../assets/death.mp3");
const audio = new Audio("../assets/audio.mp3");
const backgroundMusic = new Audio("../assets/background-music.mp3"); // Adicione o caminho para sua música de fundo

let size = 30;

const initialPosition = { x: 270, y: 240 };

let snake = [initialPosition];

// upgrades

// define o placar
const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

// Verifica se o jogador atingiu 20 (qualquer quantidade) pontos (pode fazer o que quiser com estes pontos)

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / 30) * 30;
};

// define a cor do inimigo
const randomColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);

  return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

let direction,
  loopId,
  gameOverAudioPlayed = false;

const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};

// configurações das cores da cobra
const drawSnake = () => {
  ctx.fillStyle = "#ddd";

  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "white";
    }

    ctx.fillRect(position.x, position.y, size, size);
  });
};

// configurações de movimento da cobra
const moveSnake = () => {
  if (!direction) return;

  const head = snake[snake.length - 1];

  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y });
  }

  if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y });
  }

  if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size });
  }

  if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size });
  }

  snake.shift();
};

const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};

const checkEat = () => {
  const head = snake[snake.length - 1];

  if (head.x == food.x && head.y == food.y) {
    incrementScore();
    snake.push(head);
    audio.play();

    let x = randomPosition();
    let y = randomPosition();

    while (snake.find((position) => position.x == x && position.y == y)) {
      x = randomPosition();
      y = randomPosition();
    }

    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
};

const checkCollision = () => {
  const head = snake[snake.length - 1];
  const canvasLimit = canvas.width - size;
  const neckIndex = snake.length - 2;

  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y;
  });

  if (wallCollision || selfCollision) {
    gameOver();
  }
};

const gameOver = () => {
  if (!gameOverAudioPlayed) {
    deathAudio.play(); // Reproduz o áudio de morte apenas uma vez
    gameOverAudioPlayed = true;
  }

  backgroundMusic.pause(); // Pausa a música de fundo
  direction = undefined;

  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
};

let gameLoop = () => {
  clearInterval(loopId);

  ctx.clearRect(0, 0, 600, 600);
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkEat();
  checkCollision();

  loopId = setTimeout(() => {
    gameLoop();
  }, 150); // velocidade da cobra
};

// Inicie a música de fundo
backgroundMusic.loop = true;
backgroundMusic.play();

gameLoop();

score;

// mover com as setas
document.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowRight" && direction != "left") {
    direction = "right";
  }

  if (key == "ArrowLeft" && direction != "right") {
    direction = "left";
  }

  if (key == "ArrowDown" && direction != "up") {
    direction = "down";
  }

  if (key == "ArrowUp" && direction != "down") {
    direction = "up";
  }
});

buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";

  snake = [initialPosition];
  gameOverAudioPlayed = false; // Reinicia o estado de áudio de game over
  backgroundMusic.play(); // Retoma a música de fundo
  gameLoop();
});

// mover com W,S,D,A
document.addEventListener("keydown", ({ key }) => {
  if ((key === "d" || key === "ArrowRight") && direction !== "left") {
    direction = "right";
  } else if ((key === "a" || key === "ArrowLeft") && direction !== "right") {
    direction = "left";
  } else if ((key === "s" || key === "ArrowDown") && direction !== "up") {
    direction = "down";
  } else if ((key === "w" || key === "ArrowUp") && direction !== "down") {
    direction = "up";
  }
});

console.log("Placar atual:", +score.innerText);

document.addEventListener("keydown", (event) => {
  if (event.key === "Shift") {
    // Verifica se a pontuação é maior ou igual a 20

    loopId = setTimeout(() => {
      gameLoop();
    }, 50); // velocidade da cobra
  }
});
