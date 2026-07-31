# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).






# Searchive – Suivi et analyse de recherche de stage

**Projet de substitution au stage de M1**  
Master Informatique, Université de Rennes

## 🎯 Finalité du projet

L'objectif est de fournir aux étudiants un outil de suivi de leurs candidatures de stage, et de produire des statistiques exploitables pour améliorer l'accompagnement des promotions futures.  
L'application permet d'enregistrer ses démarches (entreprises contactées, statuts, dates, etc.), de visualiser sa progression et d'exporter des données agrégées.

## 🧪 Méthodologie Agile

Le projet suit une démarche **Agile / Scrum**, rythmée par des sprints successifs. Chaque sprint se conclut par un livrable exécutable et un document de suivi technique.

- **Sprint 0** : Mise en place de l'environnement, architecture, choix techniques.
- **Sprint 1** : CRUD des candidatures et des entreprises, interface de consultation avec recherche/filtrage.
- **Sprint 2** : Modification du statut des candidatures, suppression avec confirmation, visualisation graphique (Sankey, Gantt, évolution temporelle).
- **Sprint 3** : Export des données aux formats CSV et JSON.

## ⏱️ Gestion du temps

| Sprint   | Période          | Contenu principal                           |
|----------|------------------|---------------------------------------------|
| Sprint 0 | mi-juillet 2026  | Initialisation, architecture, documentation |
| Sprint 1 | fin juillet 2026 | Formulaires, listes, recherche et filtrage  |
| Sprint 2 | début août 2026  | Édition, suppression, graphiques            |
| Sprint 3 | mi-août 2026     | Export CSV/JSON, finalisation               |

La date limite de rendu du rapport et du livrable est fixée à **mi-août 2026**.

## 🧱 Stack technique

- **Application 100% front-end** (pas de backend)
- **Vue 3** avec **TypeScript**
- **Vite** comme outil de build
- **Pinia** pour la gestion d’état
- **Vue Router** pour la navigation
- **LocalStorage** pour la persistance des données
- **Librairies externes** :
  - `papaparse` et `file-saver` (exports CSV/JSON)
  - `chart.js` et `vue-chartjs` (graphiques)
  - `uuid` (génération d'identifiants uniques)

## 🌿 Versionnement Git

- Dépôt GitHub : [YALNEZAMI/Searchive](https://github.com/YALNEZAMI/Searchive)
- Branche principale : `main`
- Stratégie de branches : chaque fonctionnalité fait l’objet d’une branche dédiée (`feature/xxx`), puis est intégrée via une Pull Request.
- Pour limiter les conflits, les tâches sont réparties par fichiers distincts entre les membres du binôme.

## 🚀 Lancer le projet

```bash
# 1. Cloner le dépôt
git clone https://github.com/YALNEZAMI/Searchive.git
cd Searchive

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev



