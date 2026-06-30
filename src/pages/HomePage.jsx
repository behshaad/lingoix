import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Flame, Globe2, Sparkles, Star, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import DeerLinguaPublicGuide from "../components/DeerLingua/DeerLinguaPublicGuide";
import Footer from "../components/Footer/Footer";
import { saveLearnerEntryIntent } from "../services/authSession";
import "./HomePage.css";

const focusMap = {
  hero: ".public-homepage__hero-copy",
  preview: ".public-homepage__lesson",
  path: ".public-homepage__path",
  language: ".public-homepage__language-card",
};

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "fa";
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [focusTarget, setFocusTarget] = useState(focusMap.hero);

  const answers = useMemo(() => t("home.lesson.answers", { returnObjects: true }), [t]);
  const pathItems = useMemo(() => t("home.path.items", { returnObjects: true }), [t]);
  const features = useMemo(() => t("home.features.items", { returnObjects: true }), [t]);
  const proof = useMemo(() => t("home.proof", { returnObjects: true }), [t]);
  const correctAnswer = t("home.lesson.correctAnswer");

  const rememberIntent = (destination) => {
    saveLearnerEntryIntent(destination);
  };

  const chooseAnswer = (answer) => {
    setSelectedAnswer(answer);
    const result = answer === correctAnswer ? "correct" : "wrong";
    setFeedback(result);
    setFocusTarget(focusMap.preview);
    window.dispatchEvent(
      new CustomEvent("deerlingua:public-reaction", {
        detail: { type: result === "correct" ? "celebrating" : "reacting" },
      })
    );
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setFocusTarget(focusMap.language);
  };

  return (
    <main className={`public-homepage ${isRtl ? "public-homepage--fa" : "public-homepage--en"}`} dir={isRtl ? "rtl" : "ltr"}>
      <DeerLinguaPublicGuide focusTarget={focusTarget} />

      <section
        className="public-homepage__hero"
        aria-labelledby="home-title"
        onMouseEnter={() => setFocusTarget(focusMap.hero)}
      >
        <div className="public-homepage__hero-copy">
          <div className="public-homepage__language-card" aria-label={t("home.languageLabel")}>
            <Globe2 size={18} aria-hidden="true" />
            <button
              type="button"
              className={i18n.language === "en" ? "is-active" : ""}
              onClick={() => changeLanguage("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={i18n.language === "fa" ? "is-active" : ""}
              onClick={() => changeLanguage("fa")}
            >
              FA
            </button>
          </div>
          <p className="public-homepage__eyebrow">
            <Sparkles size={18} aria-hidden="true" />
            {t("home.eyebrow")}
          </p>
          <h1 id="home-title">{t("home.title")}</h1>
          <p className="public-homepage__lede">{t("home.subtitle")}</p>
          <div className="public-homepage__actions" aria-label={t("home.actionsLabel")}>
            <Link
              className="public-homepage__button public-homepage__button--primary"
              to="/signup"
              onClick={() => rememberIntent("/practice")}
            >
              {t("home.primaryCta")}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <button
              type="button"
              className="public-homepage__button public-homepage__button--secondary"
              onClick={() => setFocusTarget(focusMap.preview)}
            >
              {t("home.secondaryCta")}
            </button>
          </div>
        </div>

        <article
          className="public-homepage__lesson"
          aria-label={t("home.lesson.label")}
          onMouseEnter={() => setFocusTarget(focusMap.preview)}
        >
          <div className="public-homepage__lesson-top">
            <div>
              <p>{t("home.lesson.unit")}</p>
              <h2>{t("home.lesson.title")}</h2>
            </div>
            <span>{t("home.lesson.xp")}</span>
          </div>
          <div className="public-homepage__lesson-progress">
            <span />
          </div>
          <div className="public-homepage__lesson-prompt">
            <span>{t("home.lesson.type")}</span>
            <h3>{t("home.lesson.prompt")}</h3>
          </div>
          <div className="public-homepage__lesson-answers">
            {answers.map((answer) => (
              <button
                key={answer}
                type="button"
                className={[
                  selectedAnswer === answer ? "is-selected" : "",
                  feedback && answer === correctAnswer ? "is-correct" : "",
                  feedback === "wrong" && selectedAnswer === answer ? "is-wrong" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => chooseAnswer(answer)}
              >
                {answer}
              </button>
            ))}
          </div>
          {feedback && (
            <div className={`public-homepage__lesson-feedback public-homepage__lesson-feedback--${feedback}`}>
              <p>
                {feedback === "correct"
                  ? t("home.lesson.correct")
                  : t("home.lesson.wrong", { answer: correctAnswer })}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedAnswer("");
                  setFeedback(null);
                  setFocusTarget(focusMap.path);
                }}
              >
                {t("home.lesson.next")}
              </button>
            </div>
          )}
        </article>
      </section>

      <section className="public-homepage__proof" aria-label={t("home.proofLabel")}>
        {proof.map((point) => (
          <div key={point.label}>
            <strong>{point.value}</strong>
            <span>{point.label}</span>
          </div>
        ))}
      </section>

      <section
        className="public-homepage__section public-homepage__section--split"
        onMouseEnter={() => setFocusTarget(focusMap.path)}
      >
        <div>
          <p className="public-homepage__eyebrow">{t("home.path.eyebrow")}</p>
          <h2>{t("home.path.title")}</h2>
        </div>
        <div className="public-homepage__path">
          {pathItems.map((item, index) => (
            <article key={item.title}>
              <span>{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="public-homepage__section">
        <div className="public-homepage__section-heading">
          <p className="public-homepage__eyebrow">{t("home.features.eyebrow")}</p>
          <h2>{t("home.features.title")}</h2>
          <p>{t("home.features.subtitle")}</p>
        </div>
        <div className="public-homepage__capabilities">
          {features.map((feature, index) => {
            const icons = [Trophy, Flame, Star];
            const Icon = icons[index] || CheckCircle2;
            return (
              <article className="public-homepage__capability" key={feature.title}>
                <Icon size={28} aria-hidden="true" />
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="public-homepage__closing" aria-labelledby="closing-title">
        <div>
          <p className="public-homepage__eyebrow">{t("home.closing.eyebrow")}</p>
          <h2 id="closing-title">{t("home.closing.title")}</h2>
        </div>
        <Link
          className="public-homepage__button public-homepage__button--primary"
          to="/signup"
          onClick={() => rememberIntent("/practice")}
        >
          {t("home.closing.cta")}
          <CheckCircle2 size={18} aria-hidden="true" />
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default HomePage;
