import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  Download,
} from "lucide-react";

// Sample writing prompts
const writingPrompts = [
  {
    id: 1,
    title: "مکالمه روزمره",
    prompt: "درباره یک روز معمولی خود به زبان آلمانی بنویسید.",
    example:
      "Ich stehe um 7 Uhr auf. Dann frühstücke ich und gehe zur Arbeit...",
    difficulty: "easy",
  },
  {
    id: 2,
    title: "اخبار",
    prompt: "یک خبر مهم را به زبان آلمانی بازنویسی کنید.",
    example: "Die Regierung hat heute neue Gesetze verabschiedet...",
    difficulty: "medium",
  },
  {
    id: 3,
    title: "مصاحبه",
    prompt: "یک مصاحبه کوتاه با یک شخص مشهور را به زبان آلمانی بنویسید.",
    example:
      "Interviewer: Was sind Ihre Ziele für die Zukunft?\nAntwort: Ich möchte...",
    difficulty: "hard",
  },
];

export default function WritingPractice() {
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [userText, setUserText] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [corrections, setCorrections] = useState([]);
  const textareaRef = useRef(null);

  // GSAP animations
  useEffect(() => {
    if (!textareaRef.current) return;

    gsap.fromTo(
      textareaRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [currentPrompt]);

  const handleSubmit = async () => {
    if (!userText.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);
    setCorrections([]);

    try {
      // Simulate API call for text correction
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Sample feedback and corrections
      setFeedback({
        score: 85,
        message: "نوشته شما خوب است، اما چند نکته برای بهبود وجود دارد.",
        suggestions: [
          "از زمان گذشته استفاده کنید",
          "جملات را کوتاه‌تر کنید",
          "از واژگان متنوع‌تری استفاده کنید",
        ],
      });

      setCorrections([
        {
          original: "Ich gehe zur Arbeit",
          corrected: "Ich ging zur Arbeit",
          explanation: "استفاده از زمان گذشته برای رویدادهای گذشته",
        },
        {
          original: "Das ist sehr gut",
          corrected: "Das ist ausgezeichnet",
          explanation: "استفاده از واژه‌های متنوع‌تر",
        },
      ]);
    } catch (error) {
      setFeedback({
        score: 0,
        message: "خطا در بررسی متن. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setUserText("");
    setFeedback(null);
    setCorrections([]);
  };

  const handleNextPrompt = () => {
    setCurrentPrompt((prev) => (prev + 1) % writingPrompts.length);
    handleReset();
  };

  const currentItem = writingPrompts[currentPrompt];

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">تمرین نوشتاری</h1>

        {/* Writing Area */}
        <div className="max-w-4xl mx-auto">
          {/* Prompt */}
          <div className="bg-card rounded-lg p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{currentItem.title}</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  currentItem.difficulty === "easy"
                    ? "bg-green-500/20 text-green-500"
                    : currentItem.difficulty === "medium"
                    ? "bg-yellow-500/20 text-yellow-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {currentItem.difficulty === "easy"
                  ? "آسان"
                  : currentItem.difficulty === "medium"
                  ? "متوسط"
                  : "سخت"}
              </span>
            </div>
            <p className="text-lg mb-4">{currentItem.prompt}</p>
            <button
              onClick={() => setUserText(currentItem.example)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              مشاهده مثال
            </button>
          </div>

          {/* Text Editor */}
          <div className="bg-card rounded-lg p-6 mb-6 shadow-lg">
            <textarea
              ref={textareaRef}
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="متن خود را اینجا بنویسید..."
              className="w-full h-64 p-4 bg-muted rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !userText.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="animate-spin">⌛</span>
                ) : (
                  <Send className="h-5 w-5" />
                )}
                <span>بررسی متن</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                <RotateCcw className="h-5 w-5" />
                <span>پاک کردن</span>
              </button>
            </div>
            <button
              onClick={handleNextPrompt}
              className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              تمرین بعدی
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="bg-card rounded-lg p-6 shadow-lg space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">نتیجه بررسی</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{feedback.score}</span>
                  <span className="text-muted-foreground">از 100</span>
                </div>
              </div>

              <p className="text-lg">{feedback.message}</p>

              {feedback.suggestions && (
                <div className="space-y-4">
                  <h4 className="font-semibold">پیشنهادات:</h4>
                  <ul className="space-y-2">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <AlertCircle className="h-5 w-5" />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {corrections.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold">تصحیحات:</h4>
                  <div className="space-y-4">
                    {corrections.map((correction, index) => (
                      <div
                        key={index}
                        className="p-4 bg-muted rounded-lg space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="line-through">
                            {correction.original}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{correction.corrected}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {correction.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Download className="h-5 w-5" />
                <span>دانلود گزارش</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
