import type { Json, LiveMap } from "@liveblocks/client";
import type { CanvasNodeData } from "@/types/canvas";

export interface CanvasEdgeData {
  source: string;
  target: string;
  [key: string]: Json | undefined;
}

export interface CanvasNodeStorage {
  id: string;
  position: { x: number; y: number };
  data: CanvasNodeData;
  [key: string]: Json | undefined;
}

declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
    };
    Storage: {
      nodes: LiveMap<string, CanvasNodeStorage>;
      edges: LiveMap<string, CanvasEdgeData>;
    };
    UserMeta: {
      id: string;
      info: {
        name: string;
      };
    };
  }
}

export {};
