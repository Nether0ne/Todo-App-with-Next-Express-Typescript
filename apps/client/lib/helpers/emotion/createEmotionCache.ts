import createCache, { EmotionCache } from "@emotion/cache";

const createEmotionCache = (): EmotionCache => {
  return createCache({ key: "styles", prepend: true });
};

export default createEmotionCache;
