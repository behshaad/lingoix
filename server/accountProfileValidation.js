const PHONE_PATTERN = /^[0-9+\-()\s]*$/;
const MAX_AVATAR_LENGTH = 900000;

const normalizeString = (value) => String(value || "").trim();

const validateAccountProfileInput = (input = {}) => {
  const displayName = normalizeString(input.displayName);
  const phone = normalizeString(input.phone);
  const bio = normalizeString(input.bio);
  const avatarUrl = input.avatarUrl ? String(input.avatarUrl) : null;

  if (!displayName) return { error: "display_name_required" };
  if (displayName.length < 2) return { error: "display_name_too_short" };
  if (displayName.length > 80) return { error: "display_name_too_long" };
  if (phone.length > 40) return { error: "phone_too_long" };
  if (phone && !PHONE_PATTERN.test(phone)) return { error: "invalid_phone" };
  if (bio.length > 280) return { error: "bio_too_long" };
  if (avatarUrl && (!avatarUrl.startsWith("data:image/") || avatarUrl.length > MAX_AVATAR_LENGTH)) {
    return { error: "invalid_avatar" };
  }

  return {
    value: {
      displayName,
      phone,
      bio,
      avatarUrl,
    },
  };
};

module.exports = { validateAccountProfileInput };
