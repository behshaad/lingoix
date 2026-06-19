import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as THREE from "three";

const statusConfig = {
  done: {
    color: 0x0f9f7a,
    accent: "#0f9f7a",
    ring: "ring-emerald-500",
    soft: "bg-emerald-50",
    label: "Done",
  },
  next: {
    color: 0x2f80ed,
    accent: "#2f80ed",
    ring: "ring-blue-500",
    soft: "bg-blue-50",
    label: "Next",
  },
  in_progress: {
    color: 0xf59e0b,
    accent: "#f59e0b",
    ring: "ring-amber-500",
    soft: "bg-amber-50",
    label: "In progress",
  },
  targeted: {
    color: 0xef4444,
    accent: "#ef4444",
    ring: "ring-red-500",
    soft: "bg-red-50",
    label: "Targeted",
  },
  locked: {
    color: 0x64748b,
    accent: "#64748b",
    ring: "ring-slate-400",
    soft: "bg-slate-100",
    label: "Locked",
  },
};

const stationPositions = (items, compact) => {
  const gap = compact ? 190 : 130;
  return items.map((item, index) => ({
    item,
    left: compact ? 72 + index * gap : 7 + ((index % 5) / 4) * 73,
    top: compact ? 14 + (index % 2) * 48 : 9 + (index % 2) * 47,
    markerTop: compact ? 52 + (index % 2) * 20 : 48 + (index % 2) * 8,
    x: (index - (items.length - 1) / 2) * 1.55,
    y: index % 2 === 0 ? 0.52 : -0.42,
    z: Math.sin(index * 0.82) * 0.48,
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
    scene.background = new THREE.Color(0xf5f0e8);
    const camera = new THREE.PerspectiveCamera(38, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 1.15, isCompact ? 8.7 : 7.7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene.add(new THREE.AmbientLight(0xffffff, 0.86));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 6, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.55);
    fillLight.position.set(-4, 2.5, 3);
    scene.add(fillLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 5.4),
      new THREE.MeshStandardMaterial({
        color: 0xf4efe7,
        roughness: 0.9,
        metalness: 0,
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -1.05, 0);
    ground.receiveShadow = true;
    scene.add(ground);

    const points = positions.map((position) => new THREE.Vector3(position.x, position.y, position.z));
    if (points.length > 1) {
      const curve = new THREE.CatmullRomCurve3(points);
      const road = new THREE.TubeGeometry(curve, 140, 0.19, 18, false);
      const roadMaterial = new THREE.MeshStandardMaterial({
        color: 0x52565f,
        roughness: 0.62,
        metalness: 0.02,
      });
      const roadMesh = new THREE.Mesh(road, roadMaterial);
      roadMesh.castShadow = true;
      roadMesh.receiveShadow = true;
      scene.add(roadMesh);

      const edgeMaterial = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
      const dashMaterial = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
      Array.from({ length: 36 }, (_, index) => index).forEach((index) => {
        const tValue = index / 35;
        const point = curve.getPoint(tValue);
        const tangent = curve.getTangent(tValue);
        const angle = Math.atan2(tangent.y, tangent.x);
        if (index % 2 === 0) {
          const dash = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.018, 0.026), dashMaterial);
          dash.position.copy(point);
          dash.position.y += 0.018;
          dash.rotation.z = angle;
          scene.add(dash);
        }

        if (index % 4 === 0) {
          const leftEdge = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.012, 0.018), edgeMaterial);
          const rightEdge = leftEdge.clone();
          const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
          leftEdge.position.copy(point).add(normal.clone().multiplyScalar(0.2));
          rightEdge.position.copy(point).add(normal.clone().multiplyScalar(-0.2));
          leftEdge.position.y += 0.02;
          rightEdge.position.y += 0.02;
          leftEdge.rotation.z = angle;
          rightEdge.rotation.z = angle;
          scene.add(leftEdge, rightEdge);
        }
      });
    }

    const stationMeshes = positions.map(({ item, x, y, z }, index) => {
      const status = stationStatus(item);
      const color = statusConfig[status]?.color || statusConfig.locked.color;
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34, 0.5, 0.16, 36),
        new THREE.MeshStandardMaterial({
          color: status === "locked" ? 0x858d9a : color,
          roughness: 0.42,
          metalness: 0.18,
        })
      );
      base.position.y = -0.22;
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(status === "next" ? 0.24 : 0.2, 32, 16),
        new THREE.MeshStandardMaterial({
          color: status === "locked" ? 0x5f6772 : color,
          roughness: 0.32,
          metalness: status === "locked" ? 0.08 : 0.28,
          emissive: status === "next" || status === "targeted" ? color : 0x000000,
          emissiveIntensity: status === "next" ? 0.14 : status === "targeted" ? 0.1 : 0,
        })
      );
      orb.castShadow = true;
      group.add(orb);

      const signPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.66, 16),
        new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.7 })
      );
      signPost.position.y = 0.12;
      group.add(signPost);

      if (status === "done" || status === "next" || status === "targeted") {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.41, 0.014, 12, 48),
          new THREE.MeshBasicMaterial({ color })
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -0.06;
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
        mesh.rotation.y = Math.sin(elapsed * 0.35 + index) * 0.08;
        mesh.position.y = positions[index].y + Math.sin(elapsed * 1.4 + index) * 0.025;
      });
      camera.position.x += ((isCompact ? 0 : 0.16) - camera.position.x) * 0.02;
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
          className="relative h-[460px] min-w-[780px] overflow-hidden rounded-lg border border-slate-200 bg-[#f6f0e7] shadow-[0_24px_80px_rgba(15,23,42,0.18)] md:min-w-0"
          style={{ width: isCompact ? Math.max(760, pathItems.length * 180 + 160) : "100%" }}
        >
          <div ref={canvasHostRef} className="absolute inset-0" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.68),rgba(246,240,231,0.42)),radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_32%)]" />
          <div className="pointer-events-none absolute inset-x-8 bottom-8 top-8 rounded-[28px] border border-white/60" />
          {positions.map(({ item, left, top }) => {
            const status = stationStatus(item);
            const config = statusConfig[status] || statusConfig.locked;
            const selectedClass =
              selected?.id === item.id
                ? "scale-[1.03] border-slate-900 shadow-2xl"
                : "border-white/80 shadow-lg";
            const stemHeight = top > 35 ? 72 : 88;
            const stemTop = top > 35 ? -stemHeight + 8 : 82;
            return (
              <div
                key={item.id}
                className="absolute z-10"
                style={{ left: isCompact ? left : `${left}%`, top: `${top}%` }}
              >
                <div
                  className="pointer-events-none absolute left-1/2 w-px -translate-x-1/2"
                  style={{
                    height: stemHeight,
                    top: stemTop,
                    background: `linear-gradient(${top > 35 ? "0deg" : "180deg"}, ${config.accent}, transparent)`,
                  }}
                />
                <div
                  className="pointer-events-none absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white shadow-md"
                  style={{
                    top: top > 35 ? stemTop - 7 : stemTop + stemHeight - 8,
                    backgroundColor: config.accent,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className={`relative flex min-h-[112px] w-44 flex-col rounded-xl border bg-white/95 p-4 text-left text-slate-950 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl ${selectedClass}`}
                  style={{ borderTop: `5px solid ${config.accent}` }}
                >
                  <span
                    className={`mb-2 inline-flex w-fit items-center gap-2 rounded-full px-2 py-1 text-[11px] font-black uppercase tracking-wide ${config.soft} text-slate-700`}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: config.accent }} />
                    {t(`roadmap.status.${status}`, config.label)}
                  </span>
                  <span className="text-base font-black leading-5">{item.title}</span>
                  <span className="mt-auto pt-3 text-xs font-semibold text-slate-500">
                    {t(`roadmap.types.${item.type}`, item.type?.replaceAll("_", " "))}
                  </span>
                </button>
              </div>
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
