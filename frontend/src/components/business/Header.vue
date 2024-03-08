<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="border-b-2 border-black">
    <div class="flex justify-between mx-10">
      <div class="flex flex-row items-center">
        <img src=""><img>
      </div>
      <div class="flex flex-row items-center mr-8 gap-6">
        <router-link to="/pricing" class="hover:text-blue-400">Pricing</router-link>
        <router-link to="/about" class="hover:text-blue-400">About us</router-link>
        <router-link to="/sign" class="hover:text-blue-400">Sign in</router-link>
      </div>
    </div>
  </header>
</template>
