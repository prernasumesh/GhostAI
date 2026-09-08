import { prisma } from "@/lib/prisma";

export function listProjectsForUser(userId: string) {
  return prisma.project.findMany({
    where: {
      OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }],
    },
    orderBy: { updatedAt: "desc" },
  });
}

export function getProjectForUser(projectId: string, userId: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }],
    },
  });
}
