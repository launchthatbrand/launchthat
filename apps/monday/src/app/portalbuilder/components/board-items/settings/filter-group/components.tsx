import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export const FilterGroupCard = Card;

export const FilterGroupHeader = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("mb-4 flex items-center justify-between", className)}>
    {children}
  </div>
);

export const FilterGroupTitle = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <h4 className={cn("text-sm font-medium text-gray-700", className)}>
    {children}
  </h4>
);

export const FilterGroupContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <div className={cn("space-y-4", className)}>{children}</div>;

export const FilterGroupDragHandle = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <button className={cn("cursor-grab rounded p-1 hover:bg-muted", className)}>
    {children}
  </button>
);
