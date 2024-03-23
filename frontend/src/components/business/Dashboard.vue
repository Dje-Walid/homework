<script>
import { RouterLink } from "vue-router"
import Layout from "@/components/business/Layout.vue"
import { useUserStore } from "@/stores/user"
import axios from "axios";

export default {
  name: "Dashboard",
  components: {
    Layout,
  },
  setup() {
    const userStore = useUserStore()
    console.log(userStore)

    return { userStore }
  },
  data() {
    return {
      username: "",
      password: "",
      name: "",
      type: "",
      error: "",
    }
  },
  methods: {
    async logout() {
      await this.userStore.signOut()
      this.$router.push("/login")
    },
    async createVM() {
      try {
        await axios.post("http://localhost:3000/createVm", {
          username: this.username,
          password: this.password,
          name: this.name,
          type: this.type,
        })

        this.username = ""
        this.password = ""
        this.name = ""
        this.type = "Linux"
      } catch (error) {
        console.log(error)
        this.error = "Email or password is incorrect."
      }
    },
  },
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
        <form
          class="bg-white shadow-md border-black rounded-lg px-8 py-8"
          @submit.prevent="createVM"
        >
          <div>
            <a
              v-if="error"
              v-text="error"
              class="text-red-500 flex justify-center"
            ></a>
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="username"
              >Username</label
            >
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              v-model="username"
              placeholder="Username"
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="password"
              >Password</label
            >
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              v-model="password"
              placeholder="************"
            />
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="username"
                >Name of VM</label
              >
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                v-model="name"
                placeholder="Name of VM"
              />
            </div>
            <div class="mb-4">
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="type"
                >Type:</label
              >
              <select
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="type"
                v-model="type"
                required
              >
                <option value="Linux">Linux</option>
                <option value="Windows">Windows</option>
                <option value="Debian">Debian</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <button
              class="bg-gray-900 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create VM
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>
