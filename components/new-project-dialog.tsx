"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewProjectDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (name.trim().length === 0) return;

    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("Couldn't create the project. Try again.");
      return;
    }

    const { project } = await response.json();
    setOpen(false);
    setName("");
    router.push(`/projects/${project.id}`);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>New project</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a project</DialogTitle>
          <DialogDescription>
            Give your system design workspace a name.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Project name"
          onKeyDown={(event) => {
            if (event.key === "Enter") handleCreate();
          }}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <Button
          onClick={handleCreate}
          disabled={isSubmitting || name.trim().length === 0}
        >
          {isSubmitting ? "Creating…" : "Create"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
