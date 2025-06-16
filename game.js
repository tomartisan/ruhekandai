const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverElement = document.getElementById('game-over');

let isJumping = false;
let isGameOver = false;
let isGameStarted = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameSpeed = 5; // Starting speed
const maxSpeed = 15; // Maximum speed
const speedIncreaseInterval = 1000; // Increase speed every second
const speedIncreaseAmount = 0.5; // How much to increase speed by
let lastSpeedIncrease = 0;

// Initialize high score
highScoreElement.textContent = highScore;

// Add start message
const startMessage = document.createElement('div');
startMessage.className = 'game-over';
startMessage.textContent = 'Press CTRL to Start';
document.querySelector('.game-container').appendChild(startMessage);

function jump() {
    if (isJumping || !isGameStarted) return;
    
    isJumping = true;
    dino.classList.add('jump');
    
    setTimeout(() => {
        dino.classList.remove('jump');
        isJumping = false;
    }, 800);
}

function updateScore() {
    score++;
    scoreElement.textContent = score;
    
    // Add score pop animation
    scoreElement.classList.add('score-pop');
    setTimeout(() => {
        scoreElement.classList.remove('score-pop');
    }, 300);
    
    // Update high score if current score is higher
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('highScore', highScore);
    }

    // Increase speed gradually
    const currentTime = Date.now();
    if (currentTime - lastSpeedIncrease > speedIncreaseInterval) {
        gameSpeed = Math.min(gameSpeed + speedIncreaseAmount, maxSpeed);
        lastSpeedIncrease = currentTime;
    }
}

function checkCollision() {
    const dinoRect = dino.getBoundingClientRect();
    const cactusRect = cactus.getBoundingClientRect();
    
    return !(
        dinoRect.right < cactusRect.left ||
        dinoRect.left > cactusRect.right ||
        dinoRect.bottom < cactusRect.top ||
        dinoRect.top > cactusRect.bottom
    );
}

function moveCactus() {
    const currentLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue('left'));
    
    if (currentLeft > -20) {
        cactus.style.left = (currentLeft - gameSpeed) + 'px';
    } else {
        cactus.style.left = '100%';
        updateScore();
    }
}

function gameLoop() {
    if (isGameOver || !isGameStarted) return;
    
    moveCactus();
    
    // Check collision
    if (checkCollision()) {
        isGameOver = true;
        gameOverElement.classList.remove('hidden');
        return;
    }
    
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    isGameOver = false;
    isGameStarted = false;
    score = 0;
    gameSpeed = 5; // Reset to initial speed
    lastSpeedIncrease = Date.now();
    scoreElement.textContent = '0';
    cactus.style.left = '100%';
    gameOverElement.classList.add('hidden');
    startMessage.classList.remove('hidden');
    dino.style.bottom = '0';
    isJumping = false;
}

function startGame() {
    if (!isGameStarted) {
        isGameStarted = true;
        startMessage.classList.add('hidden');
        gameLoop();
    }
}

// Event listeners
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (isGameOver) {
            resetGame();
        } else {
            jump();
        }
    } else if (event.ctrlKey) {
        if (isGameOver) {
            resetGame();
        } else if (!isGameStarted) {
            startGame();
        }
    }
});

// Form submission handling
const surveyForm = document.getElementById('survey-form');

surveyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;
    const mailProvider = document.getElementById('mail-provider').value;
    
    // Prepare email content
    const subject = encodeURIComponent('Ruhekandai Home Feedback from ' + name);
    const body = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Feedback:\n${feedback}`
    );
    
    // Create mailto link based on provider
    let mailtoLink;
    switch(mailProvider) {
        case 'gmail':
            mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=qa@ruhekandai.com&su=${subject}&body=${body}`;
            break;
        case 'outlook':
            mailtoLink = `https://outlook.live.com/mail/0/deeplink/compose?to=qa@ruhekandai.com&subject=${subject}&body=${body}`;
            break;
        case 'yahoo':
            mailtoLink = `https://compose.mail.yahoo.com/?to=qa@ruhekandai.com&subject=${subject}&body=${body}`;
            break;
        default:
            alert('We only support Gmail, Outlook, and Yahoo Mail. Please select one of these providers.');
            return;
    }
    
    // Open mail client
    window.open(mailtoLink, '_blank');
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Thank you for your feedback! 🎉';
    successMessage.style.color = '#27ae60';
    successMessage.style.marginTop = '10px';
    successMessage.style.textAlign = 'center';
    
    // Clear form
    surveyForm.reset();
    
    // Add success message
    surveyForm.appendChild(successMessage);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
});

// Start game
gameLoop(); 