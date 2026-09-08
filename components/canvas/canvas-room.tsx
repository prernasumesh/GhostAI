"use client";

import { ReactNode } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import { LiveMap } from "@liveblocks/client";

export function CanvasRoom({
  projectId,
  children,
}: {
  projectId: string;
  children: ReactNode;
}) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={projectId}
        initialPresence={{ cursor: null }}
        initialStorage={{ nodes: new LiveMap(), edges: new LiveMap() }}
      >
        <ClientSideSuspense
          fallback={
            <div className="flex flex-1 items-center justify-center text-sm text-copy-muted">
              Loading canvas…
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
