<template>
  <Transition
    enter-active-class="duration-300"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >


    <div 
     v-if="props.show"
      class="fixed  inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-1 sm:p-4"
    > 
      <div
        class="w-full h-[80%] overflow-y-auto  max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
     
        <!-- Header -->
        <div class=" bg-primary text-white px-2 sm:px-6 py-5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold">Withdrawal Account</h2>
              <p class="text-indigo-100 text-sm">
                Withdraw directly to your linked bank account.
              </p>
            </div>

            <div
              class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl"
            >
              💼
            </div>
          </div>
        </div>

        <div
            v-if="!accountDetails || !accountDetails.accountNumber"
            class="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4"
          >
            <p class="font-semibold text-blue-800">
              No withdrawal account found.
            </p>
            <p class="mt-1 text-sm text-blue-700">
              Please set up your bank account before requesting a withdrawal.
            </p>
          </div>

      <div
        v-else-if="accountDetails.status === 'PENDING'"
        class="mb-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4"
      >
        <p class="font-semibold text-yellow-800">
          Bank account verification is pending.
        </p>
        <p class="mt-1 text-sm text-yellow-700">
          Your bank account is currently under review. Withdrawals will be available once it has been approved.
        </p>
      </div>

      <div
        v-else-if="accountDetails.status === 'REJECTED'"
        class="mb-5 rounded-xl border border-red-200 bg-red-50 p-4"
      >
        <p class="font-semibold text-red-800">
          Bank account verification was rejected.
        </p>
        <p class="mt-1 text-sm text-red-700">
          Please update your bank account details and submit them again for verification before you can withdraw funds.
        </p>
      </div>

        <!-- Bank Card -->
        <div class="sm:p-6 p-2">

          <div class="rounded-2xl border border-gray-200 sm:p-5 p-2 bg-gray-50">

            <div class="space-y-4">

              <div class="flex justify-between items-start">
                <div>
                  <p class="text-xs text-gray-500">
                    Account Name
                  </p>

                  <h3 class="font-semibold text-sm text-gray-900">
                   {{accountDetails.accountName}}
                  </h3>
                </div>

                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    accountDetails.status === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : accountDetails.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700'
                      : accountDetails.status === 'REJECTED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  ]"
                >
                  {{ accountDetails.status }}
                </span>
              </div>

              <div class="grid grid-cols-1 gap-4">

                <div>
                  <p class="text-xs text-gray-500">
                    Bank
                  </p>

                  <p class="font-medium text-md">
                     {{accountDetails.bankName}} 
                  </p>
                </div>

                <div>
                  <p class="text-xs text-gray-500">
                    Account Number
                  </p>

                  <p class="font-medium">
                    {{accountDetails.accountNumber}}
                  </p>
                </div>

              </div>

              <div class="pt-2 border-t">

                <p class="text-xs text-gray-500">
                  Available Balance
                </p>

                <h2 class="text-xl font-bold text-indigo-600">
                
             {{formatMoney(auth?.user?.wallet?.balance)}}
                  <!-- ₦1,250,000.00 -->
                </h2>

              </div>

            </div>

          </div>

          <!-- Amount -->
          <div class="mt-6">

            <label class="block mb-2 text-sm font-medium text-gray-700">
              Withdrawal Amount
            </label>

            <div
              class="flex items-center rounded-xl border border-gray-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100"
            >
              <span class="px-4 text-lg font-semibold text-gray-500">
                ₦
              </span>

              <input
                  v-model="amount"
                  type="text"
                  inputmode="numeric"
                  placeholder="0.00"
                  @input="sanitizeAmount"
                  class="w-full py-3 pr-4 outline-none text-lg font-semibold"
                />
              
            </div>
         <span class=" text-sm pl-4  text-red-600   -semibold ">Remining {{ amount ? formatMoney(remainingBalance) : "—" }}</span> 
          </div>

          <!-- Quick Amount -->
          <div class="grid grid-cols-3 gap-2 mt-5">

            <button
              v-for="item in quickAmount"
              :key="item"
             
              @click="amount = item"
              class="rounded-xl border py-2 hover:bg-indigo-50 hover:border-indigo-500 transition"
            >
              ₦{{ item.toLocaleString() }}
            </button>

          </div>

          <!-- Buttons -->
          <div class="mt-6 space-y-3">
               <!-- ['PENDING', 'REJECTED'].includes(accountDetails.status) -->
              
           <button
              @click="submit"
              :disabled="
              remainingBalance < 0 ||
               Number(amount) <= 0 ||
                 ['PENDING', 'REJECTED'].includes(accountDetails.status) 
             
              
              "
              class="w-full py-3 rounded-xl font-semibold text-white transition
                    bg-indigo-600 hover:bg-indigo-700
                    disabled:bg-gray-300 disabled:text-gray-500
                    disabled:cursor-not-allowed disabled:hover:bg-gray-300"
            > 
              Withdraw Funds
            </button>
            <button
              @click="emit('edit-account')"
              class="w-full border border-gray-300 py-3 rounded-xl font-medium hover:bg-gray-100 transition"
            >
              Edit Bank Account
            </button>

            <button
            @click="close"
              class="w-full text-gray-500 hover:text-red-500 py-2"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from "vue";
const auth = useAuth()
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});


const accountDetails  =  ref({})
const emit = defineEmits([
  "update:show",
  "withdraw",
  "edit-account",
]);

const amount = ref("");

const quickAmount = [
  5000,
  10000,
  25000,
  50000,
  100000,
  250000,
];

const close = () => {
  emit("update:show", false);
};

const submit = () => {
  emit("withdraw", amount.value);
};



const formatMoney = value => {
  return (Number(value || 0) / 100).toLocaleString(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2
    }
  )
}

const preventNegative = (e) => {
  if (e.key === "-" || e.key === "e") {
    e.preventDefault();
  }
};




const maxWithdrawal = computed(() => {
  // Convert wallet balance from kobo to naira
  return Math.floor(Number(auth.value?.user?.wallet?.balance || 0) / 100);
});

const sanitizeAmount = (e) => {
  // Keep only digits
  let value = e.target.value.replace(/\D/g, "");

  // Remove leading zeros
  value = value.replace(/^0+(?=\d)/, "");

  let number = Number(value || 0);

  // Don't allow more than available balance
  if (number > maxWithdrawal.value) {
    number = maxWithdrawal.value;
  }

  amount.value = number ? number.toString() : "";
};
const loadBankAccount = async () => {
  try {
    const res = await useApiFetch("/payout/bank-details", {
      method: "GET",
    })
  console.log(res.data.data);
  
    if (res.success && res.data.data) {
   

      console.log(res.data.data);
      
      accountDetails.value = res.data.data
    console.log(accountDetails,'accountDetails');
    
      
      
    }

  } catch (err) {
    console.log(err)
  }
}


const remainingBalance = computed(() => {
  const balance = Number(auth.value?.user?.wallet?.balance || 0); // kobo
  const withdraw = Number(amount.value || 0) * 100; // convert ₦ to kobo

  return balance - withdraw;
});
loadBankAccount()


</script>
