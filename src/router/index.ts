import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// Définition des routes
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Dashboard.vue"), // Lazy loading
  },
  {
    path: "/createApplication",
    name: "add application",
    component: () => import("../views/createApplication.vue"), // Lazy loading
  },
  {
    path: "/createCompany",
    name: "createCompany",
    component: () => import("../views/createCompany.vue"),
  },
  {
    path: "/applications",
    name: "applications",
    component: () => import("../views/ApplicationList.vue"),
  },
];

// Création du routeur
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation Guards (optionnel)
router.beforeEach((to, from, next) => {
  // Vérifier l'authentification
  console.log("Navigation vers:", to.path);
  next();
});

export default router;
