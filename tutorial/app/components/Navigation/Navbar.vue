<script setup lang="ts">
import { ref } from "vue";

const productOpen = ref(false);

const navItems = [
  {
    label: "Home",
    to: "/",
    icon: "lucide:house",
  },
  {
    label: "Product",
    to: "#",
    icon: "lucide:package",
    dropdown: [
      {
        label: "All Products",
        to: "/products",
        icon: "lucide:boxes",
      },
      {
        label: "CBT Practice",
        to: "/cbt",
        icon: "lucide:monitor-check",
      },
      {
        label: "Mock Examination",
        to: "/mock-exam",
        icon: "lucide:file-check-2",
      },
    ],
  },
  {
    label: "Buy",
    to: "/buy",
    icon: "lucide:shopping-cart",
  },
  {
    label: "Sales Point",
    to: "/sales-point",
    icon: "lucide:store",
  },
  {
    label: "Blog",
    to: "/blog",
    icon: "lucide:book-open",
  },
  {
    label: "School Finder",
    to: "/school-finder",
    icon: "lucide:school",
  },
  {
    label: "Login",
    to: "/login",
    icon: "lucide:log-in",
  },
  {
    label: "Become a Reseller",
    to: "/reseller",
    icon: "lucide:badge-percent",
  },
  {
    label: "Contact",
    to: "/contact",
    icon: "lucide:phone",
  },
  {
    label: "Past Questions",
    to: "/past-questions",
    icon: "lucide:history",
  },
];
</script>

<template>
  <header class="w-full bg-[#0794bd] text-white shadow-sm">
    <div class="mx-auto flex min-h-[64px] max-w-[1350px] items-stretch">
      <!-- LOGO -->
      <NuxtLink to="/" class="flex shrink-0 items-center px-5">
        <div class="flex items-center gap-2">
          <!-- Replace this with your real logo -->
          <div  class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-yellow-400 bg-white font-bold text-[#0794bd]" >
            TD
          </div>

          <span class="text-[20px] font-medium tracking-tight"> ExamTips </span>
        </div>
      </NuxtLink>

      <!-- NAVIGATION -->
      <nav class="flex flex-1 items-stretch">
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

              <span>
                {{ item.label }}
              </span>

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

                  <span>
                    {{ dropdownItem.label }}
                  </span>
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

            <span>
              {{ item.label }}
            </span>
          </NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>
