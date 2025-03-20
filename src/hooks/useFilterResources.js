import { useState } from "react";

const useFilterResources = (resources) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { searchTerm, setSearchTerm, filteredResources };
};

export default useFilterResources;
