import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Navbar } from "@/components/navbar";
import { CanvasRoom } from "@/components/canvas/canvas-room";
import { Canvas } from "@/components/canvas/canvas";
import { getProjectForUser } from "@/lib/projects";

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { userId } = await auth();
  const { projectId } = await params;

  if (!userId) notFound();

  const project = await getProjectForUser(projectId, userId);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <CanvasRoom projectId={project.id}>
        <Canvas />
      </CanvasRoom>
    </>
  );
}
