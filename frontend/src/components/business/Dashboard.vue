<script>
import Layout from "@/components/business/Layout.vue"
import { useUserStore } from "@/stores/user"
import CreateVMForm from "@/components/business/CreateVMForm.vue"
import ListVM from './ListVM.vue'
import axios from "axios"

export default {
  name: "Dashboard",
  components: {
    Layout,
    CreateVMForm,
    ListVM
  },
  data() {
    return {
      vms: "",
    }
  },
  setup() {
    const userStore = useUserStore()
    console.log(userStore)

    return { userStore }
  },
  methods: {
    async logout() {
      await this.userStore.signOut()
      this.$router.push("/login")
    },
    async getVms() {
      try {
        const response = await axios.get(`http://localhost:3000/vms?userId=${this.userStore.user.id}`);
        this.vms = response.data;
      } catch (error) {
        console.error("Error fetching VMs:", error);
      }
    }
  },
  mounted() {
    this.getVms();
  }
}
</script>

<template>
  <Layout>
    <div class="h-screen w-screen bg-gray-100">
      <div class="flex flex-row justify-between items-center h-16 p-4 border-b">
        <a>{{ userStore.user.credit }} €</a>
        <h1 class="text-xl font-bold">{{ userStore.user.email }}</h1>
        <button
          @click="logout"
          class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Log out
        </button>
      </div>
      <div class="p-10 w-96">
        <CreateVMForm :userStore="userStore"></CreateVMForm>
      </div>
      <div class="p-10">
        <ListVM :vms="vms"></ListVM>
      </div>
    </div>
  </Layout>
</template>
