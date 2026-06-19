import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as THREE from "three";

const statusConfig = {
  done: { color: 0x16a34a, ring: "ring-emerald-500", label: "Done" },
  next: { color: 0x2563eb, ring: "ring-blue-500", label: "Next" },
  in_progress: { color: 0xf59e0b, ring: "ring-amber-500", label: "In progress" },
  targeted: { color: 0xdc2626, ring: "ring-red-500", label: "Targeted" },
  locked: { color: 0x6b7280, ring: "ring-gray-400", label: "Locked" },
};

const stationPositions = (items, compact) => {
  const gap = compact ? 180 : 130;
  return items.map((item, index) => ({
    item,
    left: compact ? 80 + index * gap : 8 + ((index % 5) / 4) * 84,
    top: compact ? 48 + (index % 2) * 34 : 18 + (index % 2) * 46,
    x: (index - (items.length - 1) / 2) * 1.45,
    y: index % 2 === 0 ? 0.7 : -0.58,
    z: Math.sin(index * 0.7) * 0.65,
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

const GamifiedRoadmap = ({ items = [], variant = "dashboard" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const canvasHostRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCompact, setIsCompact] = useState(false);
  const pathItems = useMemo(() => items.filter(Boolean), [items]);
  const positions = useMemo(
    () => stationPositions(pathItems, isCompact),
    [pathItems, isCompact]
  );
  const selected = selectedItem || pathItems.find((item) => item.status === "next") || pathItems[0];

  useEffect(() => {
    const updateCompact = () => setIsCompact(window.innerWidth < 768);
    updateCompact();
    window.addEventListener("resize", updateCompact);
    return () => window.removeEventListener("resize", updateCompact);
  }, []);

  useEffect(() => {
    const host = canvasHostRef.current;
    if (!host || !positions.length) return undefined;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);
    const camera = new THREE.PerspectiveCamera(42, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0.65, isCompact ? 8 : 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.78));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
    keyLight.position.set(3, 6, 5);
    scene.add(keyLight);

    const points = positions.map((position) => new THREE.Vector3(position.x, position.y, position.z));
    if (points.length > 1) {
      const curve = new THREE.CatmullRomCurve3(points);
      const tube = new THREE.TubeGeometry(curve, 96, 0.035, 12, false);
      const tubeMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.55 });
      scene.add(new THREE.Mesh(tube, tubeMaterial));
    }

    const stationMeshes = positions.map(({ item, x, y, z }, index) => {
      const status = stationStatus(item);
      const color = statusConfig[status]?.color || statusConfig.locked.color;
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.48, 0.18, 32),
        new THREE.MeshStandardMaterial({ color, roughness: 0.38, metalness: 0.06 })
      );
      base.position.y = -0.18;
      group.add(base);

      const orb = new THREE.Mesh(
        new THREE.IcosahedronGeometry(status === "next" ? 0.32 : 0.26, 2),
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.32,
          metalness: status === "locked" ? 0 : 0.16,
          emissive: status === "next" || status === "targeted" ? color : 0x000000,
          emissiveIntensity: status === "next" ? 0.18 : status === "targeted" ? 0.12 : 0,
        })
      );
      group.add(orb);

      if (status === "done" || status === "next" || status === "targeted") {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.44, 0.018, 12, 48),
          new THREE.MeshBasicMaterial({ color })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -0.04;
        group.add(ring);
      }

      group.userData = { index, status };
      scene.add(group);
      return group;
    });

    let frameId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      stationMeshes.forEach((mesh, index) => {
        mesh.rotation.y = elapsed * 0.25 + index * 0.18;
        mesh.position.y = positions[index].y + Math.sin(elapsed * 1.5 + index) * 0.035;
      });
      camera.position.x += ((isCompact ? 0 : 0.2) - camera.position.x) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    const resize = () => {
      if (!host.clientWidth || !host.clientHeight) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };

    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      stationMeshes.forEach((mesh) => {
        mesh.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) child.material.dispose();
        });
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [positions, isCompact]);

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
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
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
              <span className={`h-2 w-2 rounded-full ring-2 ${config.ring}`} />
              {t(`roadmap.status.${key}`, config.label)}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto pb-2">
        <div
          className="relative h-[380px] min-w-[760px] overflow-hidden rounded-lg border border-gray-200 bg-slate-50 shadow-sm dark:border-gray-800 dark:bg-slate-950 md:min-w-0"
          style={{ width: isCompact ? Math.max(760, pathItems.length * 180 + 160) : "100%" }}
        >
          <div ref={canvasHostRef} className="absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.12),transparent_32%)]" />
          {positions.map(({ item, left, top }) => {
            const status = stationStatus(item);
            const config = statusConfig[status] || statusConfig.locked;
            const selectedClass = selected?.id === item.id ? "scale-105 border-gray-950 dark:border-white" : "border-white/80 dark:border-gray-700";
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                className={`absolute z-10 flex min-h-[86px] w-36 flex-col justify-between rounded-lg border bg-white/90 p-3 text-left text-gray-950 shadow-lg ring-2 transition hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900/90 dark:text-white ${config.ring} ${selectedClass}`}
                style={{ left: isCompact ? left : `${left}%`, top: `${top}%` }}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {t(`roadmap.status.${status}`, config.label)}
                </span>
                <span className="text-sm font-semibold leading-5">{item.title}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t(`roadmap.types.${item.type}`, item.type?.replaceAll("_", " "))}
                </span>
              </button>
            );
          })}
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
