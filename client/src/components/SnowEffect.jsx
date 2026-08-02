import { useEffect, useRef } from "react";
import * as THREE from "three";

const SnowEffect = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // transparent background
    mount.appendChild(renderer.domElement);

    // Snow particles
    const PARTICLE_COUNT = 600;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      velocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: -(Math.random() * 0.02 + 0.005),
        drift: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.01 + 0.003,
        size: Math.random() * 0.8 + 0.2,
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Circular snowflake texture
    const canvas = document.createElement("canvas");
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(220,240,255,0.8)");
    gradient.addColorStop(1, "rgba(200,230,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.12,
      map: texture,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false,
      color: 0xddeeff,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation
    let animId;
    const pos = geometry.attributes.position.array;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const v = velocities[i];
        v.drift += v.driftSpeed;
        pos[i * 3]     += v.x + Math.sin(v.drift) * 0.003;
        pos[i * 3 + 1] += v.y;
        pos[i * 3 + 2] += 0;

        // Reset if fallen below screen
        if (pos[i * 3 + 1] < -10) {
          pos[i * 3]     = (Math.random() - 0.5) * 20;
          pos[i * 3 + 1] = 10;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
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
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
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
