import { useState } from "react";

export default function BookPlayer() {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const bookData = {
    pdfUrl: "/Hueber.pdf", // مسیر فایل PDF خود را اینجا وارد کنید
    audioFiles: [
      { title: "Chapter 1", pageNumber: 1, url: "audio/kapitel2.mp3" },
      { title: "Chapter 2", pageNumber: 2, url: "audio/kapitel3.mp3" },
      { title: "Chapter 3", pageNumber: 3, url: "audio/kapitel4.mp3" },
  
      // لیست فایل‌های صوتی شما
    ],
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
        Interactive Book Player
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <p>Page {pageNumber}</p>
              <button
                onClick={() => changePage(1)}
                disabled={pageNumber >= 500}
                className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <iframe
                src={`${bookData.pdfUrl}#page=${pageNumber}`}
                width="100%"
                height="400"
                title="Book PDF"
              />
            </div>
          </div>
        </div>

        {/* فایل های صوتی */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Audio Chapters
            </h2>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search audio files..."
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
                      <h3 className="font-medium">{audio.title}</h3>
                      <button
                        onClick={() =>
                          changePage(audio.pageNumber - pageNumber)
                        }
                        className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
                      >
                        Go to page {audio.pageNumber}
                      </button>
                    </div>
                    <audio controls>
                      <source src={audio.url} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No audio files found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
