
export const useSoftwareDownloads = () => {
  const config = useRuntimeConfig();

  const apiBase = config.public.apiUrl;

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

  async function downloadSoftware(
    platform: "windows" | "android",
    driveUrl: string
  ) {
    // Do not delay the actual download if analytics fails.
    const visitorId = getVisitorId();
    console.log("Visitor ID:", visitorId);
    try {
      const res =await $fetch(
        `${apiBase}/api/analytics/software/download-click`,
        {
          method: "POST",
          body: {
            platform,
            visitorId,
            source: "examtips-website",
          },
          timeout: 2000,
        }
      );
      console.log("Download click recorded:", res);
    } catch (error) {
      console.warn(
        "Could not record download click:",
        error
      );
    } finally {
      window.location.assign(driveUrl);
    }
  }

  return { downloadSoftware };
};
