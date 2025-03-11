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

let resetTimerFunc;

numOfQuestionsSlider.addEventListener("input", () =>{
    numOfQuestions.textContent = numOfQuestionsSlider.value;
})

startBtn.addEventListener("click", async () => {
    startGameDiv.style.display = 'none';
    playGameDiv.style.display = 'flex';
    
    resetTimerFunc = runTimer(document.querySelector('.timer'));
    questionNumber.textContent = `1/${numOfQuestionsSlider.value}`
    const data = await getQuestions('_', '_', numOfQuestionsSlider.value);
    console.log(data);
    questionText.textContent = data[0].question.text;
});

back.addEventListener("click", () => {
    startGameDiv.style.display = 'flex';
    playGameDiv.style.display = 'none';
    
    if (resetTimerFunc) {
        resetTimerFunc();
    }
});
