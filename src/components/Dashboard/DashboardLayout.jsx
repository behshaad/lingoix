import { useState } from "react";
import { gsap } from "gsap";
import StudentDashboard from "./StudentDashboard";
import VocabularyPractice from "./VocabularyPractice";
import AudioPractice from "./AudioPractice";
import WritingPractice from "./WritingPractice";
import DashboardNavigation from "./DashboardNavigation";

export default function DashboardLayout() {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <StudentDashboard />;
      case "vocabulary":
        return <VocabularyPractice />;
      case "audio":
        return <AudioPractice />;
      case "writing":
        return <WritingPractice />;
      case "certificates":
        return (
          <div className="min-h-screen bg-background text-foreground py-8">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold mb-8">مدارک و گواهینامه‌ها</h1>
              {/* Add certificates section here */}
            </div>
          </div>
        );
      case "chat":
        return (
          <div className="min-h-screen bg-background text-foreground py-8">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold mb-8">گفتگو با اساتید</h1>
              {/* Add chat section here */}
            </div>
          </div>
        );
      case "ai-assistant":
        return (
          <div className="min-h-screen bg-background text-foreground py-8">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold mb-8">دستیار هوشمند</h1>
              {/* Add AI assistant section here */}
            </div>
          </div>
        );
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 mr-64">{renderSection()}</div>
      <DashboardNavigation
        onNavigate={setActiveSection}
        activeSection={activeSection}
      />
    </div>
  );
}
