<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import countries from "@/utils/countries.js";


// === States ===

const phone_number = ref('')
const selected = ref(
     { name: "United States", code: "US", icon: "twemoji:flag-united-states", phone: "+1", minDigits: 10, maxDigits: 10 },
)
const maxmiumPhone = ref(10)
const open = ref(false)

const selectItem = (country) => {
    selected.value = country;
    maxmiumPhone.value = country.maxDigits;
    // reset when switching country
    open.value = false;
};

// Format number into groups of 4 digits
const formatNumber = () => {
    
  let digits = phone_number.value.replace(/\D/g, "");

  digits = digits.substring(0, maxmiumPhone.value);

 
  phone_number.value = digits.replace(/(.{3})/g, "$1 ").trim();

   
};

</script>

<template>
    <div class="  w-full">
        <div class=" flex justify-center items-center  h-fit -  w-full     " >
        <div class=" z-20 bg-red-400    h-full bg  ">
            <!-- Selected Box -->
            <div class="border w-16  bg-slate-100 h-12 p-1  flex  items-center justify-between cursor-pointer bg-e "
                @click="open = !open" >
                <div class="flex items-center gap-1">
                    <Icon v-if="selected" :icon="selected.icon" class="w-4 h-4" />
                    <span class=" text-sm font-bold"> {{ selected?.phone || "Select Country" }}</span>
                </div>

                <Icon icon="mdi:chevron-down" class="w-4 h-4" />
            </div>

            <!-- Dropdown List -->
            <div v-if="open"
                class="absolute left-0 right-0 bg-white border rounded-lg mt- shadow-lg max-h-64 w-40  overflow-scroll z-50">
                <div v-for="item in countries" :key="item.code"
                    class="p-1 flex items-center gap-2 hover:bg-gray-100 cursor-pointer" @click="selectItem(item)">
                    <Icon :icon="item.icon" class="w-4 h-4" />
                    <span class=" text-[13px] whitespace-nowrap "> {{ item.name }} ({{ item.phone }})</span>
                </div>
            </div>
        </div>
        <div class=" w-full -">
            <input type="text" v-model="phone_number"  @change="formatNumber" class=" w-full py-3 px-4 border  outline-none ring-0 focus:outline-none  bg-white peer relative  h-12 ">
            <!-- <FormInput v-model:inputValue="phone_number"
        @input="formatNumber" type="text" placeholder="phone number" @change="formatNumber" /> -->
        </div>
    
    </div>
    </div>


</template>

<style scoped>
/* Scrollbar smoothness */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
}
</style>
