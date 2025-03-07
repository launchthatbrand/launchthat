import React, { useMemo, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@acme/ui/lib/utils";

import { PerspectiveGrid } from "../PerspectiveGrid";

interface Carousel3DProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  className?: string;
}

export function Carousel3D<T>({
  items,
  renderItem,
  className,
}: Carousel3DProps<T>) {
  const [activeSlide, setActiveSlide] = useState(0);

  const next = () =>
    activeSlide < items.length - 1 && setActiveSlide(activeSlide + 1);

  const prev = () => activeSlide > 0 && setActiveSlide(activeSlide - 1);

  const getSlideStyles = (index: number) => {
    if (activeSlide === index)
      return {
        transform: "translateX(0px) translateZ(0px) rotateY(0deg)",
        opacity: 1,
        scale: 0.8,
        zIndex: 10,
      };
    else if (activeSlide - 1 === index)
      return {
        transform: "translateX(-240px) translateZ(-400px) rotateY(35deg)",
        opacity: 1,
        scale: 0.6,
        zIndex: 9,
      };
    else if (activeSlide + 1 === index)
      return {
        transform: "translateX(240px) translateZ(-400px) rotateY(-35deg)",
        opacity: 1,
        scale: 0.6,
        zIndex: 9,
      };
    else if (activeSlide - 2 === index)
      return {
        transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)",
        opacity: 0.6,
        scale: 0.4,
        zIndex: 8,
      };
    else if (activeSlide + 2 === index)
      return {
        transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)",
        opacity: 0.6,
        scale: 0.4,
        zIndex: 8,
      };
    else if (index < activeSlide - 2)
      return {
        transform: "translateX(-480px) translateZ(-500px) rotateY(35deg)",
        opacity: 0,
        scale: 0.4,
        zIndex: 7,
      };
    else
      return {
        transform: "translateX(480px) translateZ(-500px) rotateY(-35deg)",
        opacity: 0,
        scale: 0.4,
        zIndex: 7,
      };
  };

  return (
    <div
      className={cn(
        "relative mx-auto h-[500px] w-full select-none overflow-hidden px-4",
        className,
      )}
    >
      {/* Stage Background */}
      <PerspectiveGrid className="opacity-20" />

      {/* Carousel Container */}
      <div className="perspective-[1000px] preserve-3d relative mx-auto h-[400px] w-[600px] transform-gpu">
        {items.map((item, index) => {
          const styles = getSlideStyles(index);
          return (
            <animated.div
              key={index}
              className="absolute left-0 top-0 h-auto w-[600px] rounded-xl bg-white shadow-lg"
              style={{
                ...styles,
                transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {renderItem(item)}
              <div
                className="absolute bottom-[-100px] h-[90px] w-full rounded-xl bg-gradient-to-b from-black/40 to-transparent opacity-30"
                style={{
                  transition: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </animated.div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="absolute left-1/2 top-1/2 z-20 flex w-full -translate-y-1/2 justify-between px-8">
        <button
          onClick={prev}
          disabled={activeSlide === 0}
          className="rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 disabled:opacity-50"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          disabled={activeSlide === items.length - 1}
          className="rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 disabled:opacity-50"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              index === activeSlide
                ? "bg-white"
                : "bg-white/30 hover:bg-white/50",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
