import { VideoInfo } from "./types";

export function detectVideoInfo(content: string): VideoInfo | null {
  // Vimeo detection
  const vimeoRegex = /https?:\/\/(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/i;
  const vimeoMatch = vimeoRegex.exec(content);
  if (vimeoMatch?.[1]) {
    return { platform: "vimeo", id: vimeoMatch[1] };
  }

  // YouTube detection
  const youtubeRegex =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/i;
  const youtubeMatch = youtubeRegex.exec(content);
  if (youtubeMatch?.[1]) {
    return { platform: "youtube", id: youtubeMatch[1] };
  }

  // Wistia detection
  const wistiaRegex =
    /https?:\/\/(?:.+)?wistia\.com\/(?:medias|embed)\/([a-zA-Z0-9]+)/i;
  const wistiaMatch = wistiaRegex.exec(content);
  if (wistiaMatch?.[1]) {
    return { platform: "wistia", id: wistiaMatch[1] };
  }

  return null;
}
