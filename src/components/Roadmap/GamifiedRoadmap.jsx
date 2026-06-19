import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Headphones,
  Link as LinkIcon,
  Lock,
  MessageCircle,
  PencilLine,
  Repeat2,
  Target,
} from "lucide-react";

const statusConfig = {
  done: { accent: "#20a6b8", soft: "bg-cyan-50", label: "Done" },
  next: { accent: "#8066b3", soft: "bg-violet-50", label: "Next" },
  in_progress: { accent: "#df5962", soft: "bg-rose-50", label: "In progress" },
  targeted: { accent: "#d2aa31", soft: "bg-amber-50", label: "Targeted" },
  locked: { accent: "#5c9f98", soft: "bg-teal-50", label: "Locked" },
};

const typeIconConfig = {
  lesson: BookOpen,
  exercise: PencilLine,
  assessment: BarChart3,
  review: Repeat2,
  resource: LinkIcon,
  listening: Headphones,
  conversation_practice: MessageCircle,
  targeted_exercise_insertion: Target,
};

const getRoadWidth = (count, compact) => {
  if (compact) return Math.max(980, count * 230);
  return Math.max(900, count * 170);
};

const stationPositions = (items, compact) => {
  const width = getRoadWidth(items.length, compact);
  const start = compact ? 110 : 96;
  const end = width - (compact ? 130 : 96);
  const span = Math.max(1, items.length - 1);

  return items.map((item, index) => ({
    item,
    x: start + (index / span) * (end - start),
    y: 280 + Math.sin(index * 1.35) * 72 + (index % 2 === 0 ? 28 : -28),
    calloutY: index % 2 === 0 ? 84 : 388,
    cardY: index % 2 === 0 ? 42 : 408,
  }));
};

const stationStatus = (item) =>
  item.type === "targeted_exercise_insertion" ? "targeted" : item.status || "locked";

const actionPathForItem = (item) => {
  if (item.status === "locked") return null;
  if (item.type === "review") return "/resources";
  if (["exercise", "assessment", "targeted_exercise_insertion"].includes(item.type)) return "/practice";
  return "/practice";
};

const roadPath = (positions, width) => {
  if (!positions.length) return "";
  if (positions.length === 1) return `M 0 ${positions[0].y} L ${width} ${positions[0].y}`;

  const start = `M 0 ${positions[0].y}`;
  const segments = positions.slice(1).map((position, index) => {
    const previous = positions[index];
    const controlOffset = (position.x - previous.x) * 0.48;
    return `C ${previous.x + controlOffset} ${previous.y - 112}, ${position.x - controlOffset} ${position.y + 112}, ${position.x} ${position.y}`;
  });

  return `${start} L ${positions[0].x} ${positions[0].y} ${segments.join(" ")} L ${width} ${positions[positions.length - 1].y}`;
};

const GamifiedRoadmap = ({ items = [], variant = "dashboard" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCompact, setIsCompact] = useState(false);
  const pathItems = useMemo(() => items.filter(Boolean), [items]);
  const roadWidth = getRoadWidth(pathItems.length, isCompact);
  const positions = useMemo(() => stationPositions(pathItems, isCompact), [pathItems, isCompact]);
  const pathD = useMemo(() => roadPath(positions, roadWidth), [positions, roadWidth]);
  const selected = selectedItem || pathItems.find((item) => item.status === "next") || pathItems[0];

  useEffect(() => {
    const updateCompact = () => setIsCompact(window.innerWidth < 768);
    updateCompact();
    window.addEventListener("resize", updateCompact);
    return () => window.removeEventListener("resize", updateCompact);
  }, []);

  if (!pathItems.length) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
        {t("roadmap.empty", "Your roadmap will appear after learner profile setup.")}
      </div>
    );
  }

  const selectedStatus = selected ? stationStatus(selected) : "locked";
  const selectedActionPath = selected ? actionPathForItem(selected) : null;

  return (
    <section className="w-full">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            {variant === "dashboard"
              ? t("roadmap.todayPath", "Today's Path")
              : t("roadmap.title", "Gamified Roadmap")}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950 dark:text-white">
            {variant === "dashboard"
              ? t("roadmap.dashboardTitle", "Choose your next station")
              : t("roadmap.pathTitle", "Scroll your learning stations")}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
          {Object.entries(statusConfig).map(([key, config]) => (
            <span key={key} className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1 dark:border-gray-800">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: config.accent }} />
              {t(`roadmap.status.${key}`, config.label)}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto pb-3">
        <div
          className="relative h-[620px] min-w-[900px] overflow-hidden rounded-sm border border-gray-200 bg-[#e8e8e8] shadow-[0_22px_65px_rgba(15,23,42,0.16)] dark:border-gray-800"
          style={{ width: `${roadWidth}px` }}
        >
          <div className="absolute inset-x-0 bottom-0 h-[44%] bg-[#ded6c3]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0)_42%),radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.5),transparent_23%)]" />

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${roadWidth} 620`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={pathD} fill="none" stroke="#4c4c45" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.16" strokeWidth="86" transform="translate(7 12)" />
            <path d={pathD} fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="82" />
            <path d={pathD} fill="none" stroke="#6f6f65" strokeLinecap="round" strokeLinejoin="round" strokeWidth="70" />
            <path d={pathD} fill="none" stroke="#8d8c82" strokeLinecap="round" strokeLinejoin="round" strokeWidth="58" />
            <path
              d={pathD}
              fill="none"
              stroke="#ffffff"
              strokeDasharray="32 28"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="7"
            />
          </svg>

          {positions.map(({ item, x, y, calloutY, cardY }, index) => {
            const status = stationStatus(item);
            const config = statusConfig[status] || statusConfig.locked;
            const isSelected = selected?.id === item.id;
            const Icon = item.status === "locked" ? Lock : typeIconConfig[item.type] || CheckCircle2;
            const cardTop = `${cardY}px`;
            const cardLeft = `${Math.max(24, Math.min(roadWidth - 204, x - 88))}px`;
            const lineHeight = Math.abs(y - calloutY);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                className="group absolute z-10 text-left"
                style={{ left: cardLeft, top: cardTop, width: "176px" }}
              >
                <span
                  className="pointer-events-none absolute left-1/2 w-px -translate-x-1/2"
                  style={{
                    top: cardY < y ? "74px" : `-${lineHeight + 12}px`,
                    height: `${lineHeight + 12}px`,
                    backgroundColor: config.accent,
                  }}
                />
                <span
                  className="pointer-events-none absolute left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-white shadow-md"
                  style={{
                    top: `${y - cardY - 18}px`,
                    color: config.accent,
                    boxShadow: `0 0 0 4px ${config.accent}33, 0 10px 24px rgba(15,23,42,0.18)`,
                  }}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.6} />
                </span>
                <span
                  className={`block min-h-[128px] border-t-[4px] bg-white/88 p-3 shadow-sm backdrop-blur-[1px] transition group-hover:-translate-y-1 group-hover:shadow-lg ${config.soft} ${
                    isSelected ? "ring-2 ring-gray-950" : "ring-1 ring-black/5"
                  }`}
                  style={{ borderColor: config.accent }}
                >
                  <span className="block text-[26px] font-black leading-none" style={{ color: config.accent }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-1 block text-[11px] font-black uppercase leading-4 tracking-wide text-gray-700">
                    {item.title}
                  </span>
                  <span className="mt-2 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                    {t(`roadmap.status.${status}`, config.label)} · {t(`roadmap.types.${item.type}`, item.type?.replaceAll("_", " "))}
                  </span>
                  <span className="mt-2 block h-[3px] w-12" style={{ backgroundColor: config.accent }} />
                </span>
              </button>
            );
          })}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
            <p className="text-4xl font-black tracking-tight text-cyan-600">
              {t("roadmap.infographicTitle", "Learning Path")}{" "}
              <span className="text-orange-500">{t("roadmap.infographicSuffix", "Roadmap")}</span>
            </p>
          </div>
        </div>
      </div>

      {selected && (
        <div className="mt-4 grid gap-3 rounded-lg border border-gray-200 bg-white p-4 text-gray-950 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t(`roadmap.status.${selectedStatus}`, statusConfig[selectedStatus]?.label || selectedStatus)}
            </p>
            <h3 className="mt-1 text-lg font-semibold">{selected.title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {t(
                "roadmap.stationDescription",
                "Open this station to continue the linked lesson, exercise, review, or assessment."
              )}
            </p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {selected.cefrLevel} · {t(`domain.${selected.skillArea}`, selected.skillArea)}
            </p>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              disabled={!selectedActionPath}
              onClick={() => selectedActionPath && navigate(selectedActionPath)}
              className="rounded-md bg-gray-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-950"
            >
              {selectedActionPath
                ? t("roadmap.openStation", "Open station")
                : t("roadmap.lockedStation", "Locked")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default GamifiedRoadmap;
