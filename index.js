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

const dificultyBtn = document.querySelector("#dificulty-choose-btn");
const easyDificultyBtn = document.querySelector("#easy-dificulty-btn");
const mediumDificultyBtn = document.querySelector("#medium-dificulty-btn");
const hardDificultyBtn = document.querySelector("#hard-dificulty-btn");
const dificultyParagraph = document.querySelector("#dificulty-paragraph");

const scoreTitle = document.querySelector("#score-title");
const startAgainBtn = document.querySelector("#start-again-btn");
const finishContainer = document.querySelector("#main-finish-container");
const finishScore = document.querySelector("#finish-score");
const finishNickname = document.querySelector("#finish-nickname");
const finishQuote = document.querySelector("#finish-quote");

const timerClock = document.querySelector(".timer");

export const answerBtns = [...document.querySelectorAll(".answer-btn")];

let choosenDificulty = config.DIFICULTY;
let choosenCategories = config.CATEGORIES;
const setOfAnswers = [];
let questionCounter = 0;
let scoreCounter = 0;
let data;
let Timer;

//EventListeners
easyDificultyBtn.addEventListener("click", () => {
    choosenDificulty = 'easy';
    dificultyBtn.textContent = 'Easy';
    dificultyParagraph.textContent = 'EASY';
})

mediumDificultyBtn.addEventListener("click", () => {
    choosenDificulty = 'medium';
    dificultyBtn.textContent = 'Medium';
    dificultyParagraph.textContent = 'MEDIUM';
})

hardDificultyBtn.addEventListener("click", () => {
    choosenDificulty = 'hard';
    dificultyBtn.textContent = 'Hard';
    dificultyParagraph.textContent = 'HARD';
})

categoriesForm.addEventListener("change", () => {
    let selectedCategories = [...document.querySelectorAll("#categories-form input[type='checkbox']:checked")];
    choosenCategories = selectedCategories.map((category => category.value));
    if(selectedCategories.length === 0){
        categoriesBtn.textContent = 'Categories: ALL';
        choosenCategories = config.CATEGORIES;
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
    data = await config.getQuestions(choosenCategories, choosenDificulty, numOfQuestionsSlider.value);
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
        
    answerBtns.forEach((button, i) => {
        button.textContent = setOfAnswers[i];   
    })
};

const getNewQuestion = () => {
    if(questionCounter == numOfQuestionsSlider.value){
        playGameContainer.style.display = 'none';
        finishContainer.style.display = 'flex';
        finishNickname.textContent = nickname.value;
        finishScore.textContent = `${scoreCounter}/${numOfQuestionsSlider.value}`
        if(scoreCounter >= +numOfQuestionsSlider.value / 2){
            finishQuote.textContent = config.victoryQuotes[Math.floor(Math.random() * config.victoryQuotes.length)]
        }
        else{
            finishQuote.textContent = config.failureQuotes[Math.floor(Math.random() * config.failureQuotes.length)];
        }
        return;
    }
    timerClock.classList.add("show");
    setOfAnswers.length = 0;
    Timer = runTimer(document.querySelector('.timer'));
    questionText.textContent = data[questionCounter].question.text;
    questionNumber.textContent = `${questionCounter + 1}/${numOfQuestionsSlider.value}`;
    arrangeAllAnswers(data[questionCounter]);
    questionCounter++;
};

const assignBtnEvents = () => {
    answerBtns.forEach(button => {
        button.addEventListener("click", async () => {
            if (button.disabled) return;
            Timer.stopTimer();
            answerBtns.forEach((btn) => {
                if (btn.textContent === data[questionCounter - 1].correctAnswer)
                    btn.classList.add("correct-answer-btn");
                else
                    btn.classList.add("wrong-answer-btn");

                btn.disabled = true;
            });

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
    choosenDificulty = config.DIFICULTY;
    dificultyBtn.textContent = 'Choose Dificulty'
    categoriesBtn.textContent = 'Choose Categories';
    choosenCategories = config.CATEGORIES;
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

    if (Timer){
        Timer.resetTimer();
    }
};

export const TimeFail = async () => {
    answerBtns.forEach((btn) => {
        if (btn.textContent === data[questionCounter - 1].correctAnswer)
            btn.classList.add("correct-answer-btn");
        else
            btn.classList.add("wrong-answer-btn");
        btn.disabled = true;
    });
    await new Promise(resolve => setTimeout(resolve, 3000));
    getNewQuestion();
}