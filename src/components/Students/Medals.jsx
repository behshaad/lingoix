

import { Medal } from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function AchievementMedals({ completedLessons }) {
  const hasBronze = completedLessons >= 3;
  const hasSilver = completedLessons >= 6;
  const hasGold = completedLessons >= 10;

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-6">مدال‌های پیشرفت</h2>
      <div className="flex flex-row gap-8 justify-center items-end">
        {/* Bronze Medal */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "p-4 rounded-full transition-all duration-300",
              hasBronze ? "bg-amber-100" : "bg-gray-100"
            )}
          >
            <Medal
              className={cn(
                "w-12 h-12",
                hasBronze ? "text-amber-700" : "text-gray-300"
              )}
            />
          </div>
          <span className="mt-2 text-sm font-medium">برنز</span>
          <span className="text-xs text-gray-500">۳ درس</span>
        </div>

        {/* Silver Medal */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "p-4 rounded-full transition-all duration-300",
              hasSilver ? "bg-gray-100" : "bg-gray-100"
            )}
          >
            <Medal
              className={cn(
                "w-14 h-14",
                hasSilver ? "text-gray-400" : "text-gray-200"
              )}
            />
          </div>
          <span className="mt-2 text-sm font-medium">نقره</span>
          <span className="text-xs text-gray-500">۶ درس</span>
        </div>

        {/* Gold Medal */}
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "p-4 rounded-full transition-all duration-300",
              hasGold ? "bg-yellow-100" : "bg-gray-100"
            )}
          >
            <Medal
              className={cn(
                "w-16 h-16",
                hasGold ? "text-yellow-500" : "text-gray-200"
              )}
            />
          </div>
          <span className="mt-2 text-sm font-medium">طلا</span>
          <span className="text-xs text-gray-500">۱۰ درس</span>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        تعداد درس‌های گذرانده شده: {completedLessons}
      </div>
    </div>
  );
}

export default AchievementMedals;