'use server';

import { prisma } from "@/lib/prisma";
import { getJudge0LanguageId, submitBatch, pollBatchResults } from "@/lib/judge0";
import { generateWrapper, detectProblemType } from "@/lib/codeWrapper";
import { syncUser } from "@/lib/syncUser";
import { redisHelpers } from "@/lib/redis";
import { revalidatePath } from "next/cache";

export async function executeCode({ code, language, problemId, mode = 'RUN', inputs = [] }) {
    try {
        console.log(`Executing code for problem ${problemId}, mode: ${mode}, language: ${language}`);

        const user = await syncUser();

        // 1. Fetch Problem
        const problem = await prisma.problem.findUnique({
            where: { id: problemId }
        });

        if (!problem) {
            return { error: 'Problem not found' };
        }

        // 2. Determine inputs to run against
        let testCasesToRun = [];

        if (mode === 'RUN') {
            // Use provided inputs or default to first public test case if empty
            if (inputs && inputs.length > 0) {
                // If inputs are just strings, we need to match with expected output if possible, 
                // but for custom run we might not have expected output.
                // However, the UI passes the predefined test cases usually.
                // Let's assume 'inputs' is an array of { input: string, output: string }
                testCasesToRun = inputs;
            } else {
                // Default to first test case
                testCasesToRun = [problem.testCases[0]];
            }
        } else {
            // SUBMIT: Run against all stored test cases
            testCasesToRun = problem.testCases;
        }

        // 3. Prepare Submissions
        const languageId = getJudge0LanguageId(language);
        if (!languageId) {
            return { error: 'Unsupported language' };
        }

        const snippet = problem.codeSnippets[language] || '';
        const problemType = detectProblemType(snippet);
        const wrappedCode = generateWrapper(language, code, problemType);

        // console.log("Wrapped Code:", wrappedCode);

        const submissions = testCasesToRun.map(tc => ({
            source_code: wrappedCode,
            language_id: languageId,
            stdin: tc.input,
            expected_output: tc.output,
            cpu_time_limit: 2, // 2s limit
            memory_limit: 128000 // 128MB
        }));

        // 4. Submit to Judge0
        const batchResponse = await submitBatch(submissions);

        // Error handling if batch creation fails
        if (batchResponse.error) {
            return { error: batchResponse.error };
        }

        const tokens = batchResponse.map(r => r.token);

        // 5. Poll Results
        const results = await pollBatchResults(tokens);

        // 6. Process Results
        // Check for compilation errors
        const compilationError = results.find(r => r.status.id === 6); // 6 is Compilation Error
        if (compilationError) {
            return {
                error: "Compilation Error",
                details: compilationError.compile_output || '',
                rawResults: results
            };
        }

        // Format results for frontend
        const formattedResults = results.map((r, index) => {
            const actual = (r.stdout || "").replace(/\s+/g, "");
            const expected = testCasesToRun[index].output.replace(/\s+/g, "");

            return {
                input: testCasesToRun[index].input,
                expectedOutput: testCasesToRun[index].output,
                actualOutput: r.stdout ? r.stdout.trim() : null,
                error: r.stderr || r.compile_output,
                status: r.status,
                passed: r.status.id === 3 && actual === expected
            };
        });

        // 7. Save Solved Status (DB Update)
        if (mode === 'SUBMIT') {
            const allPassed = formattedResults.every(r => r.passed);
            if (allPassed) {
                try {
                    console.log(`👤 DEBUG: Current User ID (codeExecution): ${user.id}`);
                    // Check if already solved
                    const existing = await prisma.problemSolved.findFirst({
                        where: {
                            userId: user.id,
                            problemId: problemId
                        }
                    });

                    if (!existing) {
                        await prisma.problemSolved.create({
                            data: {
                                userId: user.id,
                                problemId: problemId
                            }
                        });
                        console.log(`✅ SUCCESS: Problem ${problemId} marked as solved for user ${user.id}`);

                        // Invalidate Redis caches to update UI immediately
                        const listingPattern = `problems_listing:*:${user.id}`;
                        const listingKeys = await redisHelpers.keys(listingPattern);

                        console.log(`🔍 Found ${listingKeys.length} matching listing keys to invalidate`);

                        if (listingKeys.length > 0) {
                            await redisHelpers.del(...listingKeys);
                            console.log(`🧹 Invalidated listing caches: ${listingKeys.join(', ')}`);
                        }

                        // Invalidate other relevant caches
                        await redisHelpers.del(`user_profile:${user.id}`);
                        await redisHelpers.del('leaderboard');

                        console.log('✨ Redis cache invalidation complete');

                        // Force Next.js to revalidate paths
                        revalidatePath("/problems");
                        revalidatePath("/profile");
                        revalidatePath(`/problems/${problemId}`);
                        console.log('🚀 Path revalidation triggered');
                    } else {
                        console.log(`ℹ️ Problem ${problemId} was already solved by user ${user.id}`);
                    }
                } catch (dbError) {
                    console.error("Failed to update solved status:", dbError);
                    // Don't fail the execution response just because DB update failed, 
                    // but maybe log it.
                }
            }
        }

        return {
            success: true,
            results: formattedResults
        };


    } catch (error) {
        console.error("Execute Code Error:", error);
        return { error: error.message };
    }
}
