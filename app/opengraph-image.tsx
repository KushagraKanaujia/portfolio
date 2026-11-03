import { ImageResponse } from "next/og";

export const alt = "hey, I'm Kush";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 80, color: "#fff6ea", fontFamily: "serif",
        background: "linear-gradient(180deg, #3b2a4f 0%, #7a4a6a 30%, #d9786c 55%, #ffb071 70%, #7d4a5c 72%, #2b1a2a 100%)" }}>
        <div style={{ fontSize: 132, lineHeight: 1 }}>hey, I'm Kush.</div>
        <div style={{ fontSize: 36, marginTop: 20, opacity: 0.85, fontFamily: "sans-serif" }}>Building things in Isla Vista, California.</div>
      </div>
    ),
    size
  );
}
