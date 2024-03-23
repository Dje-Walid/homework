<script>
import axios from "axios"
import * as Yup from "yup"
import { useRouter } from "vue-router"

export default {
  setup() {
    const router = useRouter()

    return { router }
  },
  data() {
    return {
      username: "",
      password: "",
      name: "",
      type: "",
      error: "",
      succes: "",
      creatingVm: false,
    }
  },
  props: ['userStore'],
  methods: {
    async createVM() {
      try {
        this.creatingVm = true
        if (this.userStore.user.credit < 49) {
          throw new Error("You do not have enough credits to create a VM.")
        }

        const passwordSchema = Yup.string()
          .min(10, "Password must be at least 10 characters long")
          .matches(
            /[A-Z]/,
            "Password must contain at least one uppercase letter",
          )
          .matches(
            /[a-z]/,
            "Password must contain at least one lowercase letter",
          )
          .matches(/[0-9]/, "Password must contain at least one digit")
          .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain at least one special character",
          )

        await passwordSchema.validate(this.password)

        await axios.post("http://localhost:3000/createVm", {
          username: this.username,
          password: this.password,
          name: this.name,
          type: this.type,
          userId: this.userStore.user.id,
        })
        this.success = "Virtual machines created !"
        this.userStore.reduceCredit()
        this.$router.push("/")
      } catch (error) {
        this.error = error
      }
    },
  },
}
</script>

<template>
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
      <a
        v-if="succes"
        v-text="succes"
        class="text-green-500 flex justify-center"
      ></a>
      <a
        v-if="creatingVm"
        text="We are creating your virtual machine please wait ..."
        class="text-green-500 flex justify-center animate-pulse"
      ></a>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username"
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
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password"
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
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username"
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
        <label class="block text-gray-700 text-sm font-bold mb-2" for="type"
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
        :disabled="creatingVm"
        class="bg-gray-900 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Create VM
      </button>
    </div>
  </form>
</template>
