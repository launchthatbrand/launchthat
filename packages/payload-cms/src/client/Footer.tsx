"use client";

import React from "react";

// Simple client-side footer with no server dependencies
export const Footer: React.FC<{
  className?: string;
  // Add any props needed for the footer
}> = ({ className }) => {
  return (
    <footer className={className}>
      <div className="container py-12">
        <div className="flex justify-between">
          <div>© {new Date().getFullYear()} Your Company</div>
          <div>
            <nav>
              <ul className="flex gap-6">
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};
