import { ImageResponse } from "next/og";

export const alt = "Banandre Blog - Software Engineering Insights";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)",
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 0 30px, 30px -30px, -30px 0px",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Brand Logo/Icon */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#ffd700",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            ✦
          </div>
          <div
            style={{
              color: "#ffd700",
              fontSize: "24px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            BANANDRE
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "#ffffff",
              margin: "0 0 30px 0",
              lineHeight: "1.1",
              textShadow: "4px 4px 0px #ffd700, 8px 8px 0px rgba(0,0,0,0.5)",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Banandre Blog
          </h1>

          <p
            style={{
              fontSize: "24px",
              color: "#cccccc",
              margin: "0",
              lineHeight: "1.4",
              maxWidth: "800px",
            }}
          >
            Software Engineering Insights & AI Analysis
          </p>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "8px",
            background: "linear-gradient(90deg, #ffd700 0%, #ffed4a 50%, #ffd700 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
