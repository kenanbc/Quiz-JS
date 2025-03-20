import * as config from './config.js';
import { runTimer } from './timer.js';

const startGameContainer = document.querySelector("#start-game-container");
const playGameContainer = document.querySelector("#play-game-container");
const nickname = document.querySelector("#nickname");
const startBtn = document.querySelector("#start-btn");
const exitBtn = document.querySelector("#exit-btn");
const questionText = document.querySelector("#question-text");
const numOfQuestionsSlider = document.querySelector("#num-of-questions-slider");
const numOfQuestionsParagraph = document.querySelector("#num-of-questions");
const questionNumber = document.querySelector("#question-number-header");

const categoriesForm = document.querySelector("#categories-form");
const categoriesBtn = document.querySelector("#categories-btn");

const dificultyBtn = document.querySelector("#difficulty-choose-btn");
const easyDifficultyBtn = document.querySelector("#easy-difficulty-btn");
const mediumDifficultyBtn = document.querySelector("#medium-difficulty-btn");
const hardDifficultyBtn = document.querySelector("#hard-difficulty-btn");
const difficultyParagraph = document.querySelector("#difficulty-paragraph");

const scoreTitle = document.querySelector("#score-title");
const startAgainBtn = document.querySelector("#start-again-btn");
const finishContainer = document.querySelector("#main-finish-container");
const finishScore = document.querySelector("#finish-score");
const finishNickname = document.querySelector("#finish-nickname");
const finishQuote = document.querySelector("#finish-quote");

const timerClock = document.querySelector(".timer");

export const answerBtns = [...document.querySelectorAll(".answer-btn")];

let chosenDifficulty = config.DIFFICULTY;
let chosenCategories = config.CATEGORIES;
const setOfAnswers = [];
let questionCounter = 0;
let scoreCounter = 0;
let data;
let timer = runTimer(timerClock);

//EventListeners
easyDifficultyBtn.addEventListener("click", () => {
    chosenDifficulty = 'easy';
    dificultyBtn.textContent = 'Easy';
    difficultyParagraph.textContent = 'EASY';
})

mediumDifficultyBtn.addEventListener("click", () => {
    chosenDifficulty = 'medium';
    dificultyBtn.textContent = 'Medium';
    difficultyParagraph.textContent = 'MEDIUM';
})

hardDifficultyBtn.addEventListener("click", () => {
    chosenDifficulty = 'hard';
    dificultyBtn.textContent = 'Hard';
    difficultyParagraph.textContent = 'HARD';
})

categoriesForm.addEventListener("change", () => {
    let selectedCategories = [...document.querySelectorAll("#categories-form input[type='checkbox']:checked")];
    chosenCategories = selectedCategories.map((category => category.value));
    if(selectedCategories.length === 0){
        categoriesBtn.textContent = 'Categories: ALL';
        chosenCategories = config.CATEGORIES;
    }
    else
        categoriesBtn.textContent = 'Categories: ' + selectedCategories.length;
})

numOfQuestionsSlider.addEventListener("input", () =>{
    numOfQuestionsParagraph.textContent = numOfQuestionsSlider.value;
})

exitBtn.addEventListener("click", () => {
    startGameContainer.style.display = 'flex';
    playGameContainer.style.display = 'none';
    resetGameParameters();
});

startBtn.addEventListener("click", async () => {
    data = await config.getQuestions(chosenCategories, chosenDifficulty, numOfQuestionsSlider.value);
    if(!data){
        alert("No internet connection!");
        return;
    }
    startGameContainer.style.display = 'none';
    playGameContainer.style.display = 'flex';
    assignBtnEvents();
    getNewQuestion();
});

startAgainBtn.addEventListener("click", () => {
    finishContainer.style.display = 'none';
    startGameContainer.style.display = 'flex';
    resetGameParameters();
});

//Functions
const arrangeAllAnswers = (question) => {
    setOfAnswers.push(question.correctAnswer);
    setOfAnswers.push(...question.incorrectAnswers);
    
    for(let i = setOfAnswers.length - 1; i > 0; i--){
        let rand = Math.floor(Math.random() * (i + 1));
        [setOfAnswers[i], setOfAnswers[rand]] = [setOfAnswers[rand], setOfAnswers[i]];
    }

    answerBtns.forEach((button, i) => {
        button.textContent = setOfAnswers[i];
        button.classList.remove("correct-answer-btn", "wrong-answer-btn");
    });
};

const getNewQuestion = () => {
    if(questionCounter == numOfQuestionsSlider.value){
        finishGame();
        return;
    }
    setOfAnswers.length = 0;
    timer.resetTimer();
    timer.startTimer();
    questionText.textContent = data[questionCounter].question.text;
    questionNumber.textContent = `${questionCounter + 1}/${numOfQuestionsSlider.value}`;
    arrangeAllAnswers(data[questionCounter]);
    questionCounter++;
};

const assignBtnEvents = () => {
    answerBtns.forEach(button => {
        button.addEventListener("click", async () => {
            if (button.disabled) return;
            timer.stopTimer();
            highlightAnswers();

            if (button.textContent === data[questionCounter - 1].correctAnswer) {
                scoreCounter++;
                scoreTitle.textContent = config.SCORE_TITLE + scoreCounter;
            }

            await new Promise(resolve => setTimeout(resolve, 3000));
            getNewQuestion();
        });
    });
};

const resetGameParameters = () => {
    nickname.value = '';
    numOfQuestionsSlider.value = config.SLIDER_VALUE;
    numOfQuestionsParagraph.textContent = config.SLIDER_VALUE;
    chosenDifficulty = config.DIFFICULTY;
    dificultyBtn.textContent = 'Choose Dificulty'
    categoriesBtn.textContent = 'Choose Categories';
    chosenCategories = config.CATEGORIES;
    let selectedCategories = [...document.querySelectorAll("#categories-form input[type='checkbox']:checked")];
    selectedCategories.forEach(checkbox => checkbox.checked = false);
    setOfAnswers.length = 0;
    questionCounter = 0;
    scoreCounter = 0;
    scoreTitle.textContent = config.SCORE_TITLE + scoreCounter;
    answerBtns.forEach((btn) => {
            btn.classList.remove("correct-answer-btn");
            btn.classList.remove("wrong-answer-btn");
            btn.disabled = false;
    });
};

export const TimeFail = async () => {
    highlightAnswers();
    await new Promise(resolve => setTimeout(resolve, 3000));
    getNewQuestion();
}

const finishGame = () => {
    playGameContainer.style.display = 'none';
    finishContainer.style.display = 'flex';
    finishNickname.textContent = nickname.value;
    finishScore.textContent = `${scoreCounter}/${numOfQuestionsSlider.value}`

    if(scoreCounter >= +numOfQuestionsSlider.value / 2)
        finishQuote.textContent = config.VICTORY_QUOTES[Math.floor(Math.random() * config.VICTORY_QUOTES.length)]
    else
        finishQuote.textContent = config.FAILURE_QUOTES[Math.floor(Math.random() * config.FAILURE_QUOTES.length)];
}

const highlightAnswers = () => {
    answerBtns.forEach((btn) => {
        if (btn.textContent === data[questionCounter - 1].correctAnswer)
            btn.classList.add("correct-answer-btn");
        else
            btn.classList.add("wrong-answer-btn");

        btn.disabled = true;
    });
}