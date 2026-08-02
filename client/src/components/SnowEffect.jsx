import { useEffect, useRef } from "react";
import * as THREE from "three";

const SnowEffect = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.035); // depth fog for 3D depth

    const camera = new THREE.PerspectiveCamera(90, w / h, 0.1, 200);
    camera.position.z = 0;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Snowflake texture
    const canvas = document.createElement("canvas");
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0,   "rgba(255,255,255,1)");
    grad.addColorStop(0.2, "rgba(220,240,255,0.95)");
    grad.addColorStop(0.5, "rgba(200,230,255,0.6)");
    grad.addColorStop(1,   "rgba(180,220,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(64, 64, 64, 0, Math.PI * 2);
    ctx.fill();
    const flakeTexture = new THREE.CanvasTexture(canvas);

    // Create 3 layers of snow — near, mid, far
    const layers = [
      { count: 300, zMin: -5,   zMax: 5,   size: 0.35, speed: 0.08, opacity: 0.95, drift: 0.012 },
      { count: 500, zMin: -30,  zMax: -5,  size: 0.18, speed: 0.045, opacity: 0.7, drift: 0.007 },
      { count: 800, zMin: -100, zMax: -30, size: 0.08, speed: 0.02,  opacity: 0.4, drift: 0.003 },
    ];

    const particleSystems = [];

    layers.forEach(({ count, zMin, zMax, size, speed, opacity, drift }) => {
      const positions = new Float32Array(count * 3);
      const meta = [];

      for (let i = 0; i < count; i++) {
        const z = zMin + Math.random() * (zMax - zMin);
        // Spread x/y based on depth so it fills the FOV
        const spread = Math.abs(z) * 1.2 + 5;
        positions[i * 3]     = (Math.random() - 0.5) * spread * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 2;
        positions[i * 3 + 2] = z;
        meta.push({
          vy: -(speed * (0.5 + Math.random())),
          vx: (Math.random() - 0.5) * drift,
          driftPhase: Math.random() * Math.PI * 2,
          driftFreq:  0.003 + Math.random() * 0.004,
          driftAmp:   drift * (0.5 + Math.random()),
        });
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const mat = new THREE.PointsMaterial({
        size,
        map: flakeTexture,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: 0xddeeff,
      });

      const pts = new THREE.Points(geo, mat);
      scene.add(pts);
      particleSystems.push({ pts, geo, meta, count, zMin, zMax, speed });
    });

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.3;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.15;
    };
    window.addEventListener("mousemove", onMouseMove);

    let animId;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;

      // Subtle camera sway following mouse
      camera.position.x += (mouseX - camera.position.x) * 0.03;
      camera.position.y += (-mouseY - camera.position.y) * 0.03;
      camera.lookAt(camera.position.x * 0.5, camera.position.y * 0.5, -50);

      particleSystems.forEach(({ geo, meta, count, zMin, zMax }) => {
        const pos = geo.attributes.position.array;
        for (let i = 0; i < count; i++) {
          const m = meta[i];
          m.driftPhase += m.driftFreq;

          pos[i * 3]     += m.vx + Math.sin(m.driftPhase) * m.driftAmp;
          pos[i * 3 + 1] += m.vy;

          // Reset snowflake when it falls out of view
          if (pos[i * 3 + 1] < -60) {
            const z = pos[i * 3 + 2];
            const spread = Math.abs(z) * 1.2 + 5;
            pos[i * 3]     = (Math.random() - 0.5) * spread * 2;
            pos[i * 3 + 1] = 60;
          }
        }
        geo.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      particleSystems.forEach(({ geo, pts }) => {
        geo.dispose();
        pts.material.dispose();
      });
      flakeTexture.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

export default SnowEffect;
