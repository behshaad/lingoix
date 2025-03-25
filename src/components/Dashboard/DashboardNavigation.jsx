import { useState } from "react";
import { gsap } from "gsap";
import {
  Book,
  Headphones,
  PenTool,
  Trophy,
  Award,
  MessageSquare,
  Brain,
} from "lucide-react";

const navigationItems = [
  {
    id: "overview",
    title: "نمای کلی",
    icon: Trophy,
    description: "پیشرفت و دستاوردهای شما",
  },
  {
    id: "vocabulary",
    title: "واژگان",
    icon: Book,
    description: "تمرین واژگان با جعبه لایتنر",
  },
  {
    id: "audio",
    title: "شنیداری",
    icon: Headphones,
    description: "تمرین مهارت شنیداری",
  },
  {
    id: "writing",
    title: "نوشتاری",
    icon: PenTool,
    description: "تمرین مهارت نوشتاری",
  },
  {
    id: "certificates",
    title: "مدارک",
    icon: Award,
    description: "مدارک و گواهینامه‌های شما",
  },
  {
    id: "chat",
    title: "چت",
    icon: MessageSquare,
    description: "گفتگو با اساتید",
  },
  {
    id: "ai-assistant",
    title: "دستیار هوشمند",
    icon: Brain,
    description: "پاسخ به سوالات گرامری",
  },
];

export default function DashboardNavigation({ onNavigate, activeSection }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (id) => {
    setHoveredItem(id);
    gsap.to(`#nav-item-${id}`, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = (id) => {
    setHoveredItem(null);
    gsap.to(`#nav-item-${id}`, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div className="fixed right-0 top-0 h-full w-64 bg-card border-l border-border p-4 overflow-y-auto">
      <div className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const isHovered = hoveredItem === item.id;

          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={() => handleMouseLeave(item.id)}
              className={`w-full p-4 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <div className="text-right">
                  <div className="font-medium">{item.title}</div>
                  <div
                    className={`text-sm ${
                      isActive
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
