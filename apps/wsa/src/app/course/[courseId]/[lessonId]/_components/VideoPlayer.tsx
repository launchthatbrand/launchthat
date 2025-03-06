import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { VideoInfo } from "../types";

interface VideoPlayerProps {
  videoInfo: VideoInfo;
  stickyContainerRef: React.RefObject<HTMLDivElement>;
}

export function VideoPlayer({
  videoInfo,
  stickyContainerRef,
}: VideoPlayerProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoContainerRef.current) return;

    // Only observe intersection on md screens and up
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    let observer: IntersectionObserver | null = null;

    function setupObserver() {
      if (!mediaQuery.matches) {
        setPortalContainer(null);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (stickyContainerRef.current) {
              setPortalContainer(
                entry.isIntersecting ? null : stickyContainerRef.current,
              );
            }
          });
        },
        { threshold: 0 },
      );

      if (videoContainerRef.current) {
        observer.observe(videoContainerRef.current);
      }
    }

    // Initial setup
    setupObserver();

    // Handle window resize
    function handleResize() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      setupObserver();
    }

    mediaQuery.addEventListener("change", handleResize);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, [stickyContainerRef]);

  const videoElement = (
    <div className={`aspect-video ${portalContainer ? "w-full" : ""}`}>
      {videoInfo.platform === "vimeo" && (
        <iframe
          src={`https://player.vimeo.com/video/${videoInfo.id}`}
          className="h-full w-full rounded-lg"
          allow="autoplay; fullscreen; picture-in-picture"
        />
      )}
      {videoInfo.platform === "youtube" && (
        <iframe
          src={`https://www.youtube.com/embed/${videoInfo.id}`}
          className="h-full w-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
      {videoInfo.platform === "wistia" && (
        <iframe
          src={`https://fast.wistia.net/embed/iframe/${videoInfo.id}`}
          className="h-full w-full rounded-lg"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      )}
    </div>
  );

  return (
    <>
      <div ref={videoContainerRef}>
        {!portalContainer ? videoElement : null}
      </div>
      {portalContainer && createPortal(videoElement, portalContainer)}
    </>
  );
}
