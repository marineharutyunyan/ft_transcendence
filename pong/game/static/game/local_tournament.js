const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');
const exitButton = document.getElementById('exitButton');
const nextMatchButton = document.getElementById('nextMatchButton');

canvas.width = 800;
canvas.height = 550;

const winningScore = 1;

let final = false;
let ballfalg = true;
let paddleWidth = 10;
let ballRadius = 10;
let paddleHeight = 100;
let gameOver = false;
let gameStarted = false;

function shuffleAndJoin(arr) {
    // Shuffle array
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Join into a single string
    return arr;
}

//ction for get users from database
debugger
function getUsers() {
    let users = localStorage.getItem('users');
    // users = JSON.parse(users);
    console.log(users);
    // let url = `http://10.12.17.4:8000/start_tournament/`;
    // fetch(url)
    // .then(response => response.json())
    // .then(data => {
    //     data.forEach(user => {
    //         users.push(user.username);
    //     });
    // });
    debugger;
    return users.split(',');
}
// Usage:
let usernameList = shuffleAndJoin(getUsers());

let players = [
    { 
        username: usernameList[0],
        x: 0, 
        y: (canvas.height - paddleHeight) / 2 + 40,
        width: paddleWidth,
        height: paddleHeight,
        dy: 0,
        score: 0
    },
    { 
        username: usernameList[1], 
        x: canvas.width - paddleWidth, 
        y: (canvas.height - paddleHeight) / 2 + 40, 
        width: paddleWidth, 
        height: paddleHeight, 
        dy: 0, 
        score: 0 
    },
    { 
        username: usernameList[2], 
        x: 0, 
        y: (canvas.height - paddleHeight) / 2 + 40, 
        width: paddleWidth, 
        height: paddleHeight, 
        dy: 0, 
        score: 0 
    },
    { 
        username: usernameList[3], 
        x: canvas.width - paddleWidth, 
        y: (canvas.height - paddleHeight) / 2 + 40, 
        width: paddleWidth, 
        height: paddleHeight, 
        dy: 0, 
        score: 0 
    }
];

let currentMatch = [0, 1]; 
let finalists = [];
let winners = []; 
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 4,
    dx: 4,
    dy: 4
};

function drawline() {
    context.fillStyle = '#fff';
    context.fillRect(0, 90, canvas.width, 10);
}

function drawPaddle(x, y, width, height) {
    context.fillStyle = '#fff';
    context.fillRect(x, y, width, height);
}

function drawBall(x, y, radius) {
    if (ballfalg === false) {
        ballfalg = true;
    }
    context.fillStyle = '#fff';
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

function drawScore() {
    context.font = '32px Arial';
    context.fillStyle = '#fff';
    context.fillText(players[currentMatch[0]].username, 0.5 * canvas.width / 4, 50);
    context.fillText(players[currentMatch[0]].score,    1.5 * canvas.width / 4, 50);
    context.fillText("VS", 2 * canvas.width / 4 - 10, 50);       
    context.fillText(players[currentMatch[1]].score,    2.5 * canvas.width / 4, 50);
    context.fillText(players[currentMatch[1]].username, 3   * canvas.width / 4, 50);
}


function drawWinner(winner) {
    ballfalg = false;
    context.font = '48px Arial';
    context.fillStyle = '#fff';
    context.fillText(winner + " Wins!", canvas.width / 2 - 180, canvas.height / 2);
}

function drawStartMessage() {
    context.fillStyle = '#fff';
    
    context.font = '48px Arial';
    context.fillText("Press Enter to start", canvas.width / 2 - 200, canvas.height / 2);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
}

function update() {
    if (!gameOver) {
        // Move paddles
        players[currentMatch[0]].y += players[currentMatch[0]].dy;
        players[currentMatch[1]].y += players[currentMatch[1]].dy;

        // Ensure paddles stay within canvas bounds
        if (players[currentMatch[0]].y < 100) players[currentMatch[0]].y = 100;
        if (players[currentMatch[0]].y + paddleHeight > canvas.height) players[currentMatch[0]].y = canvas.height - paddleHeight;
        if (players[currentMatch[1]].y < 100) players[currentMatch[1]].y = 100;
        if (players[currentMatch[1]].y + paddleHeight > canvas.height) players[currentMatch[1]].y = canvas.height - paddleHeight;

        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with top and bottom walls
        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 100) {
            ball.dy *= -1;
        }

        // Ball collision with paddles
        if (ball.x - ball.radius < players[currentMatch[0]].x + players[currentMatch[0]].width &&
            ball.y > players[currentMatch[0]].y && ball.y < players[currentMatch[0]].y + players[currentMatch[0]].height) {
            ball.dx *= -1;
        }
        if (ball.x + ball.radius > players[currentMatch[1]].x &&
            ball.y > players[currentMatch[1]].y && ball.y < players[currentMatch[1]].y + players[currentMatch[1]].height) {
            ball.dx *= -1;
        }

        // Ball goes out of bounds
        if (ball.x - ball.radius < 0) {
            players[currentMatch[1]].score++;
            if (players[currentMatch[1]].score >= winningScore) {
                gameOver = true;
                if (finalists.length < 3) {
                    finalists.push(currentMatch[1]);
                    winners.push(players[currentMatch[1]].username);
                }
            }
            resetBall();
        }
        if (ball.x + ball.radius > canvas.width) {
            players[currentMatch[0]].score++;
            if (players[currentMatch[0]].score >= winningScore) {
                gameOver = true;
                if (finalists.length < 3) {
                    winners.push(players[currentMatch[0]].username);
                    finalists.push(currentMatch[0]);
                }
            }
            resetBall();
        }

        draw();
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawline();
    drawPaddle(players[currentMatch[0]].x, players[currentMatch[0]].y, players[currentMatch[0]].width, players[currentMatch[0]].height);
    drawPaddle(players[currentMatch[1]].x, players[currentMatch[1]].y, players[currentMatch[1]].width, players[currentMatch[1]].height);
    drawScore();

    if (gameOver) {
        if (players[currentMatch[0]].score >= winningScore) {
            drawWinner(players[currentMatch[0]].username);
        } else if (players[currentMatch[1]].score >= winningScore) {
            drawWinner(players[currentMatch[1]].username);
        }

        if (final === false) {
            nextMatchButton.style.display = 'block';
        }
    } else if (ballfalg === true) {
        drawBall(ball.x, ball.y, ball.radius);
    }
}

function nextMatch() {
    if (finalists.length === 1) {
        currentMatch = [2, 3];
    } else if (finalists.length === 2) {
        final = true
        currentMatch = [0, 3];
        context.fillStyle = '#fff';
        let message = "Final match!";
    
        context.font = '48px Arial';
        context.fillText(message, canvas.width / 4, 300);
        
        players[0].username = players[finalists[0]].username;
        players[3].username = players[finalists[1]].username;
    }

    players[currentMatch[0]].score = 0;
    players[currentMatch[1]].score = 0;
    gameOver = false;
    nextMatchButton.style.display = 'none';
    draw();
    startGame();

}

function exitGame() {
    fetch('http://10.12.11.2:8000/home/' , {
        method: 'POST',
        body: JSON.stringify({
            'winners': winners
        })
    })
    .then(response => response.json())
    .then(data => {
        
        const url = `http://10.12.11.2:8000/home/`;
        window.location.href = url;
        console.log(data);
    });

}

function resetGame() {
    gameOver = false;
    gameStarted = false;
    players.forEach(player => {
        player.score = 0;
        player.y = (canvas.height - paddleHeight) / 2 + 40;
        player.dy = 0;
    });
    ball.dx = 4;
    ball.dy = 4;
}

function startGame() {
    drawStartMessage();
    resetGame();
    if (!gameStarted || gameOver) {
        const enterKeyListener = function(event) {
            if (event.keyCode === 13){ // Enter key
                gameStarted = true;
                resetBall();
                drawBall(ball.x, ball.y, ball.radius);
                gameLoop();
                // Remove the event listener when the game starts
                document.removeEventListener('keydown', enterKeyListener);
            }
        };
        document.addEventListener('keydown', enterKeyListener);
    }
}

function gameLoop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Attach event listeners
nextMatchButton.addEventListener('click', nextMatch);
exitButton.addEventListener('click', exitGame);

// Keyboard controls
document.addEventListener('keydown', function(event) {
    switch(event.keyCode) {
        case 38: // Up arrow
            players[currentMatch[1]].dy = -6;
            break;
        case 40: // Down arrow
            players[currentMatch[1]].dy = 6;
            break;
        case 87: // 'W'
            players[currentMatch[0]].dy = -6;
            break;
        case 83: // 'S'
            players[currentMatch[0]].dy = 6;
            break;
        
    }
});

document.addEventListener('keyup', function(event) {
    switch(event.keyCode) {
        case 38: // Up arrow
        case 40: // Down arrow
            players[currentMatch[1]].dy = 0;
            break;
        case 87: // 'W'
        case 83: // 'S'
            players[currentMatch[0]].dy = 0;
            break;
    }
});

startGame();
