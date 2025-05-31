const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game sounds
const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('gameover.mp3');

// Snake skin colors
const snakeColors = {
    green: '#2ecc71',
    blue: '#3498db',
    purple: '#9b59b6',
    orange: '#e67e22'
};

// Food emojis
const foodEmojis = {
    apple: '🍎',
    orange: '🍊',
    grape: '🍇',
    cherry: '🍒',
    strawberry: '🍓'
};

let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let gameLoop;
let gameSpeed = parseInt(localStorage.getItem('snakeSpeed')) || 100;
let gameStarted = false;
let isPaused = false;
let wallCollisionEnabled = localStorage.getItem('wallCollision') === 'true';
let currentSnakeColor = localStorage.getItem('snakeSkin') || 'green';
let currentFoodSkin = localStorage.getItem('foodSkin') || 'apple';


// Initialize the game
function initGame() {
    snake = [
        { x: 5, y: 5 }
    ];
    generateFood();
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    isPaused = false;
    pauseButton.textContent = 'Pause';
    updateSkins();
}

// Update skins from localStorage
function updateSkins() {
    currentSnakeColor = localStorage.getItem('snakeSkin') || 'green';
    currentFoodSkin = localStorage.getItem('foodSkin') || 'apple';
}

// Generate food at random position
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    
    // Make sure food doesn't spawn on snake
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
        }
    }
}

// Draw the game
function draw() {
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake body
    ctx.fillStyle = snakeColors[currentSnakeColor];
    for (let i = 1; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Draw snake head
    const head = snake[0];
    ctx.fillStyle = snakeColors[currentSnakeColor];
    ctx.fillRect(head.x * gridSize, head.y * gridSize, gridSize - 2, gridSize - 2);
    

    // Draw food
    ctx.font = `${gridSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(foodEmojis[currentFoodSkin], 
        food.x * gridSize + gridSize/2, 
        food.y * gridSize + gridSize/2);

    // Draw pause overlay
    if (isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
}

// Update game state
function update() {
    if (isPaused) return;

    const head = { x: snake[0].x, y: snake[0].y };

    // Move head based on direction
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    // Check for collisions with walls
    if (wallCollisionEnabled) {
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }
    }
     else {
        // Wrap around if wall collision is disabled
        if (head.x < 0) head.x = tileCount - 1;
        if (head.x >= tileCount) head.x = 0;
        if (head.y < 0) head.y = tileCount - 1;
        if (head.y >= tileCount) head.y = 0;
    }

    // Check for collisions with self
    for (let segment of snake) {
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    // Add new head
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        eatSound.currentTime = 0; // Reset sound to start
        eatSound.play();
        generateFood();
    } else {
        // Remove tail if no food was eaten
        snake.pop();
    }
}

// Game over function
function gameOver() {
    clearInterval(gameLoop);
    gameStarted = false;
    gameOverSound.play();
    alert(`Game Over! Your score: ${score}`);
    
    // Update high score if necessary
    const highScore = localStorage.getItem('snakeHighScore') || 0;
    if (score > highScore) {
        localStorage.setItem('snakeHighScore', score);
    }
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (!gameStarted || isPaused) return;
    
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

// Pause/Resume button
pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
});

// Restart button
restartButton.addEventListener('click', () => {
    clearInterval(gameLoop);
    initGame();
    gameStarted = true;
    wallCollisionEnabled = localStorage.getItem('wallCollision') === 'true';
    
    updateSkins();
    gameLoop = setInterval(() => {
        update();
        draw();
    }, gameSpeed);
});

// Start the game initially
initGame();
gameStarted = true;
wallCollisionEnabled = localStorage.getItem('wallCollision') === 'true';

updateSkins();
gameLoop = setInterval(() => {
    update();
    draw();
}, gameSpeed);
// Listen for storage changes to update skins immediately
window.addEventListener('storage', (e) => {
    if (e.key === 'snakeSkin' || e.key === 'foodSkin') {
        updateSkins();
    }
});
