import { ImageResponse } from "next/og";

export const alt = "Kushagra Kanaujia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 80, color: "#fff6ea", fontFamily: "serif",
        background: "radial-gradient(circle at 70% 0%, rgba(255,200,150,0.55), transparent 45%), linear-gradient(180deg, #3496be 0%, #0c4a74 40%, #04203a 75%, #020a16 100%)" }}>
        <div style={{ fontSize: 120, lineHeight: 1 }}>Kushagra Kanaujia.</div>
        <div style={{ fontSize: 36, marginTop: 20, opacity: 0.85, fontFamily: "sans-serif" }}>Software engineer in San Francisco. UCSB CS ’26.</div>
      </div>
    ),
    size
  );
}
