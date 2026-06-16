import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  collectLearningEvent,
  createAttemptTimer,
  eventStatusLabelKey,
  learningEventStatus,
} from "../../services/learningEventCollector";
import {
  exerciseExpectedAnswer,
  exercisePrompt,
  exerciseSupportText,
  exerciseTitle,
  loadPracticeExercises,
} from "../../services/exercisePracticeService";

export default function AudioPractice() {
  const { t } = useTranslation();
  const [audioData, setAudioData] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [currentAudio, setCurrentAudio] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscription, setShowTranscription] = useState(false);
  const [progress, setProgress] = useState(0);
  const [eventStatus, setEventStatus] = useState(learningEventStatus.idle);
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const attemptTimerRef = useRef(createAttemptTimer());

  useEffect(() => {
    let isMounted = true;
    loadPracticeExercises("listening-comprehension")
      .then((items) => {
        if (!isMounted) return;
        setAudioData(items);
        setLoadStatus("ready");
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadStatus("failed");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    if (!progressRef.current) return;

    gsap.to(progressRef.current, {
      width: `${progress}%`,
      duration: 0.1,
      ease: "none",
    });
  }, [progress]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const time =
        (e.nativeEvent.offsetX / e.target.clientWidth) *
        audioRef.current.duration;
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSkip = (direction) => {
    if (direction === "next") {
      setCurrentAudio((prev) => (prev + 1) % audioData.length);
    } else {
      setCurrentAudio(
        (prev) => (prev - 1 + audioData.length) % audioData.length
      );
    }
    setIsPlaying(false);
    setProgress(0);
    setShowTranscription(false);
    setEventStatus(learningEventStatus.idle);
    attemptTimerRef.current.reset();
  };

  const currentItem = audioData[currentAudio];

  const handleComprehensionFeedback = async (isCorrect) => {
    const responseMs = attemptTimerRef.current.elapsedMs();
    const isSlowCorrect = isCorrect && responseMs > 10000;
    setEventStatus(learningEventStatus.saving);

    try {
      await collectLearningEvent({
        type: "answer_submitted",
        exerciseId: currentItem.id,
        skillArea: currentItem.skillArea,
        subskill: currentItem.subskill,
        correct: isCorrect,
        responseValue: isCorrect ? exerciseExpectedAnswer(currentItem) : "",
        responseMs,
        hintsUsed: showTranscription ? 1 : 0,
        retries: 0,
        errorType: isCorrect
          ? isSlowCorrect
            ? "slow but correct response"
            : null
          : "listening misrecognition",
      });
      setEventStatus(learningEventStatus.saved);
    } catch (error) {
      setEventStatus(learningEventStatus.failed);
    }

    attemptTimerRef.current.reset();
  };

  if (loadStatus === "loading") {
    return (
      <div className="min-h-screen bg-background py-8 text-foreground">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">{t("practice.loading")}</p>
        </div>
      </div>
    );
  }

  if (loadStatus === "failed" || !currentItem) {
    return (
      <div className="min-h-screen bg-background py-8 text-foreground">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">{t("practice.loadFailed")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">تمرین شنیداری</h1>

        {/* Audio Player */}
        <div className="max-w-2xl mx-auto bg-card rounded-lg p-6 shadow-lg">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{exerciseTitle(currentItem, t)}</h2>
            {eventStatusLabelKey(eventStatus) && (
              <p className="mb-3 text-sm text-muted-foreground">
                {t(eventStatusLabelKey(eventStatus))}
              </p>
            )}
            <div className="flex items-center gap-2">
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
            <p className="mt-4 text-sm text-muted-foreground">
              {exercisePrompt(currentItem, t)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {exerciseSupportText(currentItem)}
            </p>
          </div>

          {/* Progress Bar */}
          <div
            ref={progressRef}
            className="relative h-2 bg-muted rounded-full cursor-pointer mb-4"
            onClick={handleSeek}
          >
            <div className="absolute inset-0 bg-primary rounded-full" />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleSkip("prev")}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <SkipBack className="h-6 w-6" />
              </button>
              <button
                onClick={handlePlayPause}
                className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </button>
              <button
                onClick={() => handleSkip("next")}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <SkipForward className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>

          {/* Transcription */}
          <div className="space-y-4">
            <button
              onClick={() => setShowTranscription(!showTranscription)}
              className="w-full py-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              {showTranscription ? "پنهان کردن متن" : "نمایش متن"}
            </button>

            {showTranscription && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-lg mb-2">{exerciseSupportText(currentItem)}</p>
                  <p className="text-muted-foreground">
                    {exerciseExpectedAnswer(currentItem)}
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => handleComprehensionFeedback(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>درست</span>
                  </button>
                  <button
                    onClick={() => handleComprehensionFeedback(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="h-5 w-5" />
                    <span>نادرست</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={currentItem.resourceSourceUrl || ""}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            setProgress(0);
          }}
        />
      </div>
    </div>
  );
}
