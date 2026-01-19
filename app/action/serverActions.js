'use server';
import { prisma } from "@/lib/prisma";
import { syncUser } from "@/lib/syncUser";
import { revalidatePath } from "next/cache";
import { redisHelpers } from "@/lib/redis";

// Get all Problems
export async function getAllProblems() {
    try {
        const user = await syncUser();
        const cacheKey = `user_problems:${user.id}`;
        // first try from redis 
        const problemCache = await redisHelpers.get(cacheKey);
        if (problemCache) {
            console.log("problem list from redis");
            return problemCache;
        }
        console.log("problem list from db");
        const problems = await prisma.problem.findMany({
            where: {
                userId: user.id
            }
        });
        // store in redis
        await redisHelpers.set(cacheKey, problems, 60 * 60 * 24);
        return problems;

    } catch (error) {
        console.error("Error fetching problems:", error);
        throw error;
    }
}

export async function getAllProblemsForListing(difficulty) {
    try {
        const user = await syncUser();
        console.log(`👤 DEBUG: Current User ID (serverActions): ${user.id}`);
        const diff = difficulty || "ALL";
        const cacheKey = `problems_listing:${diff}:${user.id}`;

        let where = {};
        if (difficulty && difficulty !== "ALL") {
            where.difficulty = difficulty;
        }

        // TEMPORARILY DISABLED REDIS FOR TROUBLESHOOTING
        /*
        const problemCache = await redisHelpers.get(cacheKey);
        if (problemCache) {
            console.log("filtered problem list from redis");
            return problemCache;
        }
        */
        console.log("filtered problem list from db");

        const problems = await prisma.problem.findMany({
            where,
            include: {
                solvedBy: {
                    where: {
                        userId: user.id
                    },
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`📊 DB returned ${problems.length} problems for user ${user.id}`);

        const formattedProblems = problems.map(problem => {
            const isSolved = problem.solvedBy.length > 0;
            if (isSolved) {
                console.log(`✅ SOLVED: "${problem.title}" (Problem ID: ${problem.id})`);
            }
            return {
                ...problem,
                isSolved
            }
        });

        const solvedCount = formattedProblems.filter(p => p.isSolved).length;
        console.log(`📈 Summary: ${solvedCount} problems solved out of ${formattedProblems.length}`);

        const result = { problems: formattedProblems, userRole: user.role, currentUserId: user.id };

        // store in redis
        await redisHelpers.set(cacheKey, result, 60 * 60 * 24);

        return result;
    } catch (error) {
        console.error("Error fetching problems list:", error);
        throw error;
    }
}

// Get single problem with userId
export async function getProblemById(id) {
    try {
        const user = await syncUser();
        const cacheKey = `problem_detail:${id}`;
        // first try from redis
        const problemCache = await redisHelpers.get(cacheKey);
        if (problemCache) {
            console.log("problem from redis");
            return problemCache;
        }
        console.log("problem from db");
        const problem = await prisma.problem.findUnique({
            where: {
                id: id,
            }
        });
        // store in redis
        await redisHelpers.set(cacheKey, problem, 60 * 60 * 24);
        return problem;
    } catch (error) {
        console.error("Error fetching problem:", error);
        throw error;
    }
}

// Delete problem
export async function deleteProblem(id) {
    try {
        const user = await syncUser();
        if (user.role !== "ADMIN") {
            throw new Error("Only Admin can delete problems");
        }
        const problem = await prisma.problem.delete({
            where: {
                id: id
            }
        });
        revalidatePath("/problems");

        // Invalidate specific problem cache
        await redisHelpers.del(`problem_detail:${id}`);

        // Invalidate all problem listings (both general and user-specific)
        // We use keys with wildcard to clear ALL filtered listings since difficulty is unknown here
        const listingKeys = await redisHelpers.keys('problems_listing:*');
        const userProblemKeys = await redisHelpers.keys('user_problems:*');

        if (listingKeys.length > 0) await redisHelpers.del(...listingKeys);
        if (userProblemKeys.length > 0) await redisHelpers.del(...userProblemKeys);

        return problem;
    } catch (error) {
        console.error("Error deleting problem:", error);
        throw error;
    }
}

// Get user profile
export async function getUserProfile() {
    try {
        const user = await syncUser();
        const cacheKey = `user_profile:${user.id}`;
        // first try from redis
        const profileCache = await redisHelpers.get(cacheKey);
        if (profileCache) {
            console.log("profile from redis");
            return profileCache;
        }
        console.log("profile from db");
        const profile = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                problems: true,
                solvedBy: {
                    include: {
                        problem: true
                    }
                }
            }
        });
        // store in redis
        await redisHelpers.set(cacheKey, profile, 60 * 60 * 24);
        return profile;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

// Get leaderboard data
export async function getLeaderboardData() {
    try {
        // first try from redis
        const leaderboardCache = await redisHelpers.get(`leaderboard`);
        if (leaderboardCache) {
            console.log("leaderboard from redis");
            return leaderboardCache;
        }
        console.log("leaderboard from db");
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
                clerkId: true,
                _count: {
                    select: {
                        solvedBy: true
                    }
                }
            },
            orderBy: {
                solvedBy: {
                    _count: "desc",
                },
            },
        });

        // Format for easier use in frontend
        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            id: user.id,
            username: user.username,
            name: user.name,
            clerkId: user.clerkId,
            solveCount: user._count.solvedBy
        }));
        // store in redis
        await redisHelpers.set(`leaderboard`, leaderboard, 60 * 60 * 24);
        return leaderboard;
    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        throw error;
    }
}

// Create Playlist
export async function createPlaylist(title, problems) {
    try {
        if (!title || !problems || !Array.isArray(problems) || problems.length === 0) {
            throw new Error("Title and at least one problem are required");
        }
        const user = await syncUser();
        const playlist = await prisma.playlist.create({
            include: {
                problems: true
            },
            data: {
                title: title,
                userId: user.id,
                problems: {
                    connect: problems.map(problem => ({ id: problem.id }))
                }
            }
        });

        revalidatePath("/playlists");
        // Invalidate specific user's playlist cache
        await redisHelpers.del(`user_playlists:${user.id}`);
        return playlist;
    } catch (error) {
        console.error("Error creating playlist:", error);
        throw error;
    }
}

// Get user playlists
export async function getUserPlaylists() {
    try {
        const user = await syncUser();
        const cacheKey = `user_playlists:${user.id}`;

        // first try from redis
        const playlistCache = await redisHelpers.get(cacheKey);
        if (playlistCache) {
            console.log("playlists from redis");
            return playlistCache;
        }

        console.log("playlists from db");
        const playlists = await prisma.playlist.findMany({
            where: {
                userId: user.id
            },
            include: {
                problems: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // store in redis
        await redisHelpers.set(cacheKey, playlists, 60 * 60 * 24);
        return playlists;
    } catch (error) {
        console.error("Error fetching user playlists:", error);
        throw error;
    }
}
