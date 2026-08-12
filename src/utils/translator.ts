/**
 * Translation utility leveraging free MyMemory API
 * Supports translating between Indonesian ('id') and English ('en')
 */
export async function translateText(
  text: string,
  fromLang: "id" | "en" = "id",
  toLang: "id" | "en" = "en"
): Promise<string> {
  if (!text || !text.trim() || fromLang === toLang) {
    return text;
  }

  try {
    const langpair = `${fromLang}|${toLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text.trim()
    )}&langpair=${langpair}`;

    const res = await fetch(url);
    if (!res.ok) {
      return text;
    }

    const data = await res.json();
    if (data && data.responseData && data.responseData.translatedText) {
      const result = data.responseData.translatedText;
      // Handle MyMemory error response fallback
      if (typeof result === "string" && !result.includes("QUERY LENGTH LIMIT EXCEEDED")) {
        return result;
      }
    }
  } catch (error) {
    console.warn("Auto translation failed, using fallback:", error);
  }

  return text;
}
