import { createRouter, createMemoryHistory } from 'vue-router'
import Dashboard from '@/components/business/Dashboard.vue';
import Login from '@/components/business/Login.vue';
import { useUserStore } from '@/stores/user';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.matched.some(record => record.meta.requiresAuth) && !userStore.user) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router
