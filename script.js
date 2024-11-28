const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 20;
const tileCount = canvas.width / tileSize;
let snake, direction, food, score, gameRunning, speed, gameInterval;

// Initialize the game state
function initializeGame() {
  snake = [{ x: 10, y: 10 }]; // Initial position of the snake
  direction = { x: 0, y: 0 }; // Snake starts stationary
  food = generateFood(); // Generate food at a valid position
  score = 0;
  gameRunning = true; // Game is running
  clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, speed); // Start the game loop
  drawGame();
}

// Generate food at a position not occupied by the snake
function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
}

function drawTile(x, y, color, isCircle = false) {
    ctx.fillStyle = color;
    if (isCircle) {
      // Draw an opaque circle
      ctx.beginPath();
      ctx.arc(
        x * tileSize + tileSize / 2, // X-coordinate of the center
        y * tileSize + tileSize / 2, // Y-coordinate of the center
        tileSize / 2 - 2,           // Radius (slightly smaller than the tile)
        0,                          // Start angle (0 radians)
        Math.PI * 2                 // End angle (full circle, 2π radians)
      );
      ctx.fill(); // Fill the circle
      ctx.closePath();
    } else {
      // Draw a filled square
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
  
  

// Update the game state
function updateGame() {
  if (!gameRunning) return; // Stop the game loop if the game is over

  // Skip collision checks if the snake isn't moving
  if (direction.x === 0 && direction.y === 0) {
    drawGame();
    return;
  }

  // Move the snake
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  // Check for collisions with walls or itself
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= tileCount ||
    head.y >= tileCount ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameRunning = false; // Stop the game
    drawGame(); // Redraw the game to show the final state
    return;
  }

  snake.unshift(head); // Add new head to the snake

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++; // Increment the score
    food = generateFood(); // Generate new food

    // Increase speed as the snake grows
    if (speed > 30) {
      speed -= 5; // Increase speed by decreasing interval
      clearInterval(gameInterval);
      gameInterval = setInterval(updateGame, speed);
    }
  } else {
    snake.pop(); // Remove the tail if no food is eaten
  }

  drawGame(); // Redraw the game
}

// Draw the entire game (snake, food, and score)
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the food as a hollow circle
  drawTile(food.x, food.y, "red", true);

  // Draw the snake
  snake.forEach(segment => drawTile(segment.x, segment.y, "lime"));

  // Draw the score
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Score: ${score}`, 10, canvas.height - 10);

  // If the game is over, display a "Game Over" message
  if (!gameRunning) {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 4, canvas.height / 2 - 20);

    // Show the restart button
    document.getElementById("restartButton").style.display = "block";
  }
}

// Change the direction of the snake based on user input
function changeDirection(event) {
  if (!gameRunning) return; // Ignore input if the game is over

  const key = event.key;
  // Prevent reversing direction
  if (key === "ArrowUp" && direction.y === 0) {
    direction = { x: 0, y: -1 };
  } else if (key === "ArrowDown" && direction.y === 0) {
    direction = { x: 0, y: 1 };
  } else if (key === "ArrowLeft" && direction.x === 0) {
    direction = { x: -1, y: 0 };
  } else if (key === "ArrowRight" && direction.x === 0) {
    direction = { x: 1, y: 0 };
  }
}

// Set the initial speed based on the user's selection
function setSpeed() {
  const speedSelect = document.getElementById("speed");
  speed = parseInt(speedSelect.value);
  if (gameRunning) {
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, speed);
  }
}

// Restart the game
function restartGame() {
  document.getElementById("restartButton").style.display = "none"; // Hide the button
  initializeGame(); // Reset the game state
}

// Event listener for arrow key presses
document.addEventListener("keydown", changeDirection);

// Initialize speed and start the game on page load
speed = 100; // Default speed is Medium
initializeGame();
