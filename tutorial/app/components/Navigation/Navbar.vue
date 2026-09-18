<script setup lang="ts">
import { ref } from "vue";

const productOpen = ref(false);
const mobileMenuOpen = ref(false);
const mobileProductOpen = ref(false);

const navItems = [
  {
    label: "Home",
    to: "/",
    icon: "lucide:house",
  },
  // {
  //   label: "Product",
  //   to: "#",
  //   icon: "lucide:package",
  //   dropdown: [
  //     {
  //       label: "All Products",
  //       to: "/products",
  //       icon: "lucide:boxes",
  //     },
  //     {
  //       label: "CBT Practice",
  //       to: "/cbt",
  //       icon: "lucide:monitor-check",
  //     },
  //     {
  //       label: "Mock Examination",
  //       to: "/mock-exam",
  //       icon: "lucide:file-check-2",
  //     },
  //   ],
  // },
  {
    label: "Buy",
    to: "/buy",
    icon: "lucide:shopping-cart",
  },
  {
    label: "Blog",
    to: "/blog",
    icon: "lucide:book-open",
  },
  {
    label: "Login",
    to: "/auth",
    icon: "lucide:log-in",
  },
  {
    label: "Contact",
    to: "/contact",
    icon: "lucide:phone",
  },
];

// Close the mobile menu whenever a link is clicked
function closeMobileMenu() {
  mobileMenuOpen.value = false;
  mobileProductOpen.value = false;
}
</script>

<template>
  <header class="w-fullw-full bg-[#0794bd] text-white shadow-sm  text-white shadow-sm relative z-50">
    <div class="mx-auto flex min-h-[40px] max-w-[1350px]  justify-center items-stretch px-2 sm:px-0">
      <!-- LOGO -->
      <NuxtLink to="/" class="flex shrink-0 items-center px-3 sm:px-5" @click="closeMobileMenu">
        <div class="flex items-center gap-2">
          <div class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-yellow-400 bg-white font-bold text-[#0794bd]">
            ET
          </div>

          <span class="text-[18px] sm:text-[20px] font-medium tracking-tight">
            ExamTips
          </span>
        </div>
      </NuxtLink>

      <!-- DESKTOP NAVIGATION -->
      <nav class="hidden md:flex flex-1 w-full justify-end items-stretch">
        <template v-for="item in navItems" :key="item.label">
          <!-- ITEM WITH DROPDOWN -->
          <div
            v-if="item.dropdown"
            class="relative"
            @mouseenter="productOpen = true"
            @mouseleave="productOpen = false"
          >
            <button
              type="button"
              class="flex h-full items-center gap-1.5 px-4 text-[14px] transition hover:bg-[#056f93]"
            >
              <Icon :name="item.icon" class="h-[16px] w-[16px]" />
              <span>{{ item.label }}</span>
              <Icon
                name="lucide:chevron-down"
                class="h-3.5 w-3.5 transition-transform"
                :class="{ 'rotate-180': productOpen }"
              />
            </button>

            <!-- DROPDOWN -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="translate-y-1 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="translate-y-1 opacity-0"
            >
              <div
                v-if="productOpen"
                class="absolute left-0 top-full z-50 w-56 overflow-hidden rounded-b-lg bg-white py-2 text-gray-700 shadow-xl"
              >
                <NuxtLink
                  v-for="dropdownItem in item.dropdown"
                  :key="dropdownItem.label"
                  :to="dropdownItem.to"
                  class="flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-100 hover:text-[#0794bd]"
                >
                  <Icon :name="dropdownItem.icon" class="h-4 w-4" />
                  <span>{{ dropdownItem.label }}</span>
                </NuxtLink>
              </div>
            </Transition>
          </div>

          <!-- NORMAL ITEM -->
          <NuxtLink
            v-else
            :to="item.to"
            class="group flex items-center gap-1.5 px-4 text-[14px] transition hover:bg-[#056f93]"
            active-class="bg-[#056f93]"
          >
            <Icon
              :name="item.icon"
              class="h-[16px] w-[16px] transition group-hover:scale-110"
            />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </template>
      </nav>

      <!-- SPACER pushes hamburger to the right on mobile -->
      <div class="flex-1 md:hidden"></div>

      <!-- MOBILE MENU BUTTON -->
      <button
        type="button"
        class="flex items-center justify-center px-4 md:hidden"
        :aria-expanded="mobileMenuOpen"
        aria-label="Toggle navigation menu"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <Icon
          :name="mobileMenuOpen ? 'lucide:x' : 'lucide:menu'"
          class="h-6 w-6"
        />
      </button>
    </div>

    <!-- MOBILE NAVIGATION PANEL -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <nav
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-white/10 bg-[#0794bd] pb-3"
      >
        <template v-for="item in navItems" :key="item.label">
          <!-- MOBILE ITEM WITH DROPDOWN -->
          <div v-if="item.dropdown">
            <button
              type="button"
              class="flex w-full items-center justify-between gap-1.5 px-5 py-3 text-[15px] transition hover:bg-[#056f93]"
              @click="mobileProductOpen = !mobileProductOpen"
            >
              <span class="flex items-center gap-2">
                <Icon :name="item.icon" class="h-[16px] w-[16px]" />
                {{ item.label }}
              </span>
              <Icon
                name="lucide:chevron-down"
                class="h-4 w-4 transition-transform"
                :class="{ 'rotate-180': mobileProductOpen }"
              />
            </button>

            <div v-if="mobileProductOpen" class="bg-[#056f93]/40">
              <NuxtLink
                v-for="dropdownItem in item.dropdown"
                :key="dropdownItem.label"
                :to="dropdownItem.to"
                class="flex items-center gap-3 py-3 pl-10 pr-5 text-sm transition hover:bg-[#056f93]"
                @click="closeMobileMenu"
              >
                <Icon :name="dropdownItem.icon" class="h-4 w-4" />
                <span>{{ dropdownItem.label }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- MOBILE NORMAL ITEM -->
          <NuxtLink
            v-else
            :to="item.to"
            class="flex items-center gap-2 px-5 py-3 text-[15px] transition hover:bg-[#056f93]"
            active-class="bg-[#056f93]"
            @click="closeMobileMenu"
          >
            <Icon :name="item.icon" class="h-[16px] w-[16px]" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </template>
      </nav>
    </Transition>
  </header>
</template>