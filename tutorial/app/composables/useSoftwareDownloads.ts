// composables/useSoftwareDownloads.ts
export type SoftwarePlatform = "windows" | "android" | "ios";

export const useSoftwareDownloads = () => {
  const config = useRuntimeConfig();

  const apiBase = config.public.apiUrl;

  // Used to ignore accidental double taps on the iOS button
  const lastSent: Record<string, number> = {};

  function getVisitorId() {
    if (!import.meta.client) return "";

    const key = "examtips_analytics_visitor";

    try {
      let id = localStorage.getItem(key);

      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
      }

      return id;
    } catch {
      return "";
    }
  }

  /**
   * Sends the click to the backend.
   * Never throws, so analytics can never break the page.
   */
  async function recordClick(platform: SoftwarePlatform) {
    try {
      const res = await $fetch(
        `${apiBase}/api/analytics/software/download-click`,
        {
          method: "POST",
          body: {
            platform,
            visitorId: getVisitorId(),
            source: "examtips-website",
          },
          timeout: 2000,
        }
      );

      return res;
    } catch (error) {
      console.warn("Could not record download click:", error);
    }
  }

  /**
   * Windows and Android: record the click, then start the download.
   * The download still starts if the analytics request fails.
   */
  async function downloadSoftware(
    platform: "windows" | "android",
    driveUrl: string
  ) {
    try {
      await recordClick(platform);
    } finally {
      window.location.assign(driveUrl);
    }
  }

  /**
   * iPhone / iPad: there is no file to download, so only record the click.
   * The caller opens the install guide.
   */
  function trackInstallClick(platform: "ios" = "ios") {
    if (!import.meta.client) return;

    const now = Date.now();
    if (now - (lastSent[platform] ?? 0) < 3000) return;
    lastSent[platform] = now;

    void recordClick(platform);
  }

  return { downloadSoftware, trackInstallClick };
};