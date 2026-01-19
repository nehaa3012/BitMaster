
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkSolved() {
    try {
        const users = await prisma.user.findMany({
            include: {
                _count: {
                    select: { solvedBy: true }
                }
            }
        });

        console.log('--- USERS ---');
        users.forEach(u => {
            console.log(`User: ${u.name} (${u.id}) - Solved: ${u._count.solvedBy}`);
        });

        const solved = await prisma.problemSolved.findMany({
            include: {
                user: { select: { name: true } },
                problem: { select: { title: true } }
            }
        });

        console.log('\n--- SOLVED RECORDS ---');
        solved.forEach(s => {
            console.log(`User "${s.user.name}" solved "${s.problem.title}" at ${s.createdAt}`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

checkSolved();
