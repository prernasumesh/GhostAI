import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Navbar } from "@/components/navbar";
import { getProjectForUser } from "@/lib/projects";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-copy-primary">{project.name}</CardTitle>
            <CardDescription>
              The collaborative canvas isn&apos;t built yet — this workspace
              is a placeholder until Liveblocks is wired up.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
