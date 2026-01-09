
import { NextResponse } from "next/server";
import { generateProblem } from "@/lib/gemini";
import { syncUser } from "@/lib/syncUser";

export async function POST(req) {
    try {
        const user = await syncUser();
        // Optionally check if admin
        if (user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        const problemData = await generateProblem(topic);

        return NextResponse.json(problemData);
    } catch (error) {
        console.error("Generate API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate problem" },
            { status: 500 }
        );
    }
}
