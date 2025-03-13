import { getQuestions } from './api.js';
import { runTimer } from './timer.js';

const nickname = document.querySelector("#nickname");
const startBtn = document.querySelector("#start-btn");
const startGameDiv = document.querySelector("#start-game-div");
const playGameDiv = document.querySelector("#play-game-div");
const exitBtn = document.querySelector("#exit-btn");
const questionText = document.querySelector("#question-text");
const numOfQuestionsSlider = document.querySelector("#num-of-questions-slider");
const numOfQuestions = document.querySelector("#num-of-questions");
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

const answerBtns = [...document.querySelectorAll(".answer-btn")];

const DIFICULTY = 'easy,medium,hard';
const CATEGORIES = 'music,history,science,geography,film_and_tv';
const SCORE_TITLE = 'Score: ';
const SLIDER_VALUE = 10;

let choosenDificulty = DIFICULTY;
let choosenCategories = CATEGORIES;

let data;
const setOfAnswers = [];
let questionCounter = 0;
let scoreCounter = 0;

const victoryQuotes = [
    "Knowledge is power – and I just proved it!",
    "I came, I saw, I conquered… the quiz!",
    "Brains over luck, every time!",
    "Winning isn't everything, but it sure feels great!",
    "Another victory for the curious mind!",
    "Smart moves lead to sweet victories!",
    "One step closer to becoming a trivia master!",
    "I didn’t just guess – I knew it!",
    "Wisdom always wins!",
    "Quiz conquered. Next challenge?"
];

const failureQuotes = [
    "Failure is just a step toward success!",
    "I didn’t lose; I learned.",
    "Mistakes are proof that I’m trying.",
    "Even the best fail sometimes!",
    "Next time, I'll do better!",
    "Knowledge grows with every wrong answer.",
    "Defeat today, victory tomorrow!",
    "I may have lost, but I’m not giving up!",
    "A wrong answer is just a lesson in disguise.",
    "It’s not about how many times you fail, but how many times you rise!"
];

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

exitBtn.addEventListener("click", () => {
    startGameDiv.style.display = 'flex';
    playGameDiv.style.display = 'none';

    resetGameParameters();
    
});

startBtn.addEventListener("click", async () => {
    startGameDiv.style.display = 'none';
    playGameDiv.style.display = 'flex';
    
    data = await getQuestions(choosenCategories, choosenDificulty, numOfQuestionsSlider.value);
    btnEvents();
    newQuestionLogic();
});

const arrangeAllAnswers = (question) => {
    setOfAnswers.push(question.correctAnswer);
    setOfAnswers.push(...question.incorrectAnswers);
    
    for(let i = setOfAnswers.length - 1; i > 0; i--){
        let rand = parseInt(Math.random() * (i + 1));
        [setOfAnswers[i], setOfAnswers[rand]] = [setOfAnswers[rand], setOfAnswers[i]];
    }

    answerBtns.forEach((button, i) => {
        button.textContent = setOfAnswers[i];
        button.classList.remove("correct-answer-btn", "wrong-answer-btn");
        button.disabled = false;
        
    });
        
    answerBtns.forEach((button, i) => {
        button.textContent = setOfAnswers[i]; 
    })
};

const newQuestionLogic = () => {
    if(questionCounter == numOfQuestionsSlider.value){
        playGameDiv.style.display = 'none';
        finishContainer.style.display = 'flex';
        finishNickname.textContent = nickname.value;
        finishScore.textContent = `${scoreCounter}/${numOfQuestionsSlider.value}`
        if(scoreCounter >= +numOfQuestionsSlider.value / 2){
            finishQuote.textContent = victoryQuotes[parseInt(Math.random() * victoryQuotes.length)]
        }
        else{
            finishQuote.textContent = failureQuotes[parseInt(Math.random() * failureQuotes.length)];
        }
        return;
    }
    setOfAnswers.length = 0;
    resetTimerFunc = runTimer(document.querySelector('.timer'));
    questionText.textContent = data[questionCounter].question.text;
    questionNumber.textContent = `${questionCounter + 1}/${numOfQuestionsSlider.value}`;
    arrangeAllAnswers(data[questionCounter]);
    questionCounter++;
};

const btnEvents = () => {
    answerBtns.forEach(button => {
        button.addEventListener("click", async () => {
            if (button.disabled) return;
            resetTimerFunc.stopTimer();
            answerBtns.forEach((btn) => {
                if (btn.textContent === data[questionCounter - 1].correctAnswer)
                    btn.classList.add("correct-answer-btn");
                else
                    btn.classList.add("wrong-answer-btn");

                btn.disabled = true;
            });

            if (button.textContent === data[questionCounter - 1].correctAnswer) {
                scoreCounter++;
                scoreTitle.textContent = SCORE_TITLE + scoreCounter;
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
            newQuestionLogic();
        });
    });
};

startAgainBtn.addEventListener("click", () => {
    finishContainer.style.display = 'none';
    startGameDiv.style.display = 'flex';
    resetGameParameters();
});

const resetGameParameters = () => {
    nickname.value = '';
    numOfQuestionsSlider.value = SLIDER_VALUE;
    numOfQuestions.textContent = SLIDER_VALUE;
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
        resetTimerFunc.resetTimer();
    }
}
