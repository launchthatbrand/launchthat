import { useEffect, useRef } from "react";

interface GradientCanvasProps {
  className?: string;
}

export function GradientCanvas({ className }: GradientCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    // Colors for the gradient
    const colors = [
      { r: 252, g: 101, b: 60 }, // #FC653C (orange)
      { r: 43, g: 14, b: 77 }, // #2b0e4d (purple)
      { r: 252, g: 101, b: 60 }, // #FC653C (orange)
      { r: 43, g: 14, b: 77 }, // #2b0e4d (purple)
    ];

    let time = 0;
    const speed = 0.002;

    const drawGradient = () => {
      const { width, height } = canvas.getBoundingClientRect();

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);

      // Update color positions
      colors.forEach((color, i) => {
        const pos = (i / (colors.length - 1) + time) % 1;
        gradient.addColorStop(
          pos,
          `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`,
        );
      });

      // Draw gradient
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update time
      time += speed;

      // Request next frame
      requestAnimationFrame(drawGradient);
    };

    // Initial setup
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    drawGradient();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
