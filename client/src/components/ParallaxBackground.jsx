/**
 * ParallaxBackground — global Three.js canvas that sits behind all pages.
 * Creates floating 3D particles + depth layers that respond to scroll & mouse.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

const ParallaxBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = window.innerWidth, H = window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 500);
    camera.position.z = 80;

    // ── Build a glowing orb texture ───────────────────────────────────
    const makeOrb = (color1, color2, size = 128) => {
      const c = document.createElement("canvas");
      c.width = size; c.height = size;
      const ctx = c.getContext("2d");
      const g = ctx.createRadialGradient(size/2,size/2,0, size/2,size/2,size/2);
      g.addColorStop(0,   color1);
      g.addColorStop(0.4, color2);
      g.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,size,size);
      return new THREE.CanvasTexture(c);
    };

    const texBlue   = makeOrb("rgba(100,160,255,0.9)",  "rgba(60,120,220,0.3)");
    const texTeal   = makeOrb("rgba(80,220,200,0.8)",   "rgba(40,180,160,0.25)");
    const texWhite  = makeOrb("rgba(255,255,255,0.95)", "rgba(200,230,255,0.3)", 64);

    // ── Layer definitions: z controls depth parallax speed ───────────
    const layerDefs = [
      // Far background — slow, large, subtle
      { tex:texBlue,  count:8,  sizeR:[18,35], zR:[-80,-50], opR:[0.12,0.22], speedMul:0.15 },
      // Mid layer
      { tex:texTeal,  count:12, sizeR:[8,20],  zR:[-40,-15], opR:[0.18,0.32], speedMul:0.4  },
      // Near small particles
      { tex:texWhite, count:25, sizeR:[1.5,5], zR:[-10,10],  opR:[0.25,0.55], speedMul:0.8  },
    ];

    const allParticles = [];

    layerDefs.forEach(({ tex, count, sizeR, zR, opR, speedMul }) => {
      for (let i = 0; i < count; i++) {
        const sz = sizeR[0] + Math.random()*(sizeR[1]-sizeR[0]);
        const geo = new THREE.PlaneGeometry(sz, sz);
        const mat = new THREE.MeshBasicMaterial({
          map: tex, transparent: true,
          opacity: opR[0] + Math.random()*(opR[1]-opR[0]),
          depthWrite: false, blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const z = zR[0] + Math.random()*(zR[1]-zR[0]);
        mesh.position.set(
          (Math.random()-0.5)*200,
          (Math.random()-0.5)*120,
          z
        );
        scene.add(mesh);
        allParticles.push({
          mesh,
          baseX: mesh.position.x,
          baseY: mesh.position.y,
          z,
          speedMul,
          floatPhase: Math.random()*Math.PI*2,
          floatSpeed: 0.0002 + Math.random()*0.0003,
          floatAmpX:  3 + Math.random()*8,
          floatAmpY:  2 + Math.random()*5,
          rotSpeed:  (Math.random()-0.5)*0.001,
          pulsePhase: Math.random()*Math.PI*2,
          pulseSpeed: 0.0003 + Math.random()*0.0004,
          baseOpacity: mat.opacity,
        });
      }
    });

    // ── Mouse & scroll state ──────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    let scrollY = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX/window.innerWidth  - 0.5);
      mouseY = (e.clientY/window.innerHeight - 0.5);
    };
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll",    onScroll, { passive: true });

    let animId, t = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t++;

      // Camera slowly drifts with mouse (whole scene parallax)
      camera.position.x += (mouseX * 12 - camera.position.x) * 0.04;
      camera.position.y += (-mouseY * 8  - camera.position.y) * 0.04;
      // Scroll moves camera down
      const targetCamY = -scrollY * 0.025;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.lookAt(0, camera.position.y * 0.2, 0);

      allParticles.forEach(p => {
        const { mesh, baseX, baseY, speedMul,
                floatPhase, floatSpeed, floatAmpX, floatAmpY,
                rotSpeed, pulsePhase, pulseSpeed, baseOpacity } = p;

        // Float
        mesh.position.x = baseX + Math.sin(t*floatSpeed*1000 + floatPhase) * floatAmpX
                          + mouseX * 15 * speedMul;
        mesh.position.y = baseY + Math.cos(t*floatSpeed*1000 + floatPhase*1.3) * floatAmpY
                          + mouseY * (-10) * speedMul
                          - scrollY * 0.04 * speedMul;
        mesh.rotation.z += rotSpeed;

        // Pulse opacity
        mesh.material.opacity = baseOpacity *
          (0.7 + 0.3 * Math.sin(t * pulseSpeed * 1000 + pulsePhase));
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = window.innerWidth, nh = window.innerHeight;
      camera.aspect = nw/nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{
      position:"fixed", top:0, left:0,
      width:"100vw", height:"100vh",
      pointerEvents:"none", zIndex:0,
    }}/>
  );
};

export default ParallaxBackground;
