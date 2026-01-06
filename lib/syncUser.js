import { prisma } from "./prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses[0]?.emailAddress;

  // Generate username from email (part before @) or use user ID
  const username = user.username || email?.split("@")[0] || user.id;

  return prisma.user.upsert({
    where: {
      clerkId: user.id,
    },
    update: {
      username,
      name: user.firstName || username,
    },
    create: {
      clerkId: user.id,
      username,
      email,
      name: user.firstName || username,
    },
  });
}