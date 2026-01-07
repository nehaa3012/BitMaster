import { NextResponse } from "next/server";
import { syncUser } from "@/lib/syncUser";
export async function POST(req) {
    try {
        const user = await syncUser();

        if (user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            hints,
            editorial,
            testCases,
            codeSnippets,
            referenceSolutions
        } = body;
    
        // Basic validation
        if(!title || !description || !difficulty || !tags || !examples || !constraints || !hints || !editorial || !testCases || !codeSnippets || !referenceSolutions){
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Test cases validation
        if(!Array.isArray(testCases) || testCases.length === 0){
            return NextResponse.json({ error: "Test cases are required" }, { status: 400 });
        }

        // Reference solutions validation
        if(!referenceSolutions || typeof referenceSolutions !== "object"){
            return NextResponse.json({ error: "Reference solutions are required" }, { status: 400 });
        }

        // Language validation
        for(const [language, solutionCode] of Object.entries(referenceSolutions)){
            const languageId = getJudge0LanguageId(language);
            if(!languageId){
                return NextResponse.json({ error: "Invalid language" }, { status: 400 });
            }
        }
        
        // prepare judge0 submission
        const submissions = testCases.map((input, output) => ({
            source_code: solutionCode,
            language_id: languageId,
            stdin: input,
            expected_output: output
        }))

        // submit all test cases in batch
        const submissionResult = await submitBatch(submissions);
        const tokens = submissionResult.map((result) => result.token);
        const results = await pollBatchResults(tokens)

        for(let i = 0; i < results.length; i++){
            const result = results[i]
            if(result.status.id !== 3){
                return NextResponse.json(
                    {
                        error: `Validation failed for ${language}`,
                        testCase: {
                            input: submissions[i].stdin,
                            expectedOutput: submissions[i].expected_output,
                            actualOutput: result.stdout,
                            error: result.stderr || result.compile_output
                        },
                        details: result
                    },
                    {status: 400}
                )
            }
        }

        // save the problem into db
        const problem = await Problem.create({
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            hints,
            editorial,
            testCases,
            codeSnippets,
            referenceSolutions,
            userId: user.id
        })

        return NextResponse.json({
            success: true,
            message: "Problem created successfully",
            data: problem
        }, {status: 201})
    } catch (error) {
        
        return NextResponse.json({
            error: "Failed to create problem",
            details: error
        }, {status: 500})
    }
}