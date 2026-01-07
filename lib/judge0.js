
export function getJudge0LanguageId(language) {
      const languageMap = {
        "PYTHON": 71,
        "JAVASCRIPT": 63,
        "C": 50,
        "CPP": 54,
        "RUST": 61,
        "GO": 64,
        "RUBY": 65,
        "TYPESCRIPT": 72,
        "JAVA": 82,
        "RUST": 87,
      }
      return languageMap[language.toUpperCase()]
}

export async function submitBatch(submission) {
    const {data} = await axios.post(
        `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
        {submission}
    )
    return data;
}

export async function pollBatchResults(tokens) {
    while(true){
        const {data} = await axios.get(
        `${process.env.JUDGE0_API_URL}/submissions/batch`,
        {
            params: {
                tokens: tokens.join(","),
                base64_encoded: false
            },
        }
    )
    console.log(data)
    const results = data.submissions;
    const isAllDone = results.every(
        (r) => r.status.id !== 1 && r.status.id !== 2
    );
    if(isAllDone){
        return results;
    }
    await sleep(1000);
}
}
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
