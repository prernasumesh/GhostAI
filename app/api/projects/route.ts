import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { listProjectsForUser } from "@/lib/projects";

interface CreateProjectInput {
  name: string;
}

function parseCreateProjectInput(body: unknown): CreateProjectInput | null {
  if (typeof body !== "object" || body === null) return null;
  const name = (body as Record<string, unknown>).name;
  if (typeof name !== "string" || name.trim().length === 0) return null;
  return { name: name.trim() };
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await listProjectsForUser(userId);
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = parseCreateProjectInput(await request.json().catch(() => null));
  if (!input) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: { name: input.name, ownerId: userId },
  });

  return NextResponse.json({ project }, { status: 201 });
}
