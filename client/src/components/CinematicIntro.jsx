import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const CinematicIntro = ({ onEnter }) => {
  const mountRef = useRef(null);
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    const W = window.innerWidth, H = window.innerHeight;

    // ── Renderer ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020818);
    scene.fog = new THREE.FogExp2(0x0a1628, 0.0055);

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 2000);
    camera.position.set(0, 60, 280);
    camera.lookAt(0, 30, 0);

    // ── Stars ─────────────────────────────────────────────────────────────
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(6000 * 3);
    for (let i = 0; i < 6000 * 3; i++) starPos[i] = (Math.random() - 0.5) * 2000;
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0.8 });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── Procedural Mountain Generator ─────────────────────────────────────
    const generateMountain = (peaks, spread, height, color, z, opacity = 1) => {
      const points = [];
      const segments = 120;
      const w = spread;

      // left edge
      points.push(new THREE.Vector2(-w, -30));

      // base left
      points.push(new THREE.Vector2(-w * 0.9, -10));

      // terrain profile with multiple peaks
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = -w + t * w * 2;
        let y = 0;
        peaks.forEach(([px, py, pw]) => {
          const d = Math.abs(t - px) / pw;
          y += py * Math.exp(-d * d * 4);
        });
        // add noise
        y += Math.sin(t * 23.7) * 3 + Math.sin(t * 41.3) * 1.5 + Math.sin(t * 7.1) * 5;
        points.push(new THREE.Vector2(x, y));
      }

      // base right
      points.push(new THREE.Vector2(w * 0.9, -10));
      points.push(new THREE.Vector2(w, -30));

      const shape = new THREE.Shape(points);
      const geo = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: opacity < 1,
        opacity,
        side: THREE.FrontSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, height, z);
      mesh.scale.y = 1;
      scene.add(mesh);
      return mesh;
    };

    // ── Snow caps ─────────────────────────────────────────────────────────
    const generateSnowCap = (peaks, spread, height, z) => {
      const points = [];
      const segments = 80;
      const w = spread;
      peaks.forEach(([px, py, pw]) => {
        const capSpread = pw * 0.18;
        for (let i = 0; i <= 30; i++) {
          const t = px - capSpread + (i / 30) * capSpread * 2;
          const x = -w + t * w * 2;
          let y = 0;
          peaks.forEach(([ppx, ppy, ppw]) => {
            const d = Math.abs(t - ppx) / ppw;
            y += ppy * Math.exp(-d * d * 4);
          });
          y += Math.sin(t * 23.7) * 3 + Math.sin(t * 41.3) * 1.5;
          const capY = py * Math.exp(-Math.pow(Math.abs(t - px) / (capSpread * 0.6), 2) * 4);
          if (capY > 5) points.push(new THREE.Vector2(x, y + 0.5));
        }
      });
      if (points.length < 3) return;
      points.push(new THREE.Vector2(points[points.length - 1].x, points[points.length - 1].y - 25));
      points.push(new THREE.Vector2(points[0].x, points[0].y - 25));
      const shape = new THREE.Shape(points);
      const geo = new THREE.ShapeGeometry(shape);
      const mat = new THREE.MeshBasicMaterial({ color: 0xeef4ff, transparent: true, opacity: 0.9 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, height, z + 0.5);
      scene.add(mesh);
    };

    // Back mountains (far, dark blue)
    generateMountain(
      [[0.15, 140, 0.18], [0.38, 170, 0.14], [0.6, 155, 0.16], [0.82, 145, 0.15], [0.5, 190, 0.12]],
      700, 0, 0x0d2240, -150, 1
    );
    generateSnowCap(
      [[0.15, 140, 0.18], [0.38, 170, 0.14], [0.6, 155, 0.16], [0.82, 145, 0.15], [0.5, 190, 0.12]],
      700, 0, -150
    );

    // Mid mountains
    generateMountain(
      [[0.2, 120, 0.2], [0.45, 150, 0.16], [0.7, 135, 0.18], [0.88, 110, 0.14]],
      600, -10, 0x0a1e38, -80, 1
    );
    generateSnowCap(
      [[0.2, 120, 0.2], [0.45, 150, 0.16], [0.7, 135, 0.18], [0.88, 110, 0.14]],
      600, -10, -80
    );

    // Front mountains (closer, darker)
    generateMountain(
      [[0.1, 100, 0.22], [0.35, 130, 0.18], [0.6, 115, 0.2], [0.85, 105, 0.16]],
      550, -20, 0x071528, -20, 1
    );
    generateSnowCap(
      [[0.1, 100, 0.22], [0.35, 130, 0.18], [0.6, 115, 0.2], [0.85, 105, 0.16]],
      550, -20, -20
    );

    // Foreground silhouette
    generateMountain(
      [[0.25, 70, 0.25], [0.55, 85, 0.22], [0.78, 65, 0.2]],
      500, -30, 0x030d1a, 30, 1
    );

    // ── Moon ──────────────────────────────────────────────────────────────
    const moonGeo = new THREE.CircleGeometry(18, 64);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xfff5d0 });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(-180, 140, -200);
    scene.add(moon);

    // Moon glow
    const glowGeo = new THREE.CircleGeometry(35, 64);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.08 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.set(-180, 140, -201);
    scene.add(glow);

    // ── Ambient light glow on horizon ─────────────────────────────────────
    const horizonGeo = new THREE.PlaneGeometry(1400, 80);
    const horizonMat = new THREE.MeshBasicMaterial({
      color: 0x1a3a6e, transparent: true, opacity: 0.35,
    });
    const horizon = new THREE.Mesh(horizonGeo, horizonMat);
    horizon.position.set(0, 5, -100);
    scene.add(horizon);

    // ── Snow particles ────────────────────────────────────────────────────
    const snowCount = 2000;
    const snowPos = new Float32Array(snowCount * 3);
    const snowMeta = [];
    for (let i = 0; i < snowCount; i++) {
      snowPos[i*3]   = (Math.random()-0.5)*600;
      snowPos[i*3+1] = (Math.random()-0.5)*300 + 80;
      snowPos[i*3+2] = (Math.random()-0.5)*400;
      snowMeta.push({
        vy: -(0.03 + Math.random()*0.08),
        vx: (Math.random()-0.5)*0.02,
        phase: Math.random()*Math.PI*2,
      });
    }
    const snowGeo = new THREE.BufferGeometry();
    snowGeo.setAttribute("position", new THREE.BufferAttribute(snowPos, 3));
    const snowMat2 = new THREE.PointsMaterial({
      color: 0xddeeff, size: 0.7, transparent: true, opacity: 0.6,
      depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const snowParticles = new THREE.Points(snowGeo, snowMat2);
    scene.add(snowParticles);

    // ── Cinematic letter-box bars ─────────────────────────────────────────
    // (handled in CSS overlay)

    // ── Camera animation ──────────────────────────────────────────────────
    let t = 0;
    let animId;
    const camStart = { x: 0, y: 60, z: 280 };
    const camEnd   = { x: -30, y: 45, z: 220 };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.003;
      const progress = Math.min(t / 6, 1); // 0→1 over ~6s worth of frames
      const ease = 1 - Math.pow(1 - progress, 3);

      // Slow cinematic pan + push in
      camera.position.x = camStart.x + (camEnd.x - camStart.x) * ease;
      camera.position.y = camStart.y + (camEnd.y - camStart.y) * ease;
      camera.position.z = camStart.z + (camEnd.z - camStart.z) * ease;
      camera.lookAt(camera.position.x * 0.3, 25, 0);

      // Snow
      const sp = snowGeo.attributes.position.array;
      for (let i = 0; i < snowCount; i++) {
        const m = snowMeta[i];
        m.phase += 0.008;
        sp[i*3]   += m.vx + Math.sin(m.phase)*0.015;
        sp[i*3+1] += m.vy;
        if (sp[i*3+1] < -80) {
          sp[i*3]   = (Math.random()-0.5)*600;
          sp[i*3+1] = 200;
          sp[i*3+2] = (Math.random()-0.5)*400;
        }
      }
      snowGeo.attributes.position.needsUpdate = true;

      // subtle star twinkle
      starMat.opacity = 0.65 + Math.sin(t*0.8)*0.15;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = window.innerWidth, nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    // Trigger text & button timings
    setTimeout(() => setShowText(true), 1200);
    setTimeout(() => setShowButton(true), 3500);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(onEnter, 1200);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:99999,
      background:"#020818",
      opacity: leaving ? 0 : 1,
      transition: leaving ? "opacity 1.2s ease" : "none",
    }}>
      {/* Three.js canvas */}
      <div ref={mountRef} style={{ position:"absolute", inset:0 }} />

      {/* Cinematic letterbox bars */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"10vh",
        background:"#000", zIndex:2,
      }}/>
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:"10vh",
        background:"#000", zIndex:2,
      }}/>

      {/* Vignette */}
      <div style={{
        position:"absolute", inset:0, zIndex:1,
        background:"radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        pointerEvents:"none",
      }}/>

      {/* Cinematic text overlay */}
      <div style={{
        position:"absolute", inset:0, zIndex:3,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        gap:"1.5rem",
        fontFamily:"'Georgia', 'Times New Roman', serif",
      }}>
        {/* Subtitle */}
        <p style={{
          color:"rgba(180,210,255,0.7)",
          fontSize:"clamp(0.6rem, 1.2vw, 0.85rem)",
          letterSpacing:"0.4em",
          textTransform:"uppercase",
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(12px)",
          transition:"opacity 2s ease, transform 2s ease",
          margin:0,
        }}>
          a himalayan intelligence experience
        </p>

        {/* Main title */}
        <h1 style={{
          color:"#ffffff",
          fontSize:"clamp(1.4rem, 4vw, 3rem)",
          fontWeight:300,
          letterSpacing:"0.12em",
          textAlign:"center",
          lineHeight:1.3,
          textShadow:"0 0 60px rgba(100,160,255,0.4), 0 2px 20px rgba(0,0,0,0.8)",
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(20px)",
          transition:"opacity 2.5s ease 0.3s, transform 2.5s ease 0.3s",
          margin:0, padding:"0 2rem",
          maxWidth:"800px",
        }}>
          Himalayan Guest Experience<br/>
          <span style={{ color:"#7ab3f0", fontStyle:"italic" }}>Intelligence Platform</span>
        </h1>

        {/* Tagline */}
        <p style={{
          color:"rgba(160,195,240,0.6)",
          fontSize:"clamp(0.65rem, 1.1vw, 0.8rem)",
          letterSpacing:"0.25em",
          textTransform:"uppercase",
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(12px)",
          transition:"opacity 2s ease 0.8s, transform 2s ease 0.8s",
          margin:0,
        }}>
          AI-powered review intelligence · sentiment · themes · insights
        </p>

        {/* Enter button */}
        <button
          onClick={handleEnter}
          style={{
            marginTop:"2rem",
            padding:"0.75rem 2.5rem",
            background:"transparent",
            border:"1px solid rgba(120,180,255,0.5)",
            color:"rgba(180,215,255,0.9)",
            fontSize:"0.75rem",
            letterSpacing:"0.35em",
            textTransform:"uppercase",
            cursor:"pointer",
            fontFamily:"inherit",
            opacity: showButton ? 1 : 0,
            transform: showButton ? "translateY(0)" : "translateY(10px)",
            transition:"opacity 1.5s ease, transform 1.5s ease, background 0.3s, border-color 0.3s",
            backdropFilter:"blur(4px)",
          }}
          onMouseEnter={e => {
            e.target.style.background = "rgba(100,160,255,0.15)";
            e.target.style.borderColor = "rgba(120,180,255,0.9)";
          }}
          onMouseLeave={e => {
            e.target.style.background = "transparent";
            e.target.style.borderColor = "rgba(120,180,255,0.5)";
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default CinematicIntro;
