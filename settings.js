// Sound controls

const wallCollision = document.getElementById('wallCollision');
const wallStatus = document.getElementById('wallStatus');

// Load saved settings

wallCollision.checked = localStorage.getItem('wallCollision') === 'true';
wallStatus.textContent = wallCollision.checked ? 'Enabled' : 'Disabled';

// Speed buttons
const speedButtons = document.querySelectorAll('.speed-btn');
const savedSpeed = localStorage.getItem('snakeSpeed') || '100';
speedButtons.forEach(button => {
    if (button.dataset.speed === savedSpeed) {
        button.classList.add('active');
    }
});

// Skin buttons
const skinButtons = document.querySelectorAll('.skin-btn');
const savedSkin = localStorage.getItem('snakeSkin') || 'green';
skinButtons.forEach(button => {
    if (button.dataset.skin === savedSkin) {
        button.classList.add('active');
    }
});

// Food buttons
const foodButtons = document.querySelectorAll('.food-btn');
const savedFood = localStorage.getItem('foodSkin') || 'apple';
foodButtons.forEach(button => {
    if (button.dataset.food === savedFood) {
        button.classList.add('active');
    }
});



wallCollision.addEventListener('change', () => {
    wallStatus.textContent = wallCollision.checked ? 'Enabled' : 'Disabled';
    localStorage.setItem('wallCollision', wallCollision.checked);
});

// Speed button click handler
speedButtons.forEach(button => {
    button.addEventListener('click', () => {
        speedButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        localStorage.setItem('snakeSpeed', button.dataset.speed);
    });
});

// Skin button click handler
skinButtons.forEach(button => {
    button.addEventListener('click', () => {
        skinButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        localStorage.setItem('snakeSkin', button.dataset.skin);
    });
});

// Food button click handler
foodButtons.forEach(button => {
    button.addEventListener('click', () => {
        foodButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        localStorage.setItem('foodSkin', button.dataset.food);
    });
});