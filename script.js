const menuButton = document.querySelector('#menu-button');
const mainMenu = document.querySelector('#menu-principal');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  mainMenu.classList.toggle('is-open', !isOpen);
});

mainMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    mainMenu.classList.remove('is-open');
  });
});

const questions = [
  {
    question: 'Uma pessoa usa a foto de um familiar e pede um Pix de última hora. O que você faz?',
    answers: ['Envio, porque reconheço a foto.', 'Ligo para o número que já conheço e confirmo.', 'Peço uma foto do documento pelo chat.'],
    correct: 1,
    explanation: 'Foto e nome de perfil podem ser copiados. Confirmar por um contato que você já conhece é mais seguro.'
  },
  {
    question: 'Você recebe um link dizendo que sua conta será bloqueada em 10 minutos. Qual é o melhor caminho?',
    answers: ['Abro o app oficial sem usar o link da mensagem.', 'Clico logo para evitar o bloqueio.', 'Respondo à mensagem com meus dados.'],
    correct: 0,
    explanation: 'Ameaças e prazos curtos são sinais de alerta. Se precisar conferir, use o aplicativo ou site oficial.'
  },
  {
    question: 'Um atendente por telefone pede o código de verificação que chegou por SMS. O que você faz?',
    answers: ['Informo, já que ele sabe meu nome.', 'Envio apenas os últimos dígitos.', 'Não informo e encerro a ligação.'],
    correct: 2,
    explanation: 'Códigos de verificação são pessoais. Não compartilhe esses códigos por telefone, mensagem ou e-mail.'
  },
  {
    question: 'Um desconhecido diz que fez um Pix por engano e pede uma nova transferência. O que fazer?',
    answers: ['Confiro o extrato e, se entrou dinheiro, uso a função Devolver na transação.', 'Faço um Pix para a chave enviada no chat.', 'Devolvo antes de conferir, para evitar problemas.'],
    correct: 0,
    explanation: 'O Banco Central recomenda usar a função Devolver da transação original. Não faça um novo Pix para uma chave indicada por terceiros.'
  },
  {
    question: 'Uma loja desconhecida anuncia um celular muito mais barato e exige Pix imediato. Qual é a atitude mais segura?',
    answers: ['Pago antes que a promoção termine.', 'Pesquiso a reputação da loja e verifico o vendedor.', 'Confio se o site tiver cadeado no navegador.'],
    correct: 1,
    explanation: 'Preço muito abaixo do normal e pressão para pagar são alertas. Até sites fraudulentos podem usar HTTPS.'
  },
  {
    question: 'Você percebe que informou sua senha em uma página falsa. O que faz primeiro?',
    answers: ['Espero para ver se acontece alguma coisa.', 'Publico minha senha para avisar as pessoas.', 'Troco a senha pelo canal oficial e verifico a segurança da conta.'],
    correct: 2,
    explanation: 'Aja rapidamente: troque a senha pelo canal oficial, confira sessões ativas e habilite a autenticação em duas etapas.'
  }
];

const quizIntro = document.querySelector('#quiz-intro');
const quizGame = document.querySelector('#quiz-game');
const quizResult = document.querySelector('#quiz-result');
const startButton = document.querySelector('#start-quiz');
const nextButton = document.querySelector('#next-question');
const restartButton = document.querySelector('#restart-quiz');
const questionTitle = document.querySelector('#question-title');
const answersElement = document.querySelector('#quiz-answers');
const feedbackElement = document.querySelector('#quiz-feedback');
const progressText = document.querySelector('#quiz-progress-text');
const progressBar = document.querySelector('#quiz-progress-bar');
const scoreText = document.querySelector('#quiz-score');

let currentQuestion = 0;
let score = 0;
let answered = false;

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  quizIntro.hidden = true;
  quizResult.hidden = true;
  quizGame.hidden = false;
  renderQuestion();
}

function renderQuestion() {
  answered = false;
  const question = questions[currentQuestion];
  questionTitle.textContent = question.question;
  progressText.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
  scoreText.textContent = `${score} ${score === 1 ? 'acerto' : 'acertos'}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  answersElement.replaceChildren();
  feedbackElement.hidden = true;
  feedbackElement.replaceChildren();
  nextButton.hidden = true;

  question.answers.forEach((answer, index) => {
    const answerButton = document.createElement('button');
    answerButton.type = 'button';
    answerButton.className = 'answer-button';
    answerButton.textContent = answer;
    answerButton.addEventListener('click', () => selectAnswer(index));
    answersElement.append(answerButton);
  });
  questionTitle.focus({ preventScroll: true });
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const question = questions[currentQuestion];
  const isCorrect = selectedIndex === question.correct;
  if (isCorrect) score += 1;
  scoreText.textContent = `${score} ${score === 1 ? 'acerto' : 'acertos'}`;

  Array.from(answersElement.children).forEach((button, index) => {
    button.disabled = true;
    if (index === question.correct) button.classList.add('answer-correct');
    else if (index === selectedIndex) button.classList.add('answer-incorrect');
  });

  const heading = document.createElement('strong');
  heading.textContent = isCorrect ? 'Boa! Você acertou.' : 'Vale lembrar:';
  const explanation = document.createElement('p');
  explanation.textContent = question.explanation;
  feedbackElement.className = `quiz-feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
  feedbackElement.replaceChildren(heading, explanation);
  feedbackElement.hidden = false;
  nextButton.textContent = currentQuestion === questions.length - 1 ? 'Ver meu resultado →' : 'Próxima pergunta →';
  nextButton.hidden = false;
  nextButton.focus({ preventScroll: true });
}

function nextQuestion() {
  if (!answered) return;
  currentQuestion += 1;
  if (currentQuestion < questions.length) {
    renderQuestion();
    return;
  }

  quizGame.hidden = true;
  quizResult.hidden = false;
  const resultTitle = document.querySelector('#result-title');
  const resultSummary = document.querySelector('#result-summary');
  resultTitle.textContent = `${score} de ${questions.length} respostas certas`;
  resultSummary.textContent = score === questions.length
    ? 'Mandou bem! Continue conferindo informações antes de clicar, compartilhar dados ou fazer pagamentos.'
    : score >= 4
      ? 'Você já reconhece vários sinais de alerta. Reveja as explicações e continue praticando.'
      : 'Tudo bem não acertar tudo. O importante é aprender a identificar os sinais antes de agir.';
  resultTitle.setAttribute('tabindex', '-1');
  resultTitle.focus({ preventScroll: true });
}

startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', startQuiz);
