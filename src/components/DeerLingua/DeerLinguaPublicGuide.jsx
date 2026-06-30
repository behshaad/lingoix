import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./DeerLinguaPublicGuide.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const hasPersian = (value) => /[\u0600-\u06FF]/.test(value);

const replyToPreviewMessage = (message, language) => {
  const isPersian = language === "fa" || hasPersian(message);
  const lower = message.toLowerCase();
  if (isPersian) {
    if (message.includes("درس") || message.includes("تمرین")) {
      return "من مسیر کوتاه DeerLingua را پیشنهاد می‌کنم: یک پرسش، بازخورد فوری، XP و مرور دوباره برای پاسخ‌های سخت.";
    }
    return "سلام، من DeerLingua هستم. در نسخه نمایشی می‌توانم فارسی پاسخ بدهم و مسیر یادگیری آلمانی را توضیح بدهم.";
  }
  if (lower.includes("lesson") || lower.includes("practice")) {
    return "I guide short German practice: one focused question, instant feedback, XP, and a review nudge for anything tricky.";
  }
  return "I’m DeerLingua, the public preview of Lingoix’s AI deer guide. Try the mini lesson, then create a learner profile for the full path.";
};

const DeerLinguaPublicCharacter = ({ state, focusTarget }) => {
  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const headRef = useRef(null);
  const earARef = useRef(null);
  const earBRef = useRef(null);
  const tailRef = useRef(null);
  const foreLegRef = useRef(null);
  const backLegRef = useRef(null);
  const eyeRef = useRef(null);
  const particlesRef = useRef([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frameId;
    let last = performance.now();
    let phase = 0;
    let position = { x: window.innerWidth * 0.68, y: window.innerHeight * 0.38 };
    let destination = { ...position };
    let nextMoveAt = performance.now() + 900;
    let facing = -1;

    const focusedRect = () => {
      if (!focusTarget) return null;
      return document.querySelector(focusTarget)?.getBoundingClientRect() || null;
    };

    const chooseDestination = () => {
      const margin = window.innerWidth < 720 ? 18 : 38;
      const maxX = Math.max(window.innerWidth - 230, margin);
      const maxY = Math.max(window.innerHeight - 220, margin);
      const rect = focusedRect();
      if (rect) {
        const preferRight = rect.left < window.innerWidth * 0.58;
        destination = {
          x: clamp(preferRight ? rect.right + 26 : rect.left - 220, margin, maxX),
          y: clamp(rect.top + rect.height * 0.18, margin, maxY),
        };
        return;
      }

      const anchors = [
        { x: maxX, y: margin + 80 },
        { x: maxX, y: window.innerHeight * 0.52 },
        { x: window.innerWidth * 0.54, y: maxY },
        { x: margin, y: window.innerHeight * 0.62 },
      ];
      destination = anchors[Math.floor(Math.random() * anchors.length)];
    };

    const handlePointer = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
      if (state === "curious") {
        destination = {
          x: clamp(event.clientX + 36, 18, window.innerWidth - 210),
          y: clamp(event.clientY - 90, 18, window.innerHeight - 220),
        };
      }
    };

    const animate = (now) => {
      const dt = clamp((now - last) / 16.67, 0.5, 2);
      last = now;
      phase += 0.06 * dt;

      if (now > nextMoveAt || state === "guiding" || state === "teaching") {
        chooseDestination();
        nextMoveAt = now + 3000 + Math.random() * 2600;
      }

      const dx = destination.x - position.x;
      const dy = destination.y - position.y;
      const speed = state === "guiding" ? 0.035 : state === "celebrating" ? 0.018 : 0.022;
      position.x += dx * speed * dt;
      position.y += dy * speed * dt;
      if (Math.abs(dx) > 2) facing = dx > 0 ? 1 : -1;

      const walking = Math.abs(dx) + Math.abs(dy) > 18;
      const jump = state === "celebrating" ? Math.abs(Math.sin(phase * 5)) * -18 : 0;
      const think = state === "teaching" ? Math.sin(phase * 2) * 4 : 0;
      const react = state === "reacting" ? Math.sin(phase * 5.5) * 4 : 0;
      const pointerY = clamp((pointerRef.current.y - position.y) / 48, -9, 9);
      const bounce = walking ? Math.abs(Math.sin(phase * 5)) * -5 : Math.sin(phase * 1.1) * 2;

      root.style.transform = `translate3d(${position.x}px, ${position.y + jump}px, 0) scaleX(${facing})`;
      bodyRef.current.style.transform = `translate3d(0, ${bounce}px, 0) rotate(${react}deg)`;
      headRef.current.style.transform = `rotate(${pointerY + think}deg)`;
      earARef.current.style.transform = `rotate(${Math.sin(phase * 2.4) * 8 - 10}deg)`;
      earBRef.current.style.transform = `rotate(${Math.cos(phase * 2.1) * 8 + 10}deg)`;
      tailRef.current.style.transform = `rotate(${Math.sin(phase * 4) * (state === "celebrating" ? 24 : 10)}deg)`;
      foreLegRef.current.style.transform = `rotate(${walking ? Math.sin(phase * 5) * 25 : Math.sin(phase) * 3}deg)`;
      backLegRef.current.style.transform = `rotate(${walking ? Math.sin(phase * 5 + Math.PI) * 25 : Math.cos(phase) * 3}deg)`;
      eyeRef.current.style.transform = `scaleY(${Math.sin(phase * 0.72) > 0.97 ? 0.08 : 1})`;
      particlesRef.current.forEach((particle, index) => {
        if (!particle) return;
        particle.style.transform = `translate3d(${Math.cos(phase + index) * 10}px, ${Math.sin(phase * 1.4 + index) * 13}px, 0)`;
      });

      frameId = window.requestAnimationFrame(animate);
    };

    chooseDestination();
    window.addEventListener("pointermove", handlePointer, { passive: true });
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.cancelAnimationFrame(frameId);
    };
  }, [focusTarget, state]);

  return (
    <div ref={rootRef} className={`deerlingua-public-deer deerlingua-public-deer--${state}`} aria-hidden="true">
      <svg viewBox="0 0 310 230" className="deerlingua-public-deer__svg">
        <defs>
          <filter id="public-deer-glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="public-deer-body" cx="48%" cy="32%" r="74%">
            <stop stopColor="#ffffff" stopOpacity="0.82" />
            <stop offset="0.45" stopColor="#7dd3fc" stopOpacity="0.38" />
            <stop offset="1" stopColor="#1d4ed8" stopOpacity="0.12" />
          </radialGradient>
          <linearGradient id="public-deer-line" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#bae6fd" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {[...Array(18)].map((_, index) => (
          <circle
            key={index}
            ref={(node) => {
              particlesRef.current[index] = node;
            }}
            className="deerlingua-public-deer__particle"
            cx={34 + (index * 21) % 238}
            cy={24 + (index * 31) % 158}
            r={index % 4 === 0 ? 3 : 1.8}
          />
        ))}
        <g ref={bodyRef} filter="url(#public-deer-glow)" className="deerlingua-public-deer__body">
          <path className="deerlingua-public-deer__fill" d="M65 124 C79 78, 144 55, 204 72 C241 82, 258 112, 235 139 C212 166, 143 160, 93 148 C70 143, 56 137, 65 124 Z" />
          <path className="deerlingua-public-deer__line deerlingua-public-deer__spine" d="M70 121 C101 87, 151 72, 203 78 C229 81, 246 100, 244 121" />
          <g ref={headRef} className="deerlingua-public-deer__head">
            <path className="deerlingua-public-deer__fill" d="M201 78 C221 39, 263 43, 277 76 C286 98, 268 118, 242 114 C221 111, 208 96, 201 78 Z" />
            <path ref={earARef} className="deerlingua-public-deer__line deerlingua-public-deer__ear" d="M222 60 C215 37, 199 27, 183 23" />
            <path ref={earBRef} className="deerlingua-public-deer__line deerlingua-public-deer__ear" d="M248 61 C261 38, 282 30, 299 34" />
            <path className="deerlingua-public-deer__line" d="M222 51 C227 24, 213 12, 195 8 M241 53 C250 23, 272 13, 292 7 M221 38 C205 34, 193 36, 180 43 M254 39 C265 31, 279 30, 300 35" />
            <g ref={eyeRef} className="deerlingua-public-deer__eye">
              <circle cx="263" cy="81" r="3.6" />
            </g>
            <path className="deerlingua-public-deer__muzzle" d="M262 94 C273 96, 278 103, 270 109" />
          </g>
          <path ref={tailRef} className="deerlingua-public-deer__line deerlingua-public-deer__tail" d="M68 115 C38 95, 33 64, 55 49 C47 77, 50 101, 75 125" />
          <path ref={foreLegRef} className="deerlingua-public-deer__line deerlingua-public-deer__leg" d="M203 139 C201 169, 209 191, 197 214" />
          <path className="deerlingua-public-deer__line deerlingua-public-deer__leg" d="M226 135 C243 164, 247 189, 263 211" />
          <path ref={backLegRef} className="deerlingua-public-deer__line deerlingua-public-deer__leg" d="M107 143 C91 168, 82 190, 63 211" />
          <path className="deerlingua-public-deer__line deerlingua-public-deer__leg" d="M137 148 C146 172, 148 191, 164 213" />
        </g>
      </svg>
    </div>
  );
};

const DeerLinguaPublicGuide = ({ focusTarget }) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [state, setState] = useState("idle");
  const isRtl = i18n.language === "fa";

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-visitor`, role: "visitor", text: trimmed },
      { id: `${Date.now()}-deer`, role: "deer", text: replyToPreviewMessage(trimmed, i18n.language) },
    ]);
    setInput("");
    setState("teaching");
    window.setTimeout(() => setState("idle"), 1300);
  };

  useEffect(() => {
    setState(focusTarget ? "guiding" : "idle");
  }, [focusTarget]);

  useEffect(() => {
    const handleReaction = (event) => {
      const reaction = event.detail?.type || "reacting";
      setState(reaction);
      window.setTimeout(() => setState(focusTarget ? "guiding" : "idle"), reaction === "celebrating" ? 1600 : 1100);
    };
    window.addEventListener("deerlingua:public-reaction", handleReaction);
    return () => window.removeEventListener("deerlingua:public-reaction", handleReaction);
  }, [focusTarget]);

  return (
    <aside className="deerlingua-public-guide" dir={isRtl ? "rtl" : "ltr"}>
      <DeerLinguaPublicCharacter state={state} focusTarget={focusTarget} />
      {open && (
        <section className="deerlingua-public-chat" aria-label={t("home.deer.chatLabel")}>
          <header>
            <span>
              <Sparkles size={16} aria-hidden="true" />
              {t("home.deer.name")}
            </span>
            <button type="button" onClick={() => setOpen(false)}>
              {t("close")}
            </button>
          </header>
          <div className="deerlingua-public-chat__messages">
            <p className="deerlingua-public-chat__bubble deerlingua-public-chat__bubble--deer">
              {t("home.deer.welcome")}
            </p>
            {messages.map((message) => (
              <p
                key={message.id}
                dir={hasPersian(message.text) ? "rtl" : "ltr"}
                className={`deerlingua-public-chat__bubble deerlingua-public-chat__bubble--${message.role}`}
              >
                {message.text}
              </p>
            ))}
          </div>
          <div className="deerlingua-public-chat__composer">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onFocus={() => setState("curious")}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              placeholder={t("home.deer.placeholder")}
              dir={hasPersian(input) || isRtl ? "rtl" : "ltr"}
            />
            <button type="button" onClick={sendMessage} aria-label={t("deerLingua.send")}>
              <Send size={17} />
            </button>
          </div>
        </section>
      )}
      <button
        type="button"
        className="deerlingua-public-launcher"
        onClick={() => {
          setOpen((current) => !current);
          setState(open ? "idle" : "teaching");
        }}
      >
        <MessageCircle size={18} aria-hidden="true" />
        {t("home.deer.ask")}
      </button>
    </aside>
  );
};

export default DeerLinguaPublicGuide;
