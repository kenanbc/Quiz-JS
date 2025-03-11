export async function getQuestions(categories, dificulty, numOfQuestions) {
    try {
        const response = await fetch(`https://the-trivia-api.com/v2/questions?limit=${numOfQuestions}`);
        if (!response.ok) {
            throw new Error(`HTTP greška! Status: ${response.status}`);
        }
        const data = await response.json(); 
        return data; 
    } catch (err) {
        console.error("Greška pri dohvaćanju pitanja:", err);
    }
}


