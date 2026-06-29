import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Languages,
  LineChart,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import Footer from "../components/Footer/Footer";
import GuardianStag from "../components/Home/GuardianStag";
import { saveLearnerEntryIntent } from "../services/authSession";
import "./HomePage.css";

const pathItems = [
  { label: "Profile setup", detail: "Goals, CEFR level, language background", status: "ready" },
  { label: "Today's path", detail: "A1 listening plus vocabulary recall", status: "active" },
  { label: "Targeted exercise", detail: "Grammar tense repair after repeated errors", status: "review" },
];

const capabilities = [
  {
    icon: Brain,
    title: "Adaptive learning path",
    text: "Learners follow an adjustable sequence shaped by goals, learning events, and skill weaknesses.",
  },
  {
    icon: LineChart,
    title: "Language performance profile",
    text: "Vocabulary, grammar, listening, reading, writing, translation, and speaking stay visible together.",
  },
  {
    icon: ShieldCheck,
    title: "Teacher-reviewed decisions",
    text: "Proposed adaptive decisions can be reviewed with evidence before they change a learner path.",
  },
];

const journey = [
  "Create a learner profile with the language background that matters.",
  "Start with today's path instead of hunting through generic lessons.",
  "Practice with resources and exercises that produce meaningful learning events.",
  "Let targeted exercise insertions repair real error patterns over time.",
];

const proofPoints = [
  { value: "7", label: "skill areas" },
  { value: "100+", label: "demo learners" },
  { value: "4", label: "account roles" },
];

const HomePage = () => {
  const rememberIntent = (destination) => {
    saveLearnerEntryIntent(destination);
  };

  return (
    <main className="public-homepage">
      <GuardianStag />

      <section className="public-homepage__hero" aria-labelledby="home-title">
        <div className="public-homepage__hero-copy">
          <p className="public-homepage__eyebrow">
            <WandSparkles size={18} aria-hidden="true" />
            German for Persian-speaking learners
          </p>
          <h1 id="home-title">Lingoix</h1>
          <p className="public-homepage__lede">
            A magical learning journey on the surface, with adaptive language-learning
            evidence underneath. Build your learner profile, follow today's path, and
            let targeted practice meet your real weak spots.
          </p>
          <div className="public-homepage__actions" aria-label="Primary actions">
            <Link
              className="public-homepage__button public-homepage__button--primary"
              to="/signup"
              onClick={() => rememberIntent("/dashboard")}
            >
              Start learning
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              className="public-homepage__button public-homepage__button--secondary"
              to="/learning-path"
              onClick={() => rememberIntent("/learning-path")}
            >
              Preview the path
            </Link>
          </div>
        </div>

        <div className="public-homepage__preview" aria-label="Learning path preview">
          <div className="public-homepage__preview-header">
            <span>Learning Path Preview</span>
            <span>A1 → A2</span>
          </div>
          <div className="public-homepage__path-list">
            {pathItems.map((item) => (
              <div
                className={`public-homepage__path-item public-homepage__path-item--${item.status}`}
                key={item.label}
              >
                <span className="public-homepage__path-marker" aria-hidden="true" />
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="public-homepage__signal-grid" aria-label="Learner signals">
            <span>
              <Languages size={17} aria-hidden="true" />
              Persian → German
            </span>
            <span>
              <BookOpen size={17} aria-hidden="true" />
              Resource fit
            </span>
            <span>
              <MessageCircle size={17} aria-hidden="true" />
              Conversation
            </span>
            <span>
              <Sparkles size={17} aria-hidden="true" />
              Targeted repair
            </span>
          </div>
        </div>
      </section>

      <section className="public-homepage__proof" aria-label="Platform proof points">
        {proofPoints.map((point) => (
          <div key={point.label}>
            <strong>{point.value}</strong>
            <span>{point.label}</span>
          </div>
        ))}
      </section>

      <section className="public-homepage__section public-homepage__section--split">
        <div>
          <p className="public-homepage__eyebrow">Learner-first flow</p>
          <h2>Know what to do next every time you open Lingoix.</h2>
        </div>
        <div className="public-homepage__journey">
          {journey.map((item, index) => (
            <div className="public-homepage__journey-step" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="public-homepage__section">
        <div className="public-homepage__section-heading">
          <p className="public-homepage__eyebrow">Serious adaptive-learning proof</p>
          <h2>The magic has a learning model behind it.</h2>
          <p>
            Lingoix connects learner profile setup, learning events, skill weaknesses,
            resources, exercises, and teacher review into one coherent learner dashboard.
          </p>
        </div>
        <div className="public-homepage__capabilities">
          {capabilities.map(({ icon: Icon, title, text }) => (
            <article className="public-homepage__capability" key={title}>
              <Icon size={28} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="public-homepage__closing" aria-labelledby="closing-title">
        <div>
          <p className="public-homepage__eyebrow">Your companion is ready</p>
          <h2 id="closing-title">Follow today's path with a little light beside you.</h2>
        </div>
        <Link
          className="public-homepage__button public-homepage__button--primary"
          to="/signup"
          onClick={() => rememberIntent("/dashboard")}
        >
          Create learner profile
          <CheckCircle2 size={18} aria-hidden="true" />
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default HomePage;
