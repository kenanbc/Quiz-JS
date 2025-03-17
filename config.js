export const DIFICULTY = 'easy,medium,hard';
export const CATEGORIES = 'music,history,science,geography,film_and_tv';
export const SCORE_TITLE = 'Score: ';
export const SLIDER_VALUE = 10;

export const victoryQuotes = [
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

export const failureQuotes = [
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

export async function getQuestions(categories, dificulty, numOfQuestions) {
    try {
        const response = await fetch(`https://the-trivia-api.com/v2/questions?limit=${numOfQuestions}&difficulties=${dificulty}&categories=${categories}`);
        if (!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }
        const data = await response.json(); 
        return data; 
    } catch (err) {
        console.error(err);
    }
}