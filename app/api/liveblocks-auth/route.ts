import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { getProjectForUser } from "@/lib/projects";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const room =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).room
      : undefined;

  if (typeof room !== "string") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const project = await getProjectForUser(room, userId);
  if (!project) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await currentUser();
  const session = liveblocks.prepareSession(userId, {
    userInfo: {
      name: user?.fullName ?? user?.primaryEmailAddress?.emailAddress ?? "Anonymous",
    },
  });

  session.allow(room, session.FULL_ACCESS);

  const { status, body: responseBody } = await session.authorize();
  return new NextResponse(responseBody, { status });
}
