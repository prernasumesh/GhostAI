"use client";

import { Fragment } from "react";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { cn } from "cn";
import type { CanvasNodeData } from "@/types/canvas";

export type ShapeNode = Node<CanvasNodeData, "shape">;

const HANDLE_CLASS =
  "!h-2 !w-2 !border-none !bg-white opacity-0 transition-opacity group-hover:opacity-100";

const SIDES = [
  { side: "top", position: Position.Top },
  { side: "right", position: Position.Right },
  { side: "bottom", position: Position.Bottom },
  { side: "left", position: Position.Left },
] as const;

function Handles() {
  return (
    <>
      {SIDES.map(({ side, position }) => (
        <Fragment key={side}>
          <Handle
            type="source"
            position={position}
            id={`${side}-source`}
            className={HANDLE_CLASS}
          />
          <Handle
            type="target"
            position={position}
            id={`${side}-target`}
            className={HANDLE_CLASS}
          />
        </Fragment>
      ))}
    </>
  );
}

export function ShapeNode({ data, selected }: NodeProps<ShapeNode>) {
  const { label, shape, fill, textColor } = data;

  const ringClass = selected
    ? "ring-2 ring-brand ring-offset-2 ring-offset-base"
    : "";

  if (shape === "circle") {
    return (
      <div className="group relative">
        <Handles />
        <div
          className={cn(
            "flex h-24 w-24 items-center justify-center rounded-full px-2 text-center text-sm font-medium",
            ringClass
          )}
          style={{ backgroundColor: fill, color: textColor }}
        >
          {label}
        </div>
      </div>
    );
  }

  if (shape === "pill") {
    return (
      <div className="group relative">
        <Handles />
        <div
          className={cn(
            "flex h-10 min-w-32 items-center justify-center rounded-full px-4 text-sm font-medium",
            ringClass
          )}
          style={{ backgroundColor: fill, color: textColor }}
        >
          {label}
        </div>
      </div>
    );
  }

  if (shape === "diamond") {
    return (
      <div className="group relative flex h-28 w-28 items-center justify-center">
        <Handles />
        <svg
          viewBox="0 0 100 100"
          className={cn("absolute inset-0 h-full w-full", ringClass && "rounded-md")}
        >
          <polygon points="50,4 96,50 50,96 4,50" fill={fill} />
        </svg>
        <span
          className="relative px-6 text-center text-sm font-medium"
          style={{ color: textColor }}
        >
          {label}
        </span>
      </div>
    );
  }

  if (shape === "hexagon") {
    return (
      <div className="group relative flex h-24 w-32 items-center justify-center">
        <Handles />
        <svg viewBox="0 0 130 100" className="absolute inset-0 h-full w-full">
          <polygon points="33,4 97,4 127,50 97,96 33,96 3,50" fill={fill} />
        </svg>
        <span
          className="relative px-4 text-center text-sm font-medium"
          style={{ color: textColor }}
        >
          {label}
        </span>
      </div>
    );
  }

  if (shape === "cylinder") {
    return (
      <div className="group relative flex h-24 w-28 items-center justify-center">
        <Handles />
        <svg viewBox="0 0 100 90" className="absolute inset-0 h-full w-full">
          <path
            d="M4 18 C4 9 96 9 96 18 L96 72 C96 81 4 81 4 72 Z"
            fill={fill}
          />
          <ellipse cx="50" cy="18" rx="46" ry="10" fill={fill} />
        </svg>
        <span
          className="relative mt-2 px-4 text-center text-sm font-medium"
          style={{ color: textColor }}
        >
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="group relative">
      <Handles />
      <div
        className={cn(
          "flex min-h-12 min-w-32 items-center justify-center rounded-xl border border-surface-border px-4 py-2 text-center text-sm font-medium",
          ringClass
        )}
        style={{ backgroundColor: fill, color: textColor }}
      >
        {label}
      </div>
    </div>
  );
}
