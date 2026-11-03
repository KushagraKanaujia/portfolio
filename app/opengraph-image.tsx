import { ImageResponse } from "next/og";

export const alt = "Kushagra Kanaujia — Founder of Throttle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#08090a", color: "#f2f2f0", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#8b8d91" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#7cf29c" }} />
          FOUNDER, THROTTLE
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>Kushagra Kanaujia</div>
          <div style={{ fontSize: 40, color: "#8b8d91", marginTop: 28 }}>Helping companies stop renting their AI.</div>
        </div>
      </div>
    ),
    size
  );
}
