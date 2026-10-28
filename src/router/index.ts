import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/dashboard.vue"),
    meta: { title: "Dashboard" },
  },
  {
    path: "/createApplication",
    name: "add application",
    component: () => import("../views/createApplication.vue"),
    meta: { title: "Nouvelle candidature", hideNav: true },
  },
  {
    path: "/applications",
    name: "applications",
    component: () => import("../views/ApplicationList.vue"),
    meta: { title: "Mes candidatures" },
  },
  {
    path: "/statistics",
    name: "statistics",
    component: () => import("../views/Statistics.vue"),
    meta: { title: "Statistiques" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 };
  },
});

router.afterEach((to) => {
  const title = to.meta.title as string | undefined;
  document.title = title ? `${title} · Searchive` : "Searchive";
});

export default router;