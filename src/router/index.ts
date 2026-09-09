import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

// Définition des routes
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/dashboard.vue"), // Lazy loading
    meta: { title: "Dashboard" },
  },
  {
    path: "/createApplication",
    name: "add application",
    component: () => import("../views/createApplication.vue"), // Lazy loading
    meta: { title: "Nouvelle candidature", hideNav: true },
  },
  {
    path: "/createCompany",
    name: "createCompany",
    component: () => import("../views/createCompany.vue"),
    meta: { title: "Nouvelle entreprise", hideNav: true },
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
    // Toute URL inconnue renvoie vers le dashboard
    path: "/:pathMatch(.*)*",
    name: "not-found",
    redirect: { name: "home" },
  },
];

// Création du routeur
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Revenir en haut de page à chaque navigation (garder la position au retour arrière)
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 };
  },
});

// Met à jour le titre de l'onglet en fonction de la route
router.afterEach((to) => {
  const title = to.meta.title as string | undefined;
  document.title = title ? `${title} · Searchive` : "Searchive";
});

export default router;
