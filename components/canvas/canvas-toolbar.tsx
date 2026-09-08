"use client";

import { useState } from "react";
import { Square, Diamond, Circle, Pill as PillIcon, Database, Hexagon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import {
  NODE_COLORS,
  NODE_SHAPES,
  DEFAULT_NODE_COLOR,
  DEFAULT_NODE_SHAPE,
  type NodeColor,
  type NodeShape,
} from "@/types/canvas";

const SHAPE_ICONS: Record<NodeShape, typeof Square> = {
  rectangle: Square,
  diamond: Diamond,
  circle: Circle,
  pill: PillIcon,
  cylinder: Database,
  hexagon: Hexagon,
};

export function CanvasToolbar({
  onAddNode,
}: {
  onAddNode: (shape: NodeShape, color: NodeColor) => void;
}) {
  const [shape, setShape] = useState<NodeShape>(DEFAULT_NODE_SHAPE);
  const [color, setColor] = useState<NodeColor>(DEFAULT_NODE_COLOR);

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 rounded-2xl border border-surface-border bg-surface/90 p-3 backdrop-blur">
      <div className="flex gap-1">
        {NODE_SHAPES.map((option) => {
          const Icon = SHAPE_ICONS[option];
          return (
            <button
              key={option}
              type="button"
              onClick={() => setShape(option)}
              aria-label={option}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-copy-secondary hover:text-copy-primary",
                shape === option && "border-surface-border-subtle bg-subtle text-brand"
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      <div className="flex gap-1.5">
        {NODE_COLORS.map((option) => (
          <button
            key={option.fill}
            type="button"
            onClick={() => setColor(option)}
            aria-label={`color ${option.fill}`}
            className={cn(
              "h-5 w-5 rounded-full border border-surface-border",
              color.fill === option.fill && "ring-2 ring-brand ring-offset-2 ring-offset-surface"
            )}
            style={{ backgroundColor: option.fill }}
          />
        ))}
      </div>

      <Button size="sm" onClick={() => onAddNode(shape, color)}>
        Add node
      </Button>
    </div>
  );
}
