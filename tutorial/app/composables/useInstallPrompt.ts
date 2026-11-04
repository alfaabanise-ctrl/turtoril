// composables/useInstallPrompt.ts
export type DevicePlatform = "unknown" | "ios" | "android" | "desktop";

export const useInstallPrompt = () => {
  const platform = useState<DevicePlatform>("pwa-platform", () => "unknown");
  const deferredPrompt = useState<any>("pwa-deferred-prompt", () => null);
  const isInstalled = useState("pwa-installed", () => false);
  const isInAppBrowser = useState("pwa-in-app-browser", () => false);
  const showIosHelp = useState("pwa-ios-help", () => false);
  const listening = useState("pwa-listening", () => false);

  const isIos = computed(() => platform.value === "ios");
  const isAndroid = computed(() => platform.value === "android");
  const isDesktop = computed(() => platform.value === "desktop");
  const canInstall = computed(() => !!deferredPrompt.value);

  onMounted(() => {
    const ua = window.navigator.userAgent;

    // iPadOS 13+ reports itself as "Macintosh", so also check touch points
    const ios =
      /iphone|ipad|ipod/i.test(ua) ||
      (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);

    const android = /android/i.test(ua);

    platform.value = ios ? "ios" : android ? "android" : "desktop";

    // Facebook, Instagram, WhatsApp, TikTok, etc. cannot add to Home Screen
    isInAppBrowser.value =
      /FBAN|FBAV|Instagram|WhatsApp|Line\/|TikTok|Snapchat|Twitter/i.test(ua);

    isInstalled.value =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;

    // Register global listeners only once
    if (listening.value) return;
    listening.value = true;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt.value = markRaw(e);
    });

    window.addEventListener("appinstalled", () => {
      isInstalled.value = true;
      deferredPrompt.value = null;
    });
  });

  /** Chrome: real install prompt. iOS: open the guide. */
  const install = async () => {
    if (deferredPrompt.value) {
      deferredPrompt.value.prompt();
      await deferredPrompt.value.userChoice;
      deferredPrompt.value = null;
      return;
    }

    if (isIos.value) {
      showIosHelp.value = true;
    }
  };

  return {
    platform,
    isIos,
    isAndroid,
    isDesktop,
    isInstalled,
    isInAppBrowser,
    canInstall,
    showIosHelp,
    install,
  };
};