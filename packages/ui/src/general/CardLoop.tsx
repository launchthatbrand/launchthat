import { AnimatePresence, motion } from "framer-motion";

import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface CardLoopProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
  gridCols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  emptyState?: ReactNode;
}

const defaultAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2 },
};

export function CardLoop<T>({
  items,
  renderItem,
  className,
  containerClassName,
  animate = true,
  gridCols = {
    default: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 4,
  },
  gap = "gap-4",
  emptyState,
}: CardLoopProps<T>) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {emptyState || "No items to display"}
      </div>
    );
  }

  const gridClassName = cn(
    "grid",
    gap,
    `grid-cols-${gridCols.default}`,
    gridCols.sm && `sm:grid-cols-${gridCols.sm}`,
    gridCols.md && `md:grid-cols-${gridCols.md}`,
    gridCols.lg && `lg:grid-cols-${gridCols.lg}`,
    gridCols.xl && `xl:grid-cols-${gridCols.xl}`,
    containerClassName,
  );

  if (!animate) {
    return (
      <div className={gridClassName}>
        {items.map((item, index) => (
          <div key={index} className={className}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div className={gridClassName}>
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={className}
            {...defaultAnimations}
            transition={{
              ...defaultAnimations.transition,
              delay: index * 0.05,
            }}
            layout
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
