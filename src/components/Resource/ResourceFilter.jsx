"use client";

import { Book, Headphones, Library, Search, WholeWord } from "lucide-react";
import { useTranslation } from "react-i18next";

const filters = [
  { id: "all", labelKey: "resourcePage.all", icon: Library },
  { id: "book", labelKey: "resourcePage.books", icon: Book },
  { id: "audio", labelKey: "resourcePage.audio", icon: Headphones },
  { id: "grammar", labelKey: "resourcePage.grammar", icon: Library },
  { id: "vocabulary", labelKey: "resourcePage.vocabulary", icon: WholeWord },
];

export default function ResourceFilter({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
}) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "fa";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="relative w-full md:w-64">
        <Search
          className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4`}
        />
        <input
          type="text"
          placeholder={t("resourcePage.search")}
          className={`w-full ${isRtl ? "pr-10 pl-4" : "pl-10 pr-4"} py-2 rounded-md bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Icon className="h-4 w-4" /> {t(filter.labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
