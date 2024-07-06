const canvas        = document.getElementById('pongCanvas');
const context       = canvas.getContext('2d');
const exitButton    = document.getElementById('exitButton');
const restartButton = document.getElementById('restartButton');

canvas.width  = 800;
canvas.height = 450;

const winningScore = 3;

let player1Score   = 0;
let player2Score   = 0;
let paddleWidth    = 10;
let ballRadius     = 10;
let paddleHeight   = 100;
let gameOver       = false;
let gameStarted    = false;

let player1 = {
    x: 0,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

let player2 = {
    x: canvas.width - paddleWidth,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 4,
    dx: 4,
    dy: 4
};

function drawPaddle(x, y, width, height) {
    context.fillStyle = '#fff';
    context.fillRect(x, y, width, height);
}

function drawBall(x, y, radius) {
    context.fillStyle = '#fff';
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

function drawScore() {
    context.font = '32px Arial';
    context.fillStyle = '#fff';
    context.fillText(player1Score, canvas.width / 4, 50);
    context.fillText(player2Score, 3 * canvas.width / 4, 50);
}

function drawWinner(winner) {
    context.font = '48px Arial';
    context.fillStyle = '#fff';
    context.fillText(winner + " Wins!", canvas.width / 2 - 150, canvas.height / 2);
}

function drawStartMessage() {
    context.font = '32px Arial';
    context.fillStyle = '#fff';
    context.fillText("Press Enter to start", canvas.width / 2 - 150, canvas.height / 2);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
}

function update() {
    if (!gameOver) {
        // Move paddles
        player1.y += player1.dy;
        player2.y += player2.dy;

        // Ensure paddles stay within canvas bounds
        if (player1.y < 0) player1.y = 0;
        if (player1.y + paddleHeight > canvas.height) player1.y = canvas.height - paddleHeight;
        if (player2.y < 0) player2.y = 0;
        if (player2.y + paddleHeight > canvas.height) player2.y = canvas.height - paddleHeight;

        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with top and bottom walls
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.dy *= -1;
        }

        // Ball collision with paddles
        if (ball.x - ball.radius < player1.x + player1.width &&
            ball.y > player1.y && ball.y < player1.y + player1.height) {
            ball.dx *= -1;
        }
        if (ball.x + ball.radius > player2.x &&
            ball.y > player2.y && ball.y < player2.y + player2.height) {
            ball.dx *= -1;
        }

        // Ball goes out of bounds
        if (ball.x - ball.radius < 0) {
            player2Score++;
            if (player2Score >= winningScore) {
                gameOver = true;
                drawWinner("Player 2");
                restartButton.style.display = 'block';
            }
            resetBall();
        }
        if (ball.x + ball.radius > canvas.width) {
            player1Score++;
            if (player1Score >= winningScore) {
                gameOver = true;
                drawWinner("Player 1");
                restartButton.style.display = 'block';
            }
            resetBall();
        }

        draw();
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(player1.x, player1.y, player1.width, player1.height);
    drawPaddle(player2.x, player2.y, player2.width, player2.height);
    drawScore();

    if (gameOver) {
        if (player1Score >= winningScore) {
            drawWinner("Player 1");
        } else if (player2Score >= winningScore) {
            drawWinner("Player 2");
        }
    } else {
        drawBall(ball.x, ball.y, ball.radius);
    }
}

function restartGame() {
    player1Score = 0;
    player2Score = 0;
    gameOver = false;
    gameStarted = false;
    restartButton.style.display = 'none';
    resetBall();
    draw();
}

function exitGame() {
    const url = `http://10.12.11.2:8000/home/`;
    window.location.href = url;
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        setInterval(update, 1000 / 60); // 60 FPS
    }
}

// Attach event listeners
restartButton.addEventListener('click', restartGame);
exitButton.addEventListener('click', exitGame);

// Keyboard controls`
document.addEventListener('keydown', function(event) {
    switch(event.keyCode) {
        case 38: // Up arrow
            player2.dy = -6;
            break;
        case 40: // Down arrow
            player2.dy = 6;
            break;
        case 87: // 'W'
            player1.dy = -6;
            break;
        case 83: // 'S'
            player1.dy = 6;
            break;
        case 13: // Enter key
            startGame();
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch(event.keyCode) {
        case 38: // Up arrow
        case 40: // Down arrow
            player2.dy = 0;
            break;
        case 87: // 'W'
        case 83: // 'S'
            player1.dy = 0;
            break;
    }
});

drawStartMessage();
