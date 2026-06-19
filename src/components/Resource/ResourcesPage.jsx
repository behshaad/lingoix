import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../services/apiClient";
import ResourceFilter from "./ResourceFilter";
import ResourceCard from "./ResourceCard";

export default function ResourcesPage() {
  const { t } = useTranslation();
  const [resources, setResources] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;
    apiClient
      .resources()
      .then((data) => {
        if (!isMounted) return;
        setResources((data.resources || []).filter((resource) => resource.status === "published"));
        setStatus("ready");
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus("failed");
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesType = activeFilter === "all" || resource.type === activeFilter;
      const searchable = [resource.title, resource.description, resource.cefrLevel, resource.skillArea]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesType && (!query || searchable.includes(query));
    });
  }, [activeFilter, resources, searchQuery]);

  return (
    <main className="min-h-screen bg-[#f5f5f7] px-4 py-10 text-gray-950 dark:bg-gray-950 dark:text-white sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
              {t("resourcePage.eyebrow", "Resource Library")}
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              {t("resourcePage.title")}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
              {t("resourcePage.subtitle")}
            </p>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm dark:bg-gray-900 dark:text-gray-300">
            {filteredResources.length} {t("admin.resources", "Resources")}
          </div>
        </div>

        <ResourceFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {status === "loading" && (
          <div className="rounded-2xl bg-white p-6 text-sm text-gray-500 shadow-sm dark:bg-gray-900">
            {t("practice.loading")}
          </div>
        )}

        {status === "failed" && (
          <div className="rounded-2xl bg-white p-6 text-sm text-gray-500 shadow-sm dark:bg-gray-900">
            {t("resourcePage.loadFailed", "Could not load resources. Please sign in again.")}
          </div>
        )}

        {status === "ready" && filteredResources.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500 shadow-sm dark:bg-gray-900">
            {t("resourcePage.empty", "No published resources match your filters.")}
          </div>
        )}

        {status === "ready" && filteredResources.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
