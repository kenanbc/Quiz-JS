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

const DEFAULTDIFICULTY = 'easy,medium,hard';
const DEFAULTCATEGORIES = 'music,history,science,geography,film_and_tv';

let choosenDificulty = DEFAULTDIFICULTY;
let choosenCategories = DEFAULTCATEGORIES;

easyDificultyBtn.addEventListener("click", () => {
    choosenDificulty = 'easy';
    dificultyBtn.textContent = 'Easy';
})

mediumDificultyBtn.addEventListener("click", () => {
    choosenDificulty = 'medium';
    dificultyBtn.textContent = 'Medium';
})

hardDificultyBtn.addEventListener("click", () => {
    choosenDificulty = 'hard';
    dificultyBtn.textContent = 'Hard';
})

categoriesForm.addEventListener("change", () => {
    let selectedCategories = [...document.querySelectorAll("#categories-form input[type='checkbox']:checked")];
    choosenCategories = selectedCategories.map((category => category.value));
    if(selectedCategories.length === 0){
        categoriesBtn.textContent = 'Categories: ALL';
        choosenCategories = DEFAULTCATEGORIES;
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
    
    resetTimerFunc = runTimer(document.querySelector('.timer'));
    questionNumber.textContent = `1/${numOfQuestionsSlider.value}`

    const data = await getQuestions(choosenCategories, choosenDificulty, numOfQuestionsSlider.value);
    console.log(data);
    questionText.textContent = data[0].question.text;
});

back.addEventListener("click", () => {
    startGameDiv.style.display = 'flex';
    playGameDiv.style.display = 'none';
    nickname.value = '';
    numOfQuestionsSlider.value = 10;
    numOfQuestions.textContent = 10;
    choosenDificulty = DEFAULTDIFICULTY;
    dificultyBtn.textContent = 'Choose Dificulty'
    categoriesBtn.textContent = 'Choose Categories';
    choosenCategories = DEFAULTCATEGORIES;
    let selectedCategories = [...document.querySelectorAll("#categories-form input[type='checkbox']:checked")];
    selectedCategories.forEach(checkbox => checkbox.checked = false);

    if (resetTimerFunc) {
        resetTimerFunc();
    }
});



