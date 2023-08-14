import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: "/",
    name: "parking",
    component: ParkingView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
