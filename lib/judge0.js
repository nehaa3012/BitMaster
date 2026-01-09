import axios from "axios";
export function getJudge0LanguageId(language) {
    const languageMap = {
        PYTHON: 71,
        JAVASCRIPT: 63,
        JAVA: 62,
        "C++": 54,
    };
    return languageMap[language.toUpperCase()]
}

export async function submitBatch(submissions) {
    console.log("submissions", submissions)
    try {
        const { data } = await axios.post(
            `https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=false`,
            { submissions },
            {
                headers: {
                    'x-rapidapi-key': process.env.RAPID_API_KEY,
                    'x-rapidapi-host': process.env.RAPID_API_HOST,
                    'Content-Type': 'application/json'
                }
            }
        )
        console.log("data", data)
        return data;
    } catch (error) {
        if (error.response) {
            console.error("Judge0 Error Response:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Judge0 Error:", error.message);
        }
        throw error;
    }
}

export async function pollBatchResults(tokens) {
    while (true) {
        const { data } = await axios.get(
            `https://judge0-ce.p.rapidapi.com/submissions/batch`,
            {
                params: {
                    tokens: tokens.join(","),
                    base64_encoded: false
                },
                headers: {
                    'x-rapidapi-key': process.env.RAPID_API_KEY,
                    'x-rapidapi-host': process.env.RAPID_API_HOST
                }
            }
        )
        console.log(data)
        const results = data.submissions;
        const isAllDone = results.every(
            (r) => r.status.id !== 1 && r.status.id !== 2
        );
        if (isAllDone) {
            return results;
        }
        await sleep(1000);
    }
}
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


