import { useEffect, useRef, useState } from "react";

export const useParallax = (speed = 0.3, mouse = false) => {
  const ref = useRef(null);
  useEffect(() => {
    let mx = 0, my = 0, raf;
    const update = () => {
      if (!ref.current) return;
      const tx = mouse ? mx * 15 : 0;
      const ty = -window.scrollY * speed + (mouse ? my * 10 : 0);
      ref.current.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      raf = requestAnimationFrame(update);
    };
    const onMouse = (e) => {
      mx = (e.clientX/window.innerWidth  - 0.5);
      my = (e.clientY/window.innerHeight - 0.5);
    };
    raf = requestAnimationFrame(update);
    if (mouse) window.addEventListener("mousemove", onMouse);
    return () => { cancelAnimationFrame(raf); if (mouse) window.removeEventListener("mousemove", onMouse); };
  }, [speed, mouse]);
  return ref;
};

export const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};
