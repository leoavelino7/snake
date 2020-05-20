"ue strict";

var SNAKE = SNAKE || {
    view: {},
    controller: {},
    config: {}
};

(function initConfig() {
    this.canvas = document.querySelector('#snakeCanvas');
    this.gameWidth = this.canvas.width;
    this.gameHeight = this.canvas.height;
    this.cellWidth = 8;
    this.scoreTextStyle = '20px Verdana';
    this.snakeLength = 5;
    this.speed = 50;
    this.color = {
        background: '#fff',
        boardBorder: '#fff',
        score: '#000',
        snake: {
            fill: '#960c0c',
            border: '#960c0c'
        },
        food: {
            fill: '#e67e22',
            border: '#e67e22'
        }
    }
    this.keyCode = {
        UP: '38',
        DOWN: '40',
        LEFT: '37',
        RIGHT: '39',
        P: '80',
        C: '67'
    }
}).call(SNAKE.config);

(function initView(config) {
    const canvas = config.canvas,
        context = canvas.getContext('2d');

    const paintGameBoard = (x = 0, y = 0) => {
        const { color } = config,
            { boardBorder, background } = color,
            { gameWidth, gameHeight } = config;

        context.fillStyle = background;
        context.fillRect(x, y, gameWidth, gameHeight);
        context.strokeStyle = boardBorder;
        context.strokeRect(x, y, gameWidth, gameHeight);
    };

    const paintScore = function (score) {
        const scoreColor = config.color.score,
            scoreTextStyle = config.scoreTextStyle;

        context.font = scoreTextStyle;
        context.fillStyle = scoreColor;
        context.fillText(score, 30, 25);
    };

    const paintCell = (x, y, color) => {
        const { cellWidth } = config;

        context.fillStyle = color.fill;
        context.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
        context.strokeStyle = color.border;
        context.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
    };

    const paintSnake = (snake) => {
        const snakeColor = config.color.snake;

        for (index in snake) {
            const snakeCell = snake[index];
            paintCell(snakeCell.x, snakeCell.y, snakeColor);
        };
    };

    this.refresh = function (food, snake, score) {
        const foodColor = config.color.food;

        paintGameBoard();
        paintSnake(snake);
        paintCell(food.x, food.y, foodColor);
        paintScore(score);
    };
}).call(SNAKE.view, SNAKE.config);

(function initController(config, view) {
    let food,
        snake,
        score,
        direction,
        gameLoop,
        that = this;

    const incrementScore = () => score++;

    const createSnake = () => {
        const snakeLength = config.snakeLength;

        snake = [];

        for (let i = snakeLength; i > 0; i--) {
            snake.push({
                x: i,
                y: 0
            });
        };
    };

    const createFood = () => {
        const cellWidth = config.cellWidth,
            gameWidth = config.gameWidth,
            gameHeight = config.gameHeight,
            randomX = Math.round(Math.random() * (gameWidth - cellWidth) / cellWidth),
            randomY = Math.round(Math.random() * (gameHeight - cellWidth) / cellWidth);

        food = {
            x: randomX,
            y: randomY
        };
    };

    const addKeyEventListeners = () => {
        const keyCode = config.keyCode;

        document.addEventListener('keydown', function (event) {
            const pressedKey = event.which;

            if (pressedKey == keyCode.LEFT && direction != 'right') {
                direction = 'left';
            } else if (pressedKey == keyCode.UP && direction != 'down') {
                direction = 'up'
            } else if (pressedKey == keyCode.RIGHT && direction != 'left') {
                direction = 'right';
            } else if (pressedKey == keyCode.DOWN && direction != 'up') {
                direction = 'down';
            } else if (pressedKey == keyCode.P) {
                that.stopLooping();
            } else if (pressedKey == keyCode.C) {
                that.startLooping();
            };
        });
    };

    const checkBodyCollision = (head) => {
        for (indice in snake) {
            const snakeCell = snake[indice];
            if (snakeCell.x == head.x && snakeCell.y == head.y) {
                return true;
            };
        };
        return false;
    };

    const checkCollision = (head) => {
        const leftCollision = head.x == -1,
            rightCollision = head.x == config.gameWidth / config.cellWidth;
        bottomCollsion = head.y == -1;
        topCollision = head.y == config.gameHeight / config.cellWidth;

        if (leftCollision || rightCollision || bottomCollsion || topCollision || checkBodyCollision(head)) {
            throw new Error('Voce perdeu =(');
        };
    };

    const chooseSnakeDirection = () => {
        const head = {
            x: snake[0].x,
            y: snake[0].y
        };

        if (direction == 'right') {
            head.x++;
        } else if (direction == 'left') {
            head.x--;
        } else if (direction == 'up') {
            head.y--;
        } else if (direction == 'down') {
            head.y++;
        };
        return head;
    };

    const checkSnakeEatFood = (head) => {
        let tail = {
            x: null,
            y: null
        };
        if (head.x == food.x && head.y == food.y) {
            incrementScore();
            createFood();
        } else {
            snake.pop();
        };
        tail.x = head.x;
        tail.y = head.y;

        return tail;
    };

    const makeSnakeMovement = tail => snake.unshift(tail);

    const gameRefresh = () => {
        try {
            let newHeadPosition,
                tail;

            newHeadPosition = chooseSnakeDirection();
            checkCollision(newHeadPosition);
            tail = checkSnakeEatFood(newHeadPosition);
            makeSnakeMovement(tail);
            view.refresh(food, snake, score);
        } catch (e) {
            alert(e.message);
            SNAKE.init(SNAKE.controller, SNAKE.config, SNAKE.view);
        };
    };

    this.initGameDefault = () => {
        const snakeLength = config.snakeLength;

        addKeyEventListeners();
        direction = 'down';
        createSnake();
        createFood();
        score = snakeLength;
    };

    this.startLooping = () => {
        if (typeof gameLoop != "undefined") clearInterval(gameLoop);
        gameLoop = setInterval(gameRefresh, config.speed);
    };

    this.stopLooping = () => {
        if (typeof gameLoop != "undefined") clearInterval(gameLoop);
        gameRefresh();
    };
}).call(SNAKE.controller, SNAKE.config, SNAKE.view);

SNAKE.init = function (controller, config, view) {
    controller.initGameDefault();
    controller.startLooping();
}

SNAKE.init(SNAKE.controller, SNAKE.config, SNAKE.view);
