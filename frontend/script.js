const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");

let timer;
let time = 30;
let score = 0;
let currentQuestion = 0;
let questions = [];

const startBtn = document.querySelector(".start");
const numQuestions = document.querySelector("#num-questions");
const category = document.querySelector("#category");
const difficulty = document.querySelector("#difficulty");
const timePerQuestion = document.querySelector("#time");
const quiz = document.querySelector(".quiz");
const startscreen = document.querySelector(".start-screen");
const submitBtn = document.querySelector(".submit");
const nextBtn = document.querySelector(".next");
const endScreen = document.querySelector(".end-screen");
const finalScore = document.querySelector(".final-score");
const totalScore = document.querySelector(".total-score");

const startQuiz = (event) => {
    event.preventDefault();  // Prevent form submission from reloading page

    console.log("Start Quiz Button Clicked");

    const num = numQuestions.value;
    const cat = category.value;
    const diff = difficulty.value;

    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

    console.log("Fetching quiz data with URL:", url);

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log("Quiz data fetched:", data);
            questions = data.results;

            // Check if questions were fetched correctly
            if (!questions.length) {
                console.error("No questions returned.");
                return;
            }

            // Hide start screen and show quiz screen
            startscreen.classList.add("hide");
            quiz.classList.remove("hide");

            // Initialize first question
            currentQuestion = 0;
            showQuestion(questions[0]);
        })
        .catch((error) => {
            console.error("Error fetching quiz data:", error);
        });
};

startBtn.addEventListener("click", startQuiz);

const showQuestion = (question) => {
    const questionText = document.querySelector(".question");
    const answersWrapper = document.querySelector(".answer-wrapper");
    const questionNumber = document.querySelector(".number");

    if (!questionText || !answersWrapper || !questionNumber) {
        console.error("Required elements not found.");
        return;
    }

    questionText.innerHTML = question.question;

    const answers = [
        ...question.incorrect_answers,
        question.correct_answer.toString(),
    ];

    answers.sort(() => Math.random() - 0.5);
    answersWrapper.innerHTML = "";
    answers.forEach((answer) => {
        answersWrapper.innerHTML += `
        <div class="answer">
            <span class="text">${answer}</span>
            <span class="checkbox">
                <span class="icon"><i class="fa-solid fa-check"></i></span>
            </span>
        </div>
        `;
    });

    questionNumber.innerHTML = `Question <span class="current">${questions.indexOf(question) + 1}</span> <span class="total">/ ${questions.length}</span>`;

    const answerDiv = document.querySelectorAll(".answer");
    answerDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
            if (!answer.classList.contains("checked")) {
                answerDiv.forEach((answer) => {
                    answer.classList.remove("selected");
                });

                answer.classList.add("selected");
                submitBtn.disabled = false;
            }
        });
    });

    // Get the time per question value and log it
    console.log("Time per question:", timePerQuestion.value);
    time = timePerQuestion.value;
    startTimer(time);
};

const startTimer = (time) => {
    clearInterval(timer);
    progress(time);
    timer = setInterval(() => {
        if (time >= 0) {
            progress(time);
            time--;
        } else {
            checkAnswer(); // Call checkAnswer after a slight delay
        }
    }, 1000);
};

const progress = (value) => {
    const percentage = (value / time) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerHTML = `${value}s`;
};

submitBtn.addEventListener("click", () => {
    checkAnswer();
});

const checkAnswer = () => {
    clearInterval(timer);
    const selectedAnswer = document.querySelector(".answer.selected");

    if (selectedAnswer) {
        const answer = selectedAnswer.querySelector(".text").innerHTML;
        const correctAnswer = questions[currentQuestion].correct_answer;

        if (answer === correctAnswer) {
            score++;
            console.log("Correct answer! Score:", score);
            selectedAnswer.classList.add("correct");
        } else {
            selectedAnswer.classList.add("wrong");
            document.querySelectorAll(".answer").forEach((answer) => {
                if (answer.querySelector(".text").innerHTML === correctAnswer) {
                    answer.classList.add("correct");
                }
            });
        }
    }

    document.querySelectorAll(".answer").forEach((answer) => {
        answer.classList.add("checked");
    });

    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
};

nextBtn.addEventListener("click", () => {
    nextQuestion();
    nextBtn.style.display = "none";
    submitBtn.style.display = "block";
});

const submitQuizData = () => {
    const quizData = {
        numQuestions: numQuestions.value,
        category: category.value,
        difficulty: difficulty.value,
        time: timePerQuestion.value,
        score: score,  // Include score to save the result
    };

    fetch('/api/quiz-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save quiz data: ' + response.statusText);
        }
        return response.json();  // Parse the JSON response
    })
    .then(data => {
        console.log("Quiz data saved:", data);  // Success response from server
    })
    .catch(error => {
        console.error("Error saving quiz data:", error);  // Detailed error logging
        alert('Failed to save quiz data. Please try again.');
    });
};

const showScore = () => {
    const endScreen = document.querySelector(".end-screen");
    const finalScore = document.querySelector(".final-score");
    const totalScore = document.querySelector(".total-score");

    if (!endScreen || !finalScore || !totalScore) {
        console.error("Required elements for score display not found.");
        return;
    }

    console.log("Final score value:", score);
    console.log("Total questions:", questions.length);

    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/ ${questions.length}`;
    submitQuizData();  // Save quiz data on score submission
};

const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(questions[currentQuestion]);
    } else {
        console.log("Quiz ended. Showing score...");
        showScore();
    }
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});
