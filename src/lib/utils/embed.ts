export type EmbedType = "youtube" | "spotify" | "soundcloud" | "unknown";

export type EmbedInfo = {
  type: EmbedType;
  embedUrl: string;
  label: string;
  aspectRatio?: string;
};

export function getEmbedInfo(url: string): EmbedInfo {
  const u = url.trim();

  // YouTube
  const ytMatch = u.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      label: "YouTube",
      aspectRatio: "56.25%",
    };
  }

  // Spotify track / album / playlist / episode
  const spMatch = u.match(
    /spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/
  );
  if (spMatch) {
    const isTrack = spMatch[1] === "track" || spMatch[1] === "episode";
    return {
      type: "spotify",
      embedUrl: `https://open.spotify.com/embed/${spMatch[1]}/${spMatch[2]}`,
      label: "Spotify",
      aspectRatio: isTrack ? undefined : "100%",
    };
  }

  // SoundCloud
  if (u.includes("soundcloud.com")) {
    return {
      type: "soundcloud",
      embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(u)}&auto_play=false&hide_related=true&show_comments=false&color=%23F59E0B`,
      label: "SoundCloud",
    };
  }

  return { type: "unknown", embedUrl: "", label: "" };
}
