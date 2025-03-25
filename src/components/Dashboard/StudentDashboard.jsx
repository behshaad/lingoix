import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Book,
  Clock,
  Trophy,
  Target,
  CheckCircle,
  PlayCircle,
  MessageSquare,
  Award,
  Users,
  Brain,
  Download,
} from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Sample data
const studentData = {
  name: "علی محمدی",
  level: "B2",
  score: 850,
  studyTime: {
    daily: "45 دقیقه",
    weekly: "5 ساعت",
  },
  progress: 75,
  roadmap: [
    { title: "مقدمات", completed: true },
    { title: "واژگان پایه", completed: true },
    { title: "گرامر مقدماتی", completed: true },
    { title: "مکالمه روزمره", completed: false },
    { title: "گرامر پیشرفته", completed: false },
    { title: "واژگان پیشرفته", completed: false },
  ],
  upcomingTasks: [
    { title: "تمرین گرامر درس 5", dueDate: "1402/12/25" },
    { title: "تمرین مکالمه", dueDate: "1402/12/26" },
    { title: "امتحان میان‌ترم", dueDate: "1402/12/28" },
  ],
  leaderboard: [
    { name: "سارا احمدی", score: 920 },
    { name: "محمد رضایی", score: 890 },
    { name: "علی محمدی", score: 850 },
  ],
  certificates: [
    { title: "سطح A1", date: "1402/10/15" },
    { title: "سطح A2", date: "1402/11/20" },
    { title: "سطح B1", date: "1402/12/10" },
  ],
};

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const dashboardRef = useRef(null);

  // GSAP animations
  useEffect(() => {
    if (!dashboardRef.current) return;

    // Animate sections on scroll
    gsap.utils.toArray(".dashboard-section").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
          );
        },
      });
    });

    // Animate progress bar
    gsap.to(".progress-bar", {
      width: `${studentData.progress}%`,
      duration: 1.5,
      ease: "power2.out",
    });
  }, []);

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen bg-background text-foreground"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">داشبورد دانشجویی</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg">خوش آمدید، {studentData.name}</span>
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full">
              سطح {studentData.level}
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="dashboard-section bg-card rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">پیشرفت کلی</h2>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-lg font-bold">{studentData.score}</span>
            </div>
          </div>
          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
            <div className="progress-bar absolute top-0 left-0 h-full bg-primary rounded-full" />
          </div>
          <div className="flex justify-between mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>امروز: {studentData.studyTime.daily}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>این هفته: {studentData.studyTime.weekly}</span>
            </div>
          </div>
        </div>

        {/* Learning Roadmap */}
        <div className="dashboard-section bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">رودمپ یادگیری</h2>
          <div className="space-y-4">
            {studentData.roadmap.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-muted rounded-lg"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.completed
                      ? "bg-green-500 text-white"
                      : "bg-muted-foreground/20"
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Target className="h-5 w-5" />
                  )}
                </div>
                <span className="flex-1">{item.title}</span>
                {item.completed && (
                  <span className="text-green-500">تکمیل شده</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="dashboard-section bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">تکالیف و امتحانات</h2>
          <div className="space-y-4">
            {studentData.upcomingTasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Book className="h-5 w-5 text-primary" />
                  <span>{task.title}</span>
                </div>
                <span className="text-muted-foreground">{task.dueDate}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="dashboard-section bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">جدول امتیازات</h2>
          <div className="space-y-4">
            {studentData.leaderboard.map((student, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold">{index + 1}</span>
                  <span>{student.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold">{student.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div className="dashboard-section bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">مدارک و گواهینامه‌ها</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentData.certificates.map((cert, index) => (
              <div
                key={index}
                className="p-4 bg-muted rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">{cert.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {cert.date}
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-muted-foreground/20 rounded-full transition-colors">
                  <Download className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
