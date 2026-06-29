import FlashCard from "../components/Students/FlashCard";
import DeerLinguaLessonFlow from "../components/DeerLingua/DeerLinguaLessonFlow";

const PracticePage = () => (
  <main className="space-y-8 bg-[#f8fafc] px-4 py-8 dark:bg-gray-950">
    <div className="mx-auto max-w-6xl">
      <DeerLinguaLessonFlow />
    </div>
    <FlashCard />
  </main>
);

export default PracticePage;
