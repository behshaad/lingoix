import { useEffect, useRef } from "react";
import "./GuardianStag.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const GuardianStag = () => {
  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const headRef = useRef(null);
  const tailRef = useRef(null);
  const trailRef = useRef(null);
  const foreLegARef = useRef(null);
  const foreLegBRef = useRef(null);
  const backLegARef = useRef(null);
  const backLegBRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    if (prefersReducedMotion()) {
      root.style.setProperty("--stag-opacity", "0.72");
      root.style.transform = "translate3d(0, 42vh, 0)";
      return undefined;
    }

    let frameId;
    let position = window.innerHeight * 0.48;
    let targetPosition = position;
    let velocity = 0;
    let direction = 1;
    let phase = 0;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let lastFrameTime = performance.now();
    let stopTimer;
    let isScrolling = false;

    const setMoving = (moving) => {
      isScrolling = moving;
      root.classList.toggle("guardian-stag--running", moving);
      root.style.setProperty("--stag-opacity", moving ? "0.84" : "0.68");
      if (trailRef.current) {
        trailRef.current.style.opacity = moving ? "0.7" : "0";
      }
    };

    const handleScroll = () => {
      const now = performance.now();
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY;
      const elapsed = Math.max(now - lastScrollTime, 16);

      if (Math.abs(delta) > 0.5) {
        direction = delta > 0 ? 1 : -1;
        const speed = clamp(Math.abs(delta) / elapsed, 0.15, 3.2);
        velocity = direction * (1.7 + speed * 4.4);
        targetPosition += velocity * 2.8;
        setMoving(true);
      }

      lastScrollY = scrollY;
      lastScrollTime = now;
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => setMoving(false), 82);
    };

    const animate = (now) => {
      const deltaTime = clamp((now - lastFrameTime) / 16.67, 0.5, 2);
      lastFrameTime = now;

      const rootHeight = root.offsetHeight || 170;
      const minY = 18;
      const maxY = Math.max(window.innerHeight - rootHeight - 18, minY);
      targetPosition = clamp(targetPosition, minY, maxY);
      position += (targetPosition - position) * 0.16;

      const visualSpeed = clamp(Math.abs(velocity), 0, 16);
      const runPower = isScrolling ? clamp(visualSpeed / 10, 0.35, 1.35) : 0;
      phase += (isScrolling ? 0.22 + runPower * 0.18 : 0.045) * deltaTime;
      velocity *= 0.88;

      const stride = Math.sin(phase);
      const counterStride = Math.sin(phase + Math.PI);
      const bounce = isScrolling ? Math.abs(Math.sin(phase * 2)) * -5 * runPower : Math.sin(phase) * 1.4;
      const lean = isScrolling ? direction * 3.5 : Math.sin(phase * 0.7) * 0.9;
      const facing = direction > 0 ? 1 : -1;

      root.style.transform = `translate3d(0, ${position}px, 0) scaleX(${facing})`;
      if (bodyRef.current) {
        bodyRef.current.style.transform = `translate3d(0, ${bounce}px, 0) rotate(${lean}deg)`;
      }
      if (headRef.current) {
        headRef.current.style.transform = `rotate(${isScrolling ? -direction * 5 + stride * 4 : Math.sin(phase) * 2}deg)`;
      }
      if (tailRef.current) {
        tailRef.current.style.transform = `rotate(${isScrolling ? -direction * 12 + counterStride * 8 : Math.sin(phase * 0.8) * 4}deg)`;
      }

      const legSwing = isScrolling ? 24 + runPower * 12 : 3;
      const legLift = isScrolling ? 8 + runPower * 4 : 0;
      if (foreLegARef.current) {
        foreLegARef.current.style.transform = `rotate(${stride * legSwing}deg) translateY(${Math.max(0, stride) * -legLift}px)`;
      }
      if (foreLegBRef.current) {
        foreLegBRef.current.style.transform = `rotate(${counterStride * legSwing}deg) translateY(${Math.max(0, counterStride) * -legLift}px)`;
      }
      if (backLegARef.current) {
        backLegARef.current.style.transform = `rotate(${counterStride * legSwing}deg) translateY(${Math.max(0, counterStride) * -legLift}px)`;
      }
      if (backLegBRef.current) {
        backLegBRef.current.style.transform = `rotate(${stride * legSwing}deg) translateY(${Math.max(0, stride) * -legLift}px)`;
      }

      particlesRef.current.forEach((particle, index) => {
        if (!particle) return;
        const drift = phase * (0.55 + index * 0.04);
        particle.style.transform = `translate3d(${Math.cos(drift + index) * 10}px, ${Math.sin(drift * 1.4 + index) * 12}px, 0)`;
        particle.style.opacity = `${isScrolling ? 0.42 + (index % 3) * 0.12 : 0.2}`;
      });

      frameId = window.requestAnimationFrame(animate);
    };

    root.style.transform = `translate3d(0, ${position}px, 0)`;
    window.addEventListener("scroll", handleScroll, { passive: true });
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.clearTimeout(stopTimer);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="guardian-stag"
      aria-hidden="true"
      style={{ "--stag-opacity": 0.68 }}
    >
      <svg
        className="guardian-stag__svg"
        viewBox="0 0 260 170"
        role="img"
      >
        <defs>
          <filter id="guardian-stag-bloom" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.42 0 0 0 0 0.82 0 0 0 0 1 0 0 0 0.85 0"
              result="blueGlow"
            />
            <feMerge>
              <feMergeNode in="blueGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="guardian-stag-line" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#bfecff" />
            <stop offset="1" stopColor="#60a5fa" />
          </linearGradient>
          <radialGradient id="guardian-stag-fill" cx="45%" cy="35%" r="70%">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.68" />
            <stop offset="0.42" stopColor="#bae6fd" stopOpacity="0.34" />
            <stop offset="1" stopColor="#2563eb" stopOpacity="0.08" />
          </radialGradient>
        </defs>

        <g ref={trailRef} className="guardian-stag__trail">
          <path d="M34 91 C5 76, 0 123, 42 111 C70 103, 86 93, 112 96" />
          <path d="M42 72 C16 61, 14 32, 55 48 C76 56, 84 70, 112 72" />
        </g>

        {[...Array(13)].map((_, index) => (
          <circle
            key={index}
            ref={(node) => {
              particlesRef.current[index] = node;
            }}
            className="guardian-stag__particle"
            cx={34 + (index * 17) % 190}
            cy={28 + (index * 23) % 112}
            r={index % 4 === 0 ? 2.8 : 1.8}
          />
        ))}

        <g ref={bodyRef} className="guardian-stag__body" filter="url(#guardian-stag-bloom)">
          <path
            className="guardian-stag__body-fill"
            d="M72 87 C82 59, 127 49, 170 59 C196 65, 211 82, 203 101 C196 117, 165 122, 125 116 C95 112, 67 107, 72 87 Z"
          />
          <path
            className="guardian-stag__line guardian-stag__spine"
            d="M74 88 C96 66, 133 58, 170 64 C190 67, 204 80, 204 96"
          />
          <g ref={headRef} className="guardian-stag__head">
            <path
              className="guardian-stag__body-fill"
              d="M181 64 C194 44, 218 42, 229 58 C235 67, 232 80, 220 86 C206 92, 189 81, 181 64 Z"
            />
            <path
              className="guardian-stag__line"
              d="M195 51 C197 32, 184 20, 171 15 M201 50 C205 30, 221 22, 235 17 M196 39 C187 35, 178 34, 168 36 M209 39 C217 33, 228 30, 239 31 M217 60 C224 63, 227 69, 225 76"
            />
            <circle className="guardian-stag__eye" cx="219" cy="62" r="2.2" />
          </g>
          <g ref={tailRef} className="guardian-stag__tail">
            <path
              className="guardian-stag__line"
              d="M75 82 C50 63, 45 42, 62 29 C53 53, 54 69, 77 91"
            />
          </g>
          <g className="guardian-stag__legs">
            <path ref={foreLegARef} className="guardian-stag__line guardian-stag__leg" d="M173 108 C170 130, 174 145, 165 160" />
            <path ref={foreLegBRef} className="guardian-stag__line guardian-stag__leg" d="M188 104 C197 126, 197 142, 209 158" />
            <path ref={backLegARef} className="guardian-stag__line guardian-stag__leg" d="M99 105 C88 126, 80 141, 68 156" />
            <path ref={backLegBRef} className="guardian-stag__line guardian-stag__leg" d="M119 111 C125 131, 124 146, 135 160" />
          </g>
          <path className="guardian-stag__line" d="M90 101 C117 112, 156 114, 190 103" />
        </g>
      </svg>
    </div>
  );
};

export default GuardianStag;
