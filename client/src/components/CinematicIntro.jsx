import { useEffect, useRef, useState } from "react";

const CinematicIntro = ({ onEnter }) => {
  const videoRef = useRef(null);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Auto-play video
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    setTimeout(() => setShowText(true), 1500);
    setTimeout(() => setShowButton(true), 4000);
  }, []);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(onEnter, 1400);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "#000",
      opacity: leaving ? 0 : 1,
      transition: leaving ? "opacity 1.4s ease" : "none",
      overflow: "hidden",
    }}>

      {/* ── Video background ─────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src="/mountain.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
          filter: "brightness(0.55) contrast(1.1) saturate(0.85)",
        }}
      />

      {/* ── Cinematic letterbox bars ─────────────────────────────────── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "10vh", background: "#000", zIndex: 2,
      }}/>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "10vh", background: "#000", zIndex: 2,
      }}/>

      {/* ── Vignette ─────────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)",
      }}/>

      {/* ── Gradient overlay bottom (for text readability) ───────────── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "60%", zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
      }}/>

      {/* ── Text & Button overlay ─────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "1.2rem",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        padding: "0 2rem",
      }}>

        {/* Top subtitle */}
        <p style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "clamp(0.55rem, 1.1vw, 0.78rem)",
          letterSpacing: "0.45em",
          textTransform: "uppercase",
          margin: 0,
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 2.2s ease, transform 2.2s ease",
        }}>
          a himalayan intelligence experience
        </p>

        {/* Main title */}
        <h1 style={{
          color: "rgba(255,255,255,0.92)",
          fontSize: "clamp(1.6rem, 4.5vw, 3.4rem)",
          fontWeight: 300,
          letterSpacing: "0.1em",
          textAlign: "center",
          lineHeight: 1.35,
          margin: 0,
          textShadow: "0 2px 40px rgba(0,0,0,0.9)",
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(22px)",
          transition: "opacity 2.5s ease 0.4s, transform 2.5s ease 0.4s",
        }}>
          Himalayan Guest Experience<br />
          <span style={{
            color: "rgba(255,255,255,0.6)",
            fontStyle: "italic",
            fontWeight: 300,
          }}>
            Intelligence Platform
          </span>
        </h1>

        {/* Tagline */}
        <p style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "clamp(0.6rem, 1vw, 0.75rem)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          margin: 0,
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(14px)",
          transition: "opacity 2s ease 1s, transform 2s ease 1s",
        }}>
          AI · Sentiment · Themes · Insights
        </p>

        {/* Creator name */}
        <p style={{
          color: "rgba(255,255,255,0.35)",
          fontSize: "clamp(0.5rem, 0.85vw, 0.65rem)",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          margin: 0,
          fontFamily: "'Georgia', serif",
          fontStyle: "italic",
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 2s ease 1.4s, transform 2s ease 1.4s",
        }}>
          by Pranjal Pundeer
        </p>

        {/* Divider line */}
        <div style={{
          width: showButton ? "120px" : "0px",
          height: "1px",
          background: "rgba(150,190,255,0.4)",
          transition: "width 1.5s ease",
          marginTop: "0.5rem",
        }}/>

        {/* Enter button */}
        <button
          onClick={handleEnter}
          style={{
            padding: "0.7rem 2.8rem",
            background: "transparent",
            border: "1px solid rgba(150,190,255,0.45)",
            color: "rgba(200,225,255,0.9)",
            fontSize: "0.7rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "inherit",
            opacity: showButton ? 1 : 0,
            transform: showButton ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 1.5s ease, transform 1.5s ease, background 0.35s, border-color 0.35s, color 0.35s",
            backdropFilter: "blur(6px)",
            marginTop: "0.5rem",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(100,160,255,0.18)";
            e.currentTarget.style.borderColor = "rgba(150,200,255,0.9)";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(150,190,255,0.45)";
            e.currentTarget.style.color = "rgba(200,225,255,0.9)";
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default CinematicIntro;
