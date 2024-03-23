<script>
import { useUserStore } from "@/stores/user.js"
import { useRouter } from "vue-router"
import Layout from "@/components/business/Layout.vue"
import { RouterLink } from "vue-router"

export default {
  components: {
    Layout,
    RouterLink,
  },
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    return { userStore, router }
  },
  data() {
    return {
      email: "",
      password: "",
      error: "",
    }
  },
  methods: {
    async login() {
      try {
        await this.userStore.signIn(this.email, this.password)
        this.$router.push("/")
      } catch (error) {
        this.error = "Email or password is incorrect."
      }
    },
  },
}
</script>

<template>
  <Layout>
    <div
      class="flex h-screen w-screen bg-gray-100 flex-col items-center justify-center"
    >
      <div>
        <form
          class="bg-white shadow-md border-black rounded-lg px-8 py-8 max-w-md w-full"
          @submit.prevent="login"
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
              for="email"
              >Email</label
            >
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              v-model="email"
              placeholder="Entrez votre email"
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
          </div>
          <div class="flex items-center justify-between">
            <button
              class="bg-gray-900 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
</template>
