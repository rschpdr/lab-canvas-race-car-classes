const gameBoard = document.getElementById("game-board");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Component {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }

  isCrashedWith(obstacle) {
    const condition = !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );

    return condition;
  }
}

class Obstacle extends Component {
  move() {
    this.y += this.speed;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Game {
  constructor(background, player) {
    this.background = background;
    this.player = player;
    this.animationId = 0;
    this.obstacles = [];
    this.frames = 0;
    this.score = 0;
    this.carCrashSound = new Audio();
    this.carCrashSound.src = "./sounds/car-crash.wav";
    this.carCrashSound.volume = 0.1;
  }

  updateGame = () => {
    this.clear();

    this.background.move();
    this.background.draw();

    this.player.move();
    this.player.draw();

    this.updateObstacles();

    this.updateScore(this.score);

    this.animationId = requestAnimationFrame(this.updateGame);

    this.checkGameOver();
  };

  clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  updateObstacles = () => {
    this.frames++;
    this.score = Math.floor(this.frames / 10);

    this.obstacles.map((obstacle) => {
      obstacle.move();
      obstacle.draw();
    });

    if (this.frames % 90 === 0) {
      const minWidth = 100;
      const maxWidth = 200;
      const width =
        Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;

      const minX = 40;
      const maxX = canvas.width - 40 - width;
      const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

      const obstacle = new Obstacle(x, 0, width, 30, 2);

      this.obstacles.push(obstacle);
    }
  };

  startGame = () => {
    this.animationId = requestAnimationFrame(this.updateGame);
  };

  checkGameOver = () => {
    const crashed = this.obstacles.some((obstacle) => {
      return this.player.isCrashedWith(obstacle);
    });

    if (crashed) {
      cancelAnimationFrame(this.animationId);

      this.carCrashSound.play();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "40px Arial";
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "red";
      ctx.fillText("Game Over!", canvas.width / 4, 200);
      ctx.fillStyle = "white";
      ctx.fillText(`Your Final Score: ${this.score}`, canvas.width / 6, 400);
    }
  };

  updateScore = (score) => {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";

    ctx.fillText(`Score ${this.score}`, 70, 20);
  };
}

class Player extends Component {
  constructor(x, y, widht, height, speed) {
    super(x, y, widht, height, speed);
    this.img = new Image();
    this.img.src = "./images/car.png";
  }

  move() {
    this.x += this.speed;

    if (this.x <= 40) {
      this.x = 40;
    }

    if (this.x >= canvas.width - 100) {
      this.x = canvas.width - 100;
    }
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

class Background {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 2;
    this.img = new Image();
    this.img.src = "./images/road.png";
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

    if (this.speed >= 0) {
      ctx.drawImage(
        this.img,
        this.x,
        this.y - canvas.height,
        this.width,
        this.height
      );
    }
  }

  move() {
    this.y += this.speed;

    if (this.y >= canvas.height) {
      this.y = 0;
    }
  }
}

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    startGame();
  };

  function startGame() {
    // Exibir o canvas
    gameBoard.style.display = "block";

    // Instanciar a classe principal do jogo e inicializar a imagem de fundo e o jogador
    const game = new Game(
      new Background(0, 0, canvas.width, canvas.height),
      new Player(canvas.width / 2 - 25, canvas.height - 150, 50, 100, 0)
    );
    game.startGame();

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "a") {
        game.player.speed = -2;
      }

      if (event.key === "ArrowRight" || event.key === "d") {
        game.player.speed = 2;
      }
    });

    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft" || event.key === "a") {
        game.player.speed = 0;
      }

      if (event.key === "ArrowRight" || event.key === "d") {
        game.player.speed = 0;
      }
    });
  }
};
