import { TimeFail, answerBtns } from "./index.js";

export const runTimer = (timerElement) => {
    const timer = document.querySelector('#timeLeft-number');
    const timerCircle = timerElement.querySelector('svg > circle + circle');
    let timeLeft = 10;
    let countdownTimerID;
    let isRunning = false;

    const resetTimer = () => {
        if (countdownTimerID) {
            clearInterval(countdownTimerID);
            countdownTimerID = null;
        }
        timeLeft = 10;
        timer.textContent = timeLeft;
        isRunning = false;
    }

    const stopTimer = () => {
        if (countdownTimerID) {
            clearInterval(countdownTimerID);
            countdownTimerID = null;
        }
        isRunning = false;
    }

    const startTimer = () => {
        if (isRunning) return;

        isRunning = true;
        countdownTimerID = setInterval(() =>{
            if (timeLeft > -1) {
                let timeRemaining = timeLeft--;
                let normalizedTime = (10 - timeRemaining) / 10; //svg animation
                timerCircle.style.strokeDashoffset = normalizedTime;
                timer.textContent = timeRemaining;
                answerBtns.forEach(button => button.disabled = false)
            } else {
                stopTimer();
                TimeFail();
            }
        }, 1000);
    }

    return { startTimer, resetTimer, stopTimer };
}
