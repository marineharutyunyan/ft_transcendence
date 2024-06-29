const socket = io();
let playerid = 0;

function joinGame(playerName) {
  socket.emit('joinGame', playerName); // Emit joinGame event to server with playerName

  // Optionally, handle server responses or other client-side logic
  socket.on('joinGame', (player) => {
      console.log(`Joined game as ${player.name}`);
      document.getElementById('playerInfo').textContent = `Player: ${player.name}`;
  });
}

// Event listener for Join Game button click
document.getElementById('joinGameBtn').addEventListener('click', () => {
  const playerName = prompt('Enter your name:'); // Prompt user for their name (you may replace this with a form input)
  if (playerName) {
      joinGame(playerName);
  }
});

// Example of handling game status updates or other events from server
socket.on('gameStatus', (status) => {
  document.getElementById('gameStatus').textContent = status;
});

// Example of rendering game graphics on the canvas (game-specific logic)
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Example drawing function (replace with your game's drawing logic)
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw game elements (paddles, ball, etc.)
  requestAnimationFrame(drawGame); // Continuously redraw the game
}

// Start the game loop
drawGame();

    // Listen for player list update
    socket.on('playerList', (players) => {
      console.log('Players:', players);
      // Update UI with player list
    });

    // Listen for new player joining
    socket.on('newPlayer', (player) => {
      console.log(`${player.username} joined`);
      // Update UI to display new player
    });

    // Listen for player movement
    socket.on('playerMoved', (data) => {
      console.log(`Player ${data.id} moved ${data.direction}`);
      // Update UI to move player
    });

    // Listen for player disconnect
    socket.on('playerDisconnected', (playerId) => {
      console.log(`Player ${playerId} disconnected`);
      // Update UI to remove player
    });

    // Example function to move player (not implemented here)
    function movePlayer(direction) {
      socket.emit('move', { direction });
    }