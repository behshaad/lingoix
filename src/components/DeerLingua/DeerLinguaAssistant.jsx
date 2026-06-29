import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageCircle, Mic, Send, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AUTH_SESSION_EVENT, loadStoredUser } from "../../services/authSession";
import "./DeerLinguaAssistant.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const hasPersian = (value) => /[\u0600-\u06FF]/.test(value);

const localizedAssistantReply = (message, language) => {
  const isPersian = hasPersian(message) || language === "fa";
  const lower = message.toLowerCase();
  if (isPersian) {
    if (message.includes("گرامر") || message.includes("اشتباه")) {
      return "بیایید آرام پیش برویم. اول جمله را کوتاه کن، فعل را پیدا کن، بعد جای فعل آلمانی را بررسی کنیم.";
    }
    if (message.includes("تمرین") || message.includes("درس")) {
      return "پیشنهاد من: یک درس کوتاه DeerLingua انجام بده و بعد واژه‌هایی را که سخت بودند برای مرور فاصله‌دار نگه می‌داریم.";
    }
    return "من DeerLingua هستم. فعلاً با پاسخ‌های محلی کمک می‌کنم: می‌توانم تمرین پیشنهاد بدهم، معنی جمله را ساده کنم، یا برای آلمانی پایه راهنمایی بدهم.";
  }

  if (lower.includes("grammar") || lower.includes("wrong")) {
    return "Let’s slow it down: find the verb, check the word order, then compare the sentence with the model answer.";
  }
  if (lower.includes("practice") || lower.includes("lesson")) {
    return "Try one short DeerLingua lesson, then I’ll nudge weak answers into your demo review queue.";
  }
  return "I’m DeerLingua. In this prototype I answer locally, guide practice, and react to your lesson choices before a real AI backend is connected.";
};

const initialMessages = [
  {
    id: "welcome",
    role: "assistant",
    text: "Hi, I’m DeerLingua. Ask me about a German phrase, or start a lesson and I’ll react as you practice.",
  },
];

const DeerLinguaCharacter = ({ state, panelOpen }) => {
  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const headRef = useRef(null);
  const leftEarRef = useRef(null);
  const rightEarRef = useRef(null);
  const tailRef = useRef(null);
  const frontLegRef = useRef(null);
  const backLegRef = useRef(null);
  const eyeRef = useRef(null);
  const particlesRef = useRef([]);
  const targetRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    let frameId;
    let last = performance.now();
    let phase = 0;
    let position = {
      x: window.innerWidth - 190,
      y: window.innerHeight - 220,
    };
    let destination = { ...position };
    let nextRoamAt = performance.now() + 2200;
    let facing = -1;

    const chooseDestination = () => {
      const margin = window.innerWidth < 700 ? 18 : 42;
      const maxY = Math.max(window.innerHeight - 210, margin);
      const rightRail = Math.max(window.innerWidth - 230, margin);
      const zones = panelOpen
        ? [
            { x: margin, y: window.innerHeight * 0.24 },
            { x: margin, y: maxY },
            { x: window.innerWidth * 0.48, y: maxY },
          ]
        : [
            { x: rightRail, y: maxY },
            { x: rightRail, y: margin + 42 },
            { x: rightRail, y: window.innerHeight * 0.46 },
            { x: Math.max(window.innerWidth * 0.72, margin), y: maxY },
          ];
      destination = zones[Math.floor(Math.random() * zones.length)];
    };

    const handlePointerMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
    };

    const animate = (now) => {
      const dt = clamp((now - last) / 16.67, 0.5, 2);
      last = now;
      phase += 0.055 * dt;

      if (now > nextRoamAt && !panelOpen && (state === "idle" || state === "exploring")) {
        chooseDestination();
        nextRoamAt = now + 3600 + Math.random() * 3400;
      }

      const dx = destination.x - position.x;
      const dy = destination.y - position.y;
      position.x += dx * 0.018 * dt;
      position.y += dy * 0.018 * dt;
      if (Math.abs(dx) > 2) facing = dx > 0 ? 1 : -1;

      targetRef.current = {
        x: pointerRef.current.x - position.x,
        y: pointerRef.current.y - position.y,
      };

      const walking = Math.abs(dx) + Math.abs(dy) > 14 || state === "walking" || state === "exploring";
      const celebration = state === "celebrating" ? Math.abs(Math.sin(phase * 4)) * -18 : 0;
      const confusion = state === "reacting" ? Math.sin(phase * 5) * 3 : 0;
      const thinking = state === "thinking" ? Math.sin(phase * 2.2) * 5 : 0;
      const bounce = walking ? Math.abs(Math.sin(phase * 5)) * -5 : Math.sin(phase * 1.2) * 2;

      root.style.transform = `translate3d(${position.x}px, ${position.y + celebration}px, 0) scaleX(${facing})`;
      bodyRef.current.style.transform = `translate3d(0, ${bounce}px, 0) rotate(${confusion}deg)`;
      headRef.current.style.transform = `rotate(${clamp(targetRef.current.y / 42, -10, 10) + thinking}deg)`;
      leftEarRef.current.style.transform = `rotate(${Math.sin(phase * 2.7) * 8 - 8}deg)`;
      rightEarRef.current.style.transform = `rotate(${Math.cos(phase * 2.2) * 8 + 8}deg)`;
      tailRef.current.style.transform = `rotate(${Math.sin(phase * 4.1) * (state === "celebrating" ? 22 : 9)}deg)`;
      frontLegRef.current.style.transform = `rotate(${walking ? Math.sin(phase * 5) * 24 : Math.sin(phase) * 3}deg)`;
      backLegRef.current.style.transform = `rotate(${walking ? Math.sin(phase * 5 + Math.PI) * 24 : Math.cos(phase) * 3}deg)`;
      eyeRef.current.style.transform = `scaleY(${Math.sin(phase * 0.7) > 0.97 ? 0.08 : 1})`;

      particlesRef.current.forEach((particle, index) => {
        if (!particle) return;
        particle.style.transform = `translate3d(${Math.cos(phase + index) * 9}px, ${Math.sin(phase * 1.3 + index) * 11}px, 0)`;
      });

      frameId = window.requestAnimationFrame(animate);
    };

    chooseDestination();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.cancelAnimationFrame(frameId);
    };
  }, [panelOpen, state]);

  return (
    <div ref={rootRef} className={`deerlingua-character deerlingua-character--${state}`} aria-hidden="true">
      <svg className="deerlingua-character__svg" viewBox="0 0 260 190">
        <defs>
          <filter id="deerlingua-glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="deerlingua-line" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#bae6fd" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        {[...Array(14)].map((_, index) => (
          <circle
            key={index}
            ref={(node) => {
              particlesRef.current[index] = node;
            }}
            className="deerlingua-character__particle"
            cx={42 + (index * 17) % 180}
            cy={28 + (index * 29) % 132}
            r={index % 3 === 0 ? 2.8 : 1.8}
          />
        ))}
        <g ref={bodyRef} filter="url(#deerlingua-glow)" className="deerlingua-character__body">
          <path className="deerlingua-character__fill" d="M61 102 C73 66, 129 51, 178 64 C209 72, 219 96, 202 115 C184 136, 125 130, 84 121 C66 117, 55 113, 61 102 Z" />
          <path className="deerlingua-character__line" d="M65 101 C94 73, 136 64, 181 70 C199 73, 211 86, 208 101" />
          <g ref={headRef} className="deerlingua-character__head">
            <path className="deerlingua-character__fill" d="M174 68 C190 38, 226 42, 235 68 C241 85, 226 99, 207 96 C190 93, 180 82, 174 68 Z" />
            <path ref={leftEarRef} className="deerlingua-character__line deerlingua-character__ear" d="M191 52 C185 34, 173 26, 160 23" />
            <path ref={rightEarRef} className="deerlingua-character__line deerlingua-character__ear" d="M212 52 C223 33, 238 27, 250 29" />
            <path className="deerlingua-character__line" d="M192 46 C196 25, 185 15, 171 9 M207 47 C215 24, 232 14, 247 8 M190 36 C178 32, 169 33, 159 38 M217 37 C225 31, 236 30, 250 33" />
            <g ref={eyeRef} className="deerlingua-character__eye">
              <circle cx="224" cy="68" r="3" />
            </g>
            <path className="deerlingua-character__muzzle" d="M224 79 C232 81, 235 86, 229 91" />
          </g>
          <path ref={tailRef} className="deerlingua-character__line deerlingua-character__tail" d="M64 95 C42 77, 39 53, 56 42 C49 64, 51 82, 69 103" />
          <path ref={frontLegRef} className="deerlingua-character__line deerlingua-character__leg" d="M175 116 C174 141, 180 160, 170 178" />
          <path className="deerlingua-character__line deerlingua-character__leg" d="M194 112 C207 136, 209 157, 222 176" />
          <path ref={backLegRef} className="deerlingua-character__line deerlingua-character__leg" d="M96 119 C84 140, 76 158, 61 176" />
          <path className="deerlingua-character__line deerlingua-character__leg" d="M121 124 C128 144, 130 160, 143 178" />
        </g>
      </svg>
    </div>
  );
};

const DeerLinguaAssistant = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(() => loadStoredUser());
  const [panelOpen, setPanelOpen] = useState(false);
  const [state, setState] = useState("idle");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const idleTimerRef = useRef(null);
  const stateTimerRef = useRef(null);
  const isRtl = i18n.language === "fa";

  useEffect(() => {
    const handleAuthChange = (event) => setUser(event.detail || loadStoredUser());
    window.addEventListener(AUTH_SESSION_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_SESSION_EVENT, handleAuthChange);
  }, []);

  useEffect(() => {
    const handleReaction = (event) => {
      const reaction = event.detail?.type || "reacting";
      setState(reaction);
      window.clearTimeout(stateTimerRef.current);
      stateTimerRef.current = window.setTimeout(() => setState("idle"), reaction === "celebrating" ? 1700 : 1300);
    };

    window.addEventListener("deerlingua:reaction", handleReaction);
    return () => {
      window.removeEventListener("deerlingua:reaction", handleReaction);
      window.clearTimeout(stateTimerRef.current);
    };
  }, []);

  useEffect(() => {
    window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(() => {
      if (!panelOpen) setState("exploring");
    }, 5000);
    return () => window.clearTimeout(idleTimerRef.current);
  }, [panelOpen, messages.length]);

  const localizedWelcome = useMemo(
    () =>
      i18n.language === "fa"
        ? "سلام، من DeerLingua هستم. درباره آلمانی از من بپرس یا یک درس کوتاه را شروع کن."
        : "Hi, I’m DeerLingua. Ask me about German or start a short lesson.",
    [i18n.language]
  );

  if (user?.role !== "learner") return null;

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const learnerMessage = { id: `${Date.now()}-learner`, role: "learner", text: trimmed };
    setMessages((current) => [...current, learnerMessage]);
    setInput("");
    setState("thinking");
    window.clearTimeout(stateTimerRef.current);
    stateTimerRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: localizedAssistantReply(trimmed, i18n.language),
        },
      ]);
      setState("teaching");
      stateTimerRef.current = window.setTimeout(() => setState("idle"), 1200);
    }, 520);
  };

  return (
    <aside className="deerlingua-assistant" dir={isRtl ? "rtl" : "ltr"}>
      <DeerLinguaCharacter state={state} panelOpen={panelOpen} />

      {panelOpen && (
        <section className="deerlingua-panel" aria-label={t("deerLingua.panelLabel")}>
          <header className="deerlingua-panel__header">
            <div>
              <p>{t("deerLingua.name")}</p>
              <span>{t("deerLingua.status")}</span>
            </div>
            <button type="button" onClick={() => setPanelOpen(false)} aria-label={t("close")}>
              <X size={18} />
            </button>
          </header>

          <div className="deerlingua-panel__messages">
            <div className="deerlingua-panel__message deerlingua-panel__message--assistant">
              {localizedWelcome}
            </div>
            {messages.slice(1).map((message) => (
              <div
                key={message.id}
                className={`deerlingua-panel__message deerlingua-panel__message--${message.role}`}
                dir={hasPersian(message.text) ? "rtl" : "ltr"}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="deerlingua-panel__composer">
            <button
              type="button"
              disabled
              title={t("deerLingua.micSoon")}
              aria-label={t("deerLingua.micSoon")}
            >
              <Mic size={18} />
            </button>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onFocus={() => setState("reacting")}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              placeholder={t("deerLingua.placeholder")}
              dir={hasPersian(input) || isRtl ? "rtl" : "ltr"}
            />
            <button type="button" onClick={sendMessage} aria-label={t("deerLingua.send")}>
              <Send size={18} />
            </button>
          </div>
        </section>
      )}

      <button
        type="button"
        className="deerlingua-launcher"
        onClick={() => {
          setPanelOpen((current) => !current);
          setState(panelOpen ? "idle" : "teaching");
        }}
        aria-label={t("deerLingua.open")}
      >
        {panelOpen ? <Sparkles size={19} /> : <MessageCircle size={19} />}
        <span>{t("deerLingua.name")}</span>
        <Bot size={18} />
      </button>
    </aside>
  );
};

export default DeerLinguaAssistant;
