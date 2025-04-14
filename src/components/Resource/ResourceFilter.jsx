"use client";

import { Book, Headphones, Video, Search } from "lucide-react";


export default function ResourceFilter({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search resources..."
          className="w-full pl-10 pr-4 py-2 rounded-md bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-md transition-all duration-300 whitespace-nowrap ${
            activeFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          All Resources
        </button>
        <button
          onClick={() => setActiveFilter("book")}
          className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
            activeFilter === "book"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          <Book className="h-4 w-4" /> Books
        </button>
        <button
          onClick={() => setActiveFilter("audio")}
          className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
            activeFilter === "audio"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          <Headphones className="h-4 w-4" /> Audio
        </button>
        <button
          onClick={() => setActiveFilter("video")}
          className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
            activeFilter === "video"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          <Video className="h-4 w-4" /> Video
        </button>
      </div>
    </div>
  );
}
