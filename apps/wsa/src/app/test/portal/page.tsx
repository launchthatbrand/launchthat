"use client";

import type { HtmlPortalNode } from "react-reverse-portal";
import { useEffect, useRef, useState } from "react";
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";

const VideoPortal = () => {
  console.log("Component rendering");

  // Create a portal node that will host our video
  const portalNode = useRef<HtmlPortalNode>();
  const [activeSection, setActiveSection] = useState<string>("section1");

  // Create the portal node once when component mounts
  useEffect(() => {
    console.log("Creating portal node");
    portalNode.current = createHtmlPortalNode();
    console.log("Portal node created:", portalNode.current);

    return () => {
      console.log("Cleaning up portal node");
      portalNode.current?.unmount();
    };
  }, []);

  useEffect(() => {
    console.log("Setting up intersection observer");
    if (!portalNode.current) {
      console.log("No portal node available");
      return;
    }

    // Intersection Observer to track scroll position
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("Section in view:", entry.target.id);
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 },
    );

    // Observe all sections
    ["section1", "section2", "section3"].forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        console.log("Observing section:", sectionId);
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  if (!portalNode.current) {
    console.log("Waiting for portal node");
    return null;
  }

  console.log("Rendering with active section:", activeSection);

  return (
    <div className="min-h-screen">
      {/* Host node that will contain the actual video element */}
      <InPortal node={portalNode.current}>
        <div className="aspect-video w-full bg-gray-100">
          <iframe
            src="https://www.youtube.com/embed/aqz-KE-bpKQ"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </InPortal>

      {/* Sections where the video should appear */}
      <div id="section1" className="h-screen border border-black p-4">
        <h2 className="mb-4 text-xl">Section 1</h2>
        {activeSection === "section1" && (
          <OutPortal node={portalNode.current} />
        )}
      </div>
      <div id="section2" className="h-screen border border-black p-4">
        <h2 className="mb-4 text-xl">Section 2</h2>
        {activeSection === "section2" && (
          <OutPortal node={portalNode.current} />
        )}
      </div>
      <div id="section3" className="h-screen border border-black p-4">
        <h2 className="mb-4 text-xl">Section 3</h2>
        {activeSection === "section3" && (
          <OutPortal node={portalNode.current} />
        )}
      </div>
    </div>
  );
};

export default VideoPortal;
