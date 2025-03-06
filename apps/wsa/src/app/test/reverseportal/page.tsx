"use client";

import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

export default function VideoPortalExample() {
  const [activeContainer, setActiveContainer] = useState<"A" | "B">("A");
  const videoRef = useRef<HTMLDivElement>(null);
  const containerARef = useRef<HTMLDivElement>(null);
  const containerBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const targetContainer =
      activeContainer === "A" ? containerARef.current : containerBRef.current;
    if (!targetContainer) return;

    // Get the positions
    const videoRect = videoRef.current.getBoundingClientRect();
    const targetRect = targetContainer.getBoundingClientRect();

    // Calculate the difference in position
    const deltaX = targetRect.left - videoRect.left;
    const deltaY = targetRect.top - videoRect.top;

    // Apply transform
    videoRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }, [activeContainer]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-8 text-2xl font-bold">Video Portal Example</h1>

      {/* Fixed position video that will be transformed */}
      <div
        ref={videoRef}
        className="fixed aspect-video w-[calc(50%-4rem)] rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-transform duration-300"
        style={{ top: "8rem" }}
      >
        <div className="h-full w-full rounded-md">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=aqz-KE-bpKQ"
            width="100%"
            height="100%"
            controls
            playing={false}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Container A */}
        <div
          ref={containerARef}
          className="h-[400px] rounded-lg border border-blue-200 bg-blue-50 p-4"
        >
          <h2 className="mb-4 text-xl font-semibold">Container A</h2>
        </div>

        {/* Container B */}
        <div
          ref={containerBRef}
          className="h-[400px] rounded-lg border border-green-200 bg-green-50 p-4"
        >
          <h2 className="mb-4 text-xl font-semibold">Container B</h2>
        </div>
      </div>

      <button
        onClick={() => setActiveContainer((prev) => (prev === "A" ? "B" : "A"))}
        className="mt-8 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Move Video to Container {activeContainer === "A" ? "B" : "A"}
      </button>

      <p className="mt-4 text-sm text-gray-600">
        The video should maintain its playback state when moved between
        containers
      </p>
    </div>
  );
}
