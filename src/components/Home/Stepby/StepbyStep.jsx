import { useTranslation } from "react-i18next";
import "./styles.css";

const StepbyStep = () => {
  const { t } = useTranslation();

  const steps = [
    {
      title: t("steps.1"),
      description: t("description.1"),
    },
    {
      title: t("steps.2"),
      description: t("description.2"),
    },
    {
      title: t("steps.3"),
      description: t("description.3"),
    },
    {
      title: t("steps.4"),
      description: t("description.4"),
    },
    {
      title: t("steps.5"),
      description: t("description.5"),
    },
  ];

  return (
    <div className="timeline flex justify-center ">
      <div className="timeline-inner ">
        {steps.map((step, index) => (
          <div key={index} className="card">
            <div className="info">
              <h3 className="title text-xl font-semibold">{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepbyStep;
