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


