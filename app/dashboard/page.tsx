import { currentUser } from "@clerk/nextjs/server";
import { Navbar } from "@/components/navbar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <>
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-copy-primary">
              Welcome, {user?.firstName ?? "there"}
            </CardTitle>
            <CardDescription>
              Your projects will show up here once the database is connected.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
