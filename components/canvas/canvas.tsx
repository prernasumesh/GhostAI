"use client";

import { useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  applyNodeChanges,
  type NodeChange,
  type EdgeChange,
  type OnConnect,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useMutation, useMyPresence, useOthers, useStorage } from "@liveblocks/react/suspense";
import type { CanvasEdgeData, CanvasNodeStorage } from "@/liveblocks.config";
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar";
import { ShapeNode, type ShapeNode as ShapeNodeType } from "@/components/canvas/shape-node";
import {
  DEFAULT_EDGE_COLOR,
  type NodeColor,
  type NodeShape,
} from "@/types/canvas";

const nodeTypes = { shape: ShapeNode };

const defaultEdgeOptions = {
  type: "smoothstep",
  style: { stroke: DEFAULT_EDGE_COLOR, strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: DEFAULT_EDGE_COLOR },
} as const;

export function Canvas() {
  const nodeEntries = useStorage((root) => Object.entries(root.nodes));
  const edgeEntries = useStorage((root) => Object.entries(root.edges));
  const others = useOthers();
  const [, updateMyPresence] = useMyPresence();

  const nodes: ShapeNodeType[] = useMemo(
    () =>
      nodeEntries.map(([id, node]) => {
        const { position, data } = node as unknown as CanvasNodeStorage;
        return { id, type: "shape" as const, position, data };
      }),
    [nodeEntries]
  );

  const edges = useMemo(
    () =>
      edgeEntries.map(([id, edge]) => {
        const { source, target, sourceHandle, targetHandle } =
          edge as unknown as CanvasEdgeData;
        return { id, source, target, sourceHandle, targetHandle, ...defaultEdgeOptions };
      }),
    [edgeEntries]
  );

  const onNodesChange = useMutation(({ storage }, changes: NodeChange<ShapeNodeType>[]) => {
    const liveNodes = storage.get("nodes");
    const current: ShapeNodeType[] = Array.from(liveNodes.entries()).map(([id, n]) => ({
      id,
      type: "shape",
      position: n.position,
      data: n.data,
    }));
    const next = applyNodeChanges(changes, current);

    for (const change of changes) {
      if (change.type === "remove") {
        liveNodes.delete(change.id);
      }
    }
    for (const node of next) {
      const existing = liveNodes.get(node.id);
      if (existing && existing.position !== node.position) {
        liveNodes.set(node.id, { ...existing, position: node.position });
      }
    }
  }, []);

  const onEdgesChange = useMutation(({ storage }, changes: EdgeChange[]) => {
    const liveEdges = storage.get("edges");
    for (const change of changes) {
      if (change.type === "remove") {
        liveEdges.delete(change.id);
      }
    }
  }, []);

  const onConnect: OnConnect = useMutation(({ storage }, connection) => {
    if (!connection.source || !connection.target) return;
    const id = crypto.randomUUID();
    storage.get("edges").set(id, {
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle ?? undefined,
      targetHandle: connection.targetHandle ?? undefined,
    });
  }, []);

  const addNode = useMutation(({ storage }, shape: NodeShape, color: NodeColor) => {
    const id = crypto.randomUUID();
    storage.get("nodes").set(id, {
      id,
      position: { x: 120 + Math.random() * 200, y: 120 + Math.random() * 200 },
      data: {
        label: "New node",
        shape,
        fill: color.fill,
        textColor: color.text,
      },
    });
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      updateMyPresence({
        cursor: { x: event.clientX - rect.left, y: event.clientY - rect.top },
      });
    },
    [updateMyPresence]
  );

  const handlePointerLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-0 flex-1"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={defaultEdgeOptions}
        colorMode="dark"
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      <CanvasToolbar onAddNode={addNode} />

      {others.map(
        ({ connectionId, presence, info }) =>
          presence.cursor && (
            <div
              key={connectionId}
              className="pointer-events-none absolute z-20 flex items-center gap-1.5"
              style={{ left: presence.cursor.x, top: presence.cursor.y }}
            >
              <div className="h-2.5 w-2.5 rounded-full bg-ai" />
              <span className="rounded-md bg-ai px-1.5 py-0.5 text-xs text-copy-primary">
                {info?.name ?? "Anonymous"}
              </span>
            </div>
          )
      )}
    </div>
  );
}
