import { useEffect, useRef } from "react";
import * as THREE from "three";

const KomorebiEffect = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const W = window.innerWidth;
    const H = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Build a soft light-patch texture ────────────────────────────────
    const buildPatchTexture = (r1, r2, col1, col2) => {
      const sz = 256;
      const c = document.createElement("canvas");
      c.width = sz; c.height = sz;
      const cx = c.getContext("2d");
      const g = cx.createRadialGradient(sz/2, sz/2, 0, sz/2, sz/2, sz/2);
      g.addColorStop(0,   col1);
      g.addColorStop(r1,  col2);
      g.addColorStop(r2,  "rgba(255,220,120,0.04)");
      g.addColorStop(1,   "rgba(255,200,80,0)");
      cx.fillStyle = g;
      cx.beginPath();
      cx.ellipse(sz/2, sz/2, sz/2, sz/2*0.6, 0, 0, Math.PI*2);
      cx.fill();
      return new THREE.CanvasTexture(c);
    };

    // ── Build a leaf-shadow texture ─────────────────────────────────────
    const buildLeafTexture = () => {
      const sz = 128;
      const c = document.createElement("canvas");
      c.width = sz; c.height = sz;
      const cx = c.getContext("2d");
      cx.fillStyle = "rgba(0,0,0,0)";
      cx.fillRect(0, 0, sz, sz);
      // draw a simple leaf shape
      cx.beginPath();
      cx.moveTo(sz/2, 10);
      cx.bezierCurveTo(sz*0.9, sz*0.2, sz*0.95, sz*0.7, sz/2, sz-10);
      cx.bezierCurveTo(sz*0.05, sz*0.7, sz*0.1, sz*0.2, sz/2, 10);
      cx.closePath();
      cx.fillStyle = "rgba(10,40,10,0.18)";
      cx.fill();
      return new THREE.CanvasTexture(c);
    };

    const texA = buildPatchTexture(0.3, 0.7, "rgba(255,230,100,0.22)", "rgba(255,210,80,0.10)");
    const texB = buildPatchTexture(0.2, 0.6, "rgba(255,245,180,0.30)", "rgba(255,220,90,0.12)");
    const texC = buildPatchTexture(0.4, 0.8, "rgba(255,200,60,0.14)",  "rgba(255,180,50,0.06)");
    const leafTex = buildLeafTexture();

    const patches = [];
    const leaves  = [];

    // ── Light patches ────────────────────────────────────────────────────
    const patchDefs = [
      { tex: texA, count: 6,  wRange:[120,220], hRange:[70,130],  speed:0.00012, alphaRange:[0.55,0.90] },
      { tex: texB, count: 5,  wRange:[80, 160], hRange:[50,90],   speed:0.00018, alphaRange:[0.40,0.75] },
      { tex: texC, count: 8,  wRange:[50, 110], hRange:[30,70],   speed:0.00022, alphaRange:[0.25,0.55] },
    ];

    patchDefs.forEach(({ tex, count, wRange, hRange, speed, alphaRange }) => {
      for (let i = 0; i < count; i++) {
        const pw = wRange[0] + Math.random() * (wRange[1]-wRange[0]);
        const ph = hRange[0] + Math.random() * (hRange[1]-hRange[0]);
        const geo = new THREE.PlaneGeometry(pw, ph);
        const mat = new THREE.MeshBasicMaterial({
          map: tex, transparent: true,
          opacity: alphaRange[0] + Math.random()*(alphaRange[1]-alphaRange[0]),
          depthWrite: false, blending: THREE.AdditiveBlending,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random()-0.5)*W,
          (Math.random()-0.5)*H,
          Math.random()*2
        );
        mesh.rotation.z = (Math.random()-0.5)*0.6;
        scene.add(mesh);
        patches.push({
          mesh,
          baseX: mesh.position.x,
          baseY: mesh.position.y,
          phase: Math.random()*Math.PI*2,
          phaseY: Math.random()*Math.PI*2,
          speed,
          driftX: (40 + Math.random()*60),
          driftY: (20 + Math.random()*35),
          pulsePhase: Math.random()*Math.PI*2,
          pulseSpeed: 0.0004 + Math.random()*0.0005,
          baseOpacity: mat.opacity,
          rotSpeed: (Math.random()-0.5)*0.0002,
        });
      }
    });

    // ── Leaf shadows (fall slowly downward) ──────────────────────────────
    for (let i = 0; i < 12; i++) {
      const sz = 20 + Math.random()*40;
      const geo = new THREE.PlaneGeometry(sz, sz*1.6);
      const mat = new THREE.MeshBasicMaterial({
        map: leafTex, transparent: true,
        opacity: 0.08 + Math.random()*0.12,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random()-0.5)*W,
        H/2 + Math.random()*H,
        0.5
      );
      mesh.rotation.z = Math.random()*Math.PI*2;
      scene.add(mesh);
      leaves.push({
        mesh,
        vy: -(0.08 + Math.random()*0.18),
        vx: (Math.random()-0.5)*0.06,
        rotV: (Math.random()-0.5)*0.003,
      });
    }

    // ── Mouse parallax ───────────────────────────────────────────────────
    let mx = 0, my = 0;
    const onMouseMove = (e) => {
      mx = (e.clientX/W - 0.5);
      my = (e.clientY/H - 0.5);
    };
    window.addEventListener("mousemove", onMouseMove);

    let animId;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t++;

      // animate light patches
      patches.forEach(p => {
        const { mesh, baseX, baseY, phase, phaseY, speed, driftX, driftY,
                pulsePhase, pulseSpeed, baseOpacity, rotSpeed } = p;
        const tt = t * speed * 1000;
        mesh.position.x = baseX + Math.sin(tt + phase)  * driftX + mx * 30;
        mesh.position.y = baseY + Math.cos(tt + phaseY) * driftY - my * 20;
        mesh.rotation.z += rotSpeed;
        // gentle opacity pulse
        mesh.material.opacity = baseOpacity *
          (0.75 + 0.25 * Math.sin(t * pulseSpeed * 1000 + pulsePhase));
      });

      // animate falling leaves
      leaves.forEach(l => {
        l.mesh.position.y += l.vy;
        l.mesh.position.x += l.vx + Math.sin(t*0.01)*0.05;
        l.mesh.rotation.z += l.rotV;
        if (l.mesh.position.y < -H/2 - 100) {
          l.mesh.position.y = H/2 + 50;
          l.mesh.position.x = (Math.random()-0.5)*W;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = window.innerWidth, nh = window.innerHeight;
      camera.left = -nw/2; camera.right = nw/2;
      camera.top = nh/2;   camera.bottom = -nh/2;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{
      position:"fixed", top:0, left:0,
      width:"100vw", height:"100vh",
      pointerEvents:"none", zIndex:9999,
    }}/>
  );
};

export default KomorebiEffect;
