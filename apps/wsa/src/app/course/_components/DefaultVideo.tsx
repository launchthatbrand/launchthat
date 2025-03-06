"use client";

export function DefaultVideo() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src="https://www.youtube.com/embed/aqz-KE-bpKQ"
        title="Default Course Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
