import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Navbar } from "@/components/navbar";
import { NewProjectDialog } from "@/components/new-project-dialog";
import { listProjectsForUser } from "@/lib/projects";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function DashboardPage() {
  const { userId } = await auth();
  const projects = userId ? await listProjectsForUser(userId) : [];

  return (
    <>
      <Navbar />
      <div className="mx-auto w-full max-w-3xl flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-copy-primary">Projects</h1>
          <NewProjectDialog />
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-copy-primary">
                No projects yet
              </CardTitle>
              <CardDescription>
                Create your first project to start designing a system.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="transition-colors hover:border-surface-border-subtle">
                  <CardHeader>
                    <CardTitle className="text-copy-primary">
                      {project.name}
                    </CardTitle>
                    <CardDescription>
                      Updated {project.updatedAt.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
