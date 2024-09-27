// Navegação suave ao clicar nos links do menu
const navLinks = document.querySelectorAll('nav ul li a');

navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const sectionID = this.getAttribute('href');
        document.querySelector(sectionID).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Jogo 2D com Canvas API
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variáveis do jogo
let player = {
    x: 50,
    y: 350,
    width: 50,
    height: 50,
    speed: 5,
    dy: 0,
    gravity: 0.5,
    jumpStrength: -10
};

let obstacles = [];
let gameOver = false;
let score = 0;

// Controle de tempo para gerar obstáculos
let obstacleTimer = 0;
let obstacleInterval = 90;

// Controle de teclas
let keys = {};

// Eventos de teclado
document.addEventListener('keydown', function(e) {
    keys[e.code] = true;
});

document.addEventListener('keyup', function(e) {
    keys[e.code] = false;
});

// Função principal do jogo
function gameLoop() {
    if (gameOver) {
        displayGameOver();
        return;
    }

    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Atualizar posição do jogador e obstáculos
function update() {
    // Movimento do jogador
    if (keys['Space'] || keys['ArrowUp']) {
        if (player.y + player.height >= canvas.height) {
            player.dy = player.jumpStrength;
        }
    }

    player.dy += player.gravity;
    player.y += player.dy;

    // Evitar que o jogador caia do canvas
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
    }

    // Gerar obstáculos
    obstacleTimer++;
    if (obstacleTimer >= obstacleInterval) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 50,
            width: 50,
            height: 50,
            speed: 6
        });
        obstacleTimer = 0;
    }

    // Atualizar posição dos obstáculos
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacle.speed;

        // Remover obstáculos que saíram do canvas
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
        }

        // Verificar colisão com o jogador
        if (isColliding(player, obstacle)) {
            gameOver = true;
        }
    });
}

// Desenhar elementos no canvas
function draw() {
    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar jogador
    ctx.fillStyle = '#43a047'; // Verde
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Desenhar obstáculos (fungos)
    ctx.fillStyle = '#d32f2f'; // Vermelho
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Mostrar pontuação
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Pontuação: ${score}`, 10, 30);
}

// Função para verificar colisão
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Exibir mensagem de fim de jogo
function displayGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Fim de Jogo!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText(`Pontuação Final: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Pressione F5 para reiniciar', canvas.width / 2, canvas.height / 2 + 60);
}

// Iniciar o jogo
gameLoop();

// ----- Quiz de Prevenção da Candidíase ----- //

// Perguntas do quiz
const quizQuestions = [
    {
        question: "Qual é a principal causa da candidíase?",
        options: ["Bactérias", "Fungos", "Vírus", "Parasitas"],
        correct: "Fungos"
    },
    {
        question: "Qual das seguintes medidas ajuda a prevenir a candidíase?",
        options: ["Usar roupas apertadas", "Tomar duchas vaginais", "Usar roupas de algodão", "Evitar beber água"],
        correct: "Usar roupas de algodão"
    },
    {
        question: "O que pode aumentar o risco de desenvolver candidíase?",
        options: ["Uso de antibióticos", "Beber água", "Dormir cedo", "Evitar açúcar"],
        correct: "Uso de antibióticos"
    }
];

let currentQuestion = 0;
let quizScore = 0;

// Elementos do quiz
const quizQuestionElement = document.getElementById('quiz-question');
const quizOptionsElement = document.getElementById('quiz-options');
const quizResultElement = document.getElementById('quiz-result');
const nextQuestionButton = document.getElementById('next-question');

// Mostrar a pergunta
function showQuestion() {
    const current = quizQuestions[currentQuestion];
    quizQuestionElement.textContent = current.question;
    quizOptionsElement.innerHTML = '';

    current.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option));
        quizOptionsElement.appendChild(button);
    });

    quizResultElement.textContent = '';
}

// Verificar resposta
function checkAnswer(selected) {
    const correct = quizQuestions[currentQuestion].correct;
    if (selected === correct) {
        quizScore++;
        quizResultElement.textContent = "Correto!";
    } else {
        quizResultElement.textContent = `Errado! A resposta correta é: ${correct}`;
    }

    nextQuestionButton.style.display = 'block';
}

// Mostrar a próxima pergunta ou finalizar o quiz
nextQuestionButton.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
        showQuestion();
        nextQuestionButton.style.display = 'none';
    } else {
        quizResultElement.textContent = `Fim do quiz! Você acertou ${quizScore} de ${quizQuestions.length} perguntas.`;
        nextQuestionButton.style.display = 'none';
        quizQuestionElement.style.display = 'none';
        quizOptionsElement.style.display = 'none';
    }
});

// Iniciar o quiz
showQuestion();
nextQuestionButton.style.display = 'none';


