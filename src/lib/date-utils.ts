export function formatDateForLocale(dateString: string, locale: string = "en-US"): string {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString(locale, options);
  } catch {
    return dateString;
  }
}

export function getUserPreferredLocale(): string {
  if (typeof navigator !== "undefined") {
    return navigator.language || "en-US";
  }
  return "en-US";
}
