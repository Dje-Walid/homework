import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),
  

  actions: {
    async signIn(email, password) {
      const response = await axios.post("http://localhost:3000/signIn", { email, password });
      this.user = response.data;
      localStorage.setItem('user', JSON.stringify(this.user));
    },
    async signOut() {
      this.user = null;
      localStorage.removeItem('user');
    },
    async reduceCredit() {
      this.user.credit -= 50;
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  },
});