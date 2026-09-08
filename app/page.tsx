import Link from "next/link";
import { Show, SignUpButton } from "@clerk/nextjs";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-copy-primary">Ghost AI</CardTitle>
            <CardDescription>
              A real-time collaborative system design workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <Button>Get started</Button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Button render={<Link href="/dashboard">Go to dashboard</Link>} />
            </Show>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
