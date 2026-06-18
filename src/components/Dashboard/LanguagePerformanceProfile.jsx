import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";

const chartValue = (item) => (typeof item.value === "number" ? item.value : 0);

const LanguagePerformanceProfile = ({ profile = [], height = 280 }) => {
  const { t } = useTranslation();
  const data = profile.map((item) => ({
    ...item,
    label: t(`domain.${item.skillArea}`, item.skillArea),
    value: chartValue(item),
  }));

  return (
    <div className="h-full min-h-[260px] w-full">
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} margin={{ top: 16, right: 28, bottom: 16, left: 28 }}>
          <PolarGrid stroke="#d1d5db" />
          <PolarAngleAxis dataKey="label" tick={{ fill: "currentColor", fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "currentColor", fontSize: 11 }} />
          <Radar
            dataKey="value"
            stroke="#059669"
            fill="#10b981"
            fillOpacity={0.28}
            strokeWidth={2}
            dot={{ r: 3, fill: "#059669" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LanguagePerformanceProfile;
