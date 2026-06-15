import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getResources } from "../../../services/learningDataService";

export default function BookPlayer() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const resources = getResources();
  const selectedResource =
    resources.find((resource) => resource.id === searchParams.get("resourceId")) ||
    resources[0];
  const resourceTitle = t(
    `resourcesData.${selectedResource.id}.title`,
    selectedResource.title
  );
  const resourceDescription = t(
    `resourcesData.${selectedResource.id}.description`,
    selectedResource.description
  );

  const bookData = {
    pdfUrl: selectedResource.type === "book" ? selectedResource.sourceUrl : "/Hueber.pdf",
    audioFiles: resources
      .filter((resource) => resource.type === "audio")
      .map((resource, index) => ({
        resourceId: resource.id,
        title: resource.title,
        pageNumber: index + 1,
        url: resource.sourceUrl,
      })),
  };

  const filteredAudios = bookData.audioFiles.filter((audio) =>
    audio.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        {resourceTitle}
      </h1>
      <p className="mx-auto mb-6 max-w-3xl text-center text-gray-600">
        {resourceDescription}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                {t("bookPlayer.previous")}
              </button>
              <p>{t("bookPlayer.page")} {pageNumber}</p>
              <button
                onClick={() => changePage(1)}
                disabled={pageNumber >= 500}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                {t("bookPlayer.next")}
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              {selectedResource.type === "audio" ? (
                <div className="flex h-[400px] items-center justify-center text-center text-gray-600">
                  {t("bookPlayer.audioPrompt")}
                </div>
              ) : (
                <iframe
                  src={`${bookData.pdfUrl}#page=${pageNumber}`}
                  width="100%"
                  height="400"
                  title="Book PDF"
                />
              )}
            </div>
          </div>
        </div>

        {/* فایل های صوتی */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              {t("bookPlayer.audioChapters")}
            </h2>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={t("bookPlayer.searchAudio")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="space-y-4">
              {filteredAudios.length > 0 ? (
                filteredAudios.map((audio, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">
                          {t(`resourcesData.${audio.resourceId}.title`, audio.title)}
                        </h3>
                      <button
                        onClick={() =>
                          changePage(audio.pageNumber - pageNumber)
                        }
                        className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                      >
                        {t("bookPlayer.goToPage", { page: audio.pageNumber })}
                      </button>
                    </div>
                    <audio controls className="w-full">
                      <source src={audio.url} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  {t("bookPlayer.noAudio")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
