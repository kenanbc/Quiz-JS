import { getQuestions } from './api.js';
import { runTimer } from './timer.js';

const nickname = document.querySelector("#nickname");
const startBtn = document.querySelector("#start-btn");
const startGameDiv = document.querySelector("#start-game-div");
const playGameDiv = document.querySelector("#play-game-div");
const back = document.querySelector("#exit-btn");
const questionText = document.querySelector("#question-text");
const numOfQuestionsSlider = document.querySelector("#num-of-questions-slider");
const numOfQuestions = document.querySelector("#num-of-questions");
const questionNumber = document.querySelector("#question-number");

const categoriesForm = document.querySelector("#categories-form");
const categoriesBtn = document.querySelector("#categories-btn");

const dificultyBtn = document.querySelector("#dificulty-choose-btn");
const easyDificultyBtn = document.querySelector("#easy-dificulty-btn");
const mediumDificultyBtn = document.querySelector("#medium-dificulty-btn");
const hardDificultyBtn = document.querySelector("#hard-dificulty-btn");
const dificultyParagraph = document.querySelector("#dificulty-paragraph");

const scoreTitle = document.querySelector("#score-title");

const answerBtns = [...document.querySelectorAll(".answer-btn")];

const DIFICULTY = 'easy,medium,hard';
const CATEGORIES = 'music,history,science,geography,film_and_tv';
const SCORE_TITLE = 'Score: ';

let choosenDificulty = DIFICULTY;
let choosenCategories = CATEGORIES;


/******************************************************************************** */
let data;
const setOfAnswers = [];
let questionCounter = 0;
let scoreCounter = 0;
/******************************************************************************* */

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
        choosenCategories = CATEGORIES;
    }
    else
        categoriesBtn.textContent = 'Categories: ' + selectedCategories.length;
})

let resetTimerFunc;

numOfQuestionsSlider.addEventListener("input", () =>{
    numOfQuestions.textContent = numOfQuestionsSlider.value;
})

startBtn.addEventListener("click", async () => {
    startGameDiv.style.display = 'none';
    playGameDiv.style.display = 'flex';
    
    data = await getQuestions(choosenCategories, choosenDificulty, numOfQuestionsSlider.value);

    newQuestionLogic();
    console.log(answerBtns);
    
    questionText.textContent = data[0].question.text;
});

back.addEventListener("click", () => {
    startGameDiv.style.display = 'flex';
    playGameDiv.style.display = 'none';
    nickname.value = '';
    numOfQuestionsSlider.value = 10;
    numOfQuestions.textContent = 10;
    choosenDificulty = DIFICULTY;
    dificultyBtn.textContent = 'Choose Dificulty'
    categoriesBtn.textContent = 'Choose Categories';
    choosenCategories = CATEGORIES;
    let selectedCategories = [...document.querySelectorAll("#categories-form input[type='checkbox']:checked")];
    selectedCategories.forEach(checkbox => checkbox.checked = false);
    setOfAnswers.length = 0;
    questionCounter = 0;
    scoreCounter = 0;
    scoreTitle.textContent = SCORE_TITLE + scoreCounter;
    answerBtns.forEach((btn) => {
            btn.classList.remove("correct-answer-btn");
            btn.classList.remove("wrong-answer-btn");
            btn.disabled = false;
    });

    if (resetTimerFunc) {
        resetTimerFunc();
    }
});


const arrangeAllAnswers = (data) => {
    setOfAnswers.push(data.correctAnswer);
    setOfAnswers.push(...data.incorrectAnswers);
    
    for(let i = setOfAnswers.length - 1; i > 0; i--){
        let rand = parseInt(Math.random() * (i + 1));
        [setOfAnswers[i], setOfAnswers[rand]] = [setOfAnswers[rand], setOfAnswers[i]];
    }
        
    answerBtns.forEach((button, i) => {
        button.textContent = setOfAnswers[i];
        button.addEventListener("click", () => {
            answerBtns.forEach((btn) => {
                if (btn.textContent === data.correctAnswer) {
                    btn.classList.add("correct-answer-btn");
                } else {
                    btn.classList.add("wrong-answer-btn");
                }
                btn.disabled = true;
            });
            
            if (button.textContent === data.correctAnswer) {
                scoreCounter++;
                scoreTitle.textContent = SCORE_TITLE + scoreCounter;
            }
        });
    })
};

const newQuestionLogic = () => {
    questionCounter++;
    resetTimerFunc = runTimer(document.querySelector('.timer'));
    questionNumber.textContent = `${questionCounter}/${numOfQuestionsSlider.value}`;
    arrangeAllAnswers(data[questionCounter - 1]);
};
