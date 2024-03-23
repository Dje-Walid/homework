<script>
import { useUserStore } from "@/stores/user"
import axios from "axios"
import { useRouter } from "vue-router"

export default {
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    return { userStore, router }
  },
  props: ["vms"],
  methods: {
    async turnOff(vmId) {
      try {
        await axios.put(`http://localhost:3000/vms/${vmId}/off`)
        const vmIndex = this.vms.findIndex((vm) => vm.id === vmId)
        if (vmIndex !== -1) {
          this.vms[vmIndex].status = "off"
        }
      } catch (error) {
        console.error("Error turning off VM:", error)
      }
    },
    async turnOn(vmId) {
      try {
        await axios.put(`http://localhost:3000/vms/${vmId}/on`)
        const vmIndex = this.vms.findIndex((vm) => vm.id === vmId)
        if (vmIndex !== -1) {
          this.vms[vmIndex].status = "on"
        }
      } catch (error) {
        console.error("Error turning on VM:", error)
      }
    },
    async deleteVM(vmId) {
      try {
        await axios.delete(`http://localhost:3000/vms/${vmId}`)
        this.vms = this.vms.filter((vm) => vm.id !== vmId)
        this.$router.push("/")
      } catch (error) {
        console.error("Error deleting VM:", error)
      }
    },
  },
}
</script>

<template>
  <div class="bg-white shadow-md border-black rounded-lg px-8 py-8">
    <table class="min-w-full p-4 divide-y divide-gray-200">
      <thead>
        <tr>
          <th
            scope="col"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Status
          </th>
          <th
            scope="col"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Type
          </th>
          <th
            scope="col"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Name
          </th>
          <th
            scope="col"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Username
          </th>
          <th
            scope="col"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Password
          </th>
          <th
            scope="col"
            class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Ip address
          </th>
          <th scope="col" class="px-6 py-3 bg-gray-50"></th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="vm in vms" :key="vm.id">
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              v-if="vm.status === 'on'"
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
            >
              On
            </span>
            <span
              v-else
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
            >
              Off
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ vm.type }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ vm.name }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ vm.username }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ vm.password }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ vm.ipToConnect }}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
          >
            <button
              v-if="vm.status === 'on'"
              @click="turnOff(vm.id)"
              class="text-red-600 hover:text-red-900"
            >
              Turn Off
            </button>
            <button
              v-else
              @click="turnOn(vm.id)"
              class="text-green-600 hover:text-green-900"
            >
              Turn On
            </button>
            <button
              @click="deleteVM(vm.id)"
              class="ml-4 text-indigo-600 hover:text-indigo-900"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
