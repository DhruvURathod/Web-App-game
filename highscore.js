const highScoreElement = document.getElementById('highScore');

// Load and display high score
const highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreElement.textContent = highScore;