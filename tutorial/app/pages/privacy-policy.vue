<template>
  <div class="bg-gray-50 min-h-screen">
    <NavigationNavbar />
    <!-- Header -->
    <section class="bg-gray-900 text-white">
      <div class="max-w-4xl mx-auto px-6 py-16">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Privacy Policy
        </h1>
        <p class="mt-3 text-sm text-gray-400">Last Updated: March 2025</p>
      </div>
    </section>

    <!-- Content -->
    <section class="max-w-4xl mx-auto px-6 py-14">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-10 text-gray-700 leading-relaxed">
        <p>
          <span class="font-semibold text-gray-900">Examtips</span>
          offers a mix of online and offline products and services. Our
          offline offerings include learning software built for
          individual users as well as tools designed for businesses. On
          the online side, we run a payment platform, a reseller system
          for purchasing and generating activation keys, an automated
          way to locate the nearest sales point, and related services.
          This Privacy Policy is here to help you understand what
          information we do and don't collect, and how we use whatever
          you share with us.
        </p>

        <!-- Looped sections -->
        <div v-for="section in sections" :key="section.title">
          <h2 class="text-xl font-bold text-gray-900 mb-4">
            {{ section.title }}
          </h2>

          <template v-for="(block, i) in section.content" :key="i">
            <!-- sub-heading -->
            <h3
              v-if="block.type === 'subheading'"
              class="font-semibold text-gray-900 mb-2"
            >
              {{ block.text }}
            </h3>

            <!-- paragraph -->
            <p
              v-else-if="block.type === 'paragraph'"
              class="mb-3"
              v-html="block.text"
            />

            <!-- bullet list -->
            <ul
              v-else-if="block.type === 'list'"
              class="list-disc list-inside space-y-1 mb-6"
            >
              <li v-for="(item, j) in block.items" :key="j" v-html="item" />
            </ul>

            <!-- link line (e.g. contact / website) -->
            <p v-else-if="block.type === 'link'" class="mb-3">
              {{ block.label }}
              <NuxtLink
                v-if="block.internal"
                :to="block.href"
                class="text-blue-600 hover:underline"
              >
                {{ block.text }}
              </NuxtLink>
              <a
                v-else
                :href="block.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline"
              >
                {{ block.text }}
              </a>
            </p>
          </template>
        </div>
      </div>
    </section>

    
    <NavigationFooter/>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Privacy Policy — Examtips',
})

type Block =
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'link'; label: string; text: string; href: string; internal?: boolean }

interface PolicySection {
  title: string
  content: Block[]
}

const sections: PolicySection[] = [
  {
    title: 'Information We Collect For Offline Products',
    content: [
      {
        type: 'paragraph',
        text: 'Activating any Examtips product requires an activation key. As part of that process, you\'ll be asked to provide at least a mobile number, and you may optionally provide an email address as well. If you ever reach out with feedback or report a problem, we may also collect an email address or mobile number in that exchange.',
      },
      {
        type: 'paragraph',
        text: 'We use this information for one purpose: to get your activation key to you, or to follow up with you about an issue that\'s been resolved. We do not sell or hand off your contact details to third parties.',
      },
      {
        type: 'paragraph',
        text: 'Our software does not quietly gather data from your device in the background. The only information we collect is what you choose to give us directly.',
      },
    ],
  },
  {
    title: 'Information We Collect For Online Services',
    content: [
      {
        type: 'paragraph',
        text: 'When you text us to find the sales point nearest you, that request — along with your mobile number — is passed automatically to our server. We hold onto your number only long enough to reply with the address you asked for. We do not sell this information.',
      },
      {
        type: 'paragraph',
        text: 'If you register as a reseller on our platform, we\'ll ask for some additional details, including your business address. This helps us understand our customers better, particularly since registered resellers can transact with us in larger amounts. Know-Your-Customer (KYC) checks like this are a standard part of Nigerian financial regulation whenever money is involved. As with everything else, we do not sell or share this information with third parties.',
      },
    ],
  },
  {
    title: 'Disclaimer',
    content: [
      {
        type: 'paragraph',
        text: 'Examtips is a product built and maintained by Abanise. We are not endorsed by, or affiliated with, any examination body. While Examtips owns its software outright, individual content belongs to the examination body or organization that originally produced it.',
      },
      {
        type: 'paragraph',
        text: 'We do not knowingly host content obtained through improper means. Everything on our platform is either made freely available to the public by the relevant examination body, or created independently by our own educational consultants.',
      },
      {
        type: 'paragraph',
        text: 'Abanise is, at its core, a software company — that context is worth keeping in mind when interpreting the scope of this policy.',
      },
    ],
  },
]
</script>