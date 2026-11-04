<script setup lang="ts">
const { showIosHelp, isInAppBrowser } = useInstallPrompt();

/* ================================================================
 * CHANGE THIS to the address where your app is hosted
 * ================================================================ */
const APP_URL = "https://app.examtips.abanise.com";

/* ================================================================
 * STEPS
 * Put your screenshots in:  public/images/ios/step-1.png ... step-4.png
 * If an image is missing, an icon is shown instead.
 * ================================================================ */
interface Step {
  title: string;
  text: string;
  image: string;
  icon: string;
}

const steps: Step[] = [
  {
    title: "Open the app in Safari",
    text: "Tap the blue Start download button below. The app opens in a new Safari tab. Do the next steps on that tab.",
    image: "/images/ios/step-1.png",
    icon: "lucide:compass",
  },
  {
    title: "Tap the menu icon",
    text: "When the login page appears, tap the menu icon (three lines) at the left of the address bar at the bottom.",
    image: "/images/ios/step-2.png",
    icon: "lucide:menu",
  },
  {
    title: "Tap Share",
    text: "In the menu that opens, tap Share at the top.",
    image: "/images/ios/step-3.png",
    icon: "lucide:share",
  },
  {
    title: "Tap View More",
    text: "In the share sheet, tap View More (the arrow at the bottom right) to show all options.",
    image: "/images/ios/step-4.png",
    icon: "lucide:chevron-down",
  },
  {
    title: "Tap Add to Home Screen",
    text: "Find Add to Home Screen in the list and tap it. Scroll down a little if you do not see it.",
    image: "/images/ios/step-5.png",
    icon: "lucide:plus-square",
  },
  {
    title: "Keep Web App on, then tap Add",
    text: "Leave Open as Web App switched on, then tap Add in the top right corner. ExamTips now appears on your Home Screen.",
    image: "/images/ios/step-6.png",
    icon: "lucide:check-circle-2",
  },
];

// Hide images that fail to load and show the icon instead
const failed = reactive<Record<string, boolean>>({});

function close() {
  showIosHelp.value = false;
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") close();
}

// Lock page scroll while the guide is open and allow Esc to close it
watch(showIosHelp, (open) => {
  if (!import.meta.client) return;

  document.body.style.overflow = open ? "hidden" : "";

  if (open) {
    window.addEventListener("keydown", onKey);
  } else {
    window.removeEventListener("keydown", onKey);
  }
});

onBeforeUnmount(() => {
  if (!import.meta.client) return;
  document.body.style.overflow = "";
  window.removeEventListener("keydown", onKey);
});
</script>

<template>
  <ClientOnly>
  <Teleport to="body">
    <div
      v-if="showIosHelp"
      class="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/70 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ios-guide-title"
      @click.self="close"
    >
      <div
        class="flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]"
      >
        <!-- Header -->
        <div
          class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 sm:px-8"
        >
          <div>
            <h2
              id="ios-guide-title"
              class="text-xl font-bold tracking-tight text-slate-950"
            >
              Install ExamTips ddd on your iPhone
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              Follow these 6 steps. It takes about 20 seconds.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close guide"
            class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            @click="close"
          >
            <Icon name="lucide:x" class="h-5 w-5" />
          </button>
        </div>

        <!-- Scrollable steps -->
        <div class="flex-1 overflow-y-auto px-6 py-6 sm:px-8">

          <!-- In-app browser warning -->
          <div
            v-if="isInAppBrowser"
            class="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800"
          >
            You are viewing this page inside another app (WhatsApp, Facebook,
            Instagram...). Open this page in <strong>Safari</strong> first,
            then follow the steps.
          </div>

          <ol class="space-y-6">
            <li
              v-for="(step, index) in steps"
              :key="step.title"
              class="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5"
            >
              <div class="flex items-start gap-4">
                <span
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0794bd] text-sm font-bold text-white"
                >
                  {{ index + 1 }}
                </span>

                <div>
                  <h3 class="text-base font-semibold text-slate-950">
                    {{ step.title }}
                  </h3>

                  <p class="mt-1 text-sm leading-6 text-slate-600">
                    {{ step.text }}
                  </p>
                </div>
              </div>

              <!-- Picture -->
              <div
                class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <img
                  v-if="!failed[step.image]"
                  :src="step.image"
                  :alt="`Step ${index + 1}: ${step.title}`"
                  loading="lazy"
                  class="mx-auto max-h-[32rem] w-auto object-contain"
                  @error="failed[step.image] = true"
                />

                <div
                  v-else
                  class="flex h-36 items-center justify-center bg-[#0794bd]/5"
                >
                  <Icon
                    :name="step.icon"
                    class="h-14 w-14 text-[#0794bd]"
                  />
                </div>
              </div>
            </li>
          </ol>
        </div>

        <!-- Footer action -->
        <div class="border-t border-slate-100 bg-white px-6 py-5 sm:px-8">
          <a
            :href="APP_URL"
            target="_blank"
            rel="noopener"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0794bd] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-cyan-950/10 transition hover:bg-[#0685aa]"
          >
            <Icon name="lucide:download" class="h-4 w-4" />
            Start download
          </a>

          <p class="mt-3 text-center text-xs text-slate-500">
            Opens the app in a new tab. Add it to your Home Screen from there.
          </p>
        </div>
      </div>
    </div>
  </Teleport>
  </ClientOnly>
</template>
