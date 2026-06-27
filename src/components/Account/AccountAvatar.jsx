import { UserCircle } from "lucide-react";

export const initialsFromName = (name = "", fallback = "L") => {
  const source = String(name || "").trim() || fallback;
  const parts = source.split(/\s+/).filter(Boolean);
  if (!parts.length) return fallback.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
};

const sizeClasses = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
  xl: "h-32 w-32 text-3xl",
};

const iconSizes = {
  sm: "h-6 w-6",
  md: "h-7 w-7",
  lg: "h-9 w-9",
  xl: "h-16 w-16",
};

const AccountAvatar = ({ src, name, alt, size = "md", className = "" }) => {
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const initials = initialsFromName(name);

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClass} rounded-full border border-gray-200 object-cover shadow-sm dark:border-gray-700 ${className}`}
      />
    );
  }

  return (
    <span
      aria-label={alt}
      className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white font-semibold text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 ${className}`}
    >
      {initials ? initials : <UserCircle className={iconSizes[size] || iconSizes.md} />}
    </span>
  );
};

export default AccountAvatar;
