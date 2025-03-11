export function runTimer(timerElement) {
    let timeLeft = 10;
    let timer = document.getElementById('timeLeft');
    const timerCircle = timerElement.querySelector('svg > circle + circle');
    let countdownTimer;
    let isRunning = false;

    function resetTimer() {
        if (countdownTimer) {
            clearInterval(countdownTimer);
            countdownTimer = null;
        }
        timeLeft = 10;
        timer.innerHTML = timeLeft;
        timerCircle.style.strokeDashoffset = 1;
        timerElement.classList.remove('animatable');
        timerElement.classList.add('animatable');
        isRunning = false;
    }

    function startTimer() {
        if (isRunning) return;

        isRunning = true;
        countdownTimer = setInterval(function() {
            if (timeLeft > -1) {
                const timeRemaining = timeLeft--;
                const normalizedTime = (10 - timeRemaining) / 10;
                timerCircle.style.strokeDashoffset = normalizedTime;
                timer.innerHTML = timeRemaining;
            } else {
                clearInterval(countdownTimer);
                timerElement.classList.remove('animatable');
                isRunning = false;
            }
        }, 1000);
    }

    startTimer();

    return resetTimer;
}
