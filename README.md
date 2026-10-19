# Searchive

## Suivi et analyse de recherche de stage

Searchive est une application web destinée aux étudiants qui souhaitent centraliser et suivre leurs recherches de stage.
Elle permet d'enregistrer leurs démarches, de suivre l'évolution de leurs candidatures et de visualiser des statistiques sur leur recherche.
L'objectif est aussi de faciliter l'accompagnement des étudiants en permettant de faire remonter des données agrégées permettant de mieux comprendre les dynamiques de recherche de stage au sein des promotions.

## Fonctionnalités

- **Suivi des candidatures :** centralisation des entreprises contactées, des candidatures et de leur statut.
- **Gestion des démarches :** enregistrement des dates et des informations relatives aux différentes prises de contact.
- **Visualisation :** représentation graphique de l'évolution et des résultats de la recherche.
- **Export des données :** extraction des données au format CSV ou JSON pour permettre leur exploitation ultérieure.

## Stack technique

Searchive est une application entièrement front-end, sans serveur applicatif ni base de données distante.
Les données sont stockées localement dans le navigateur via localStorage ; aucun backend n'est nécessaire au fonctionnement de l'application.

- **Vue 3** avec **TypeScript**
- **Vite** comme outil de build
- **Pinia** pour la gestion d’état
- **Vue Router** pour la navigation
- **LocalStorage** pour la persistance des données
- **Librairies externes** :
  - `papaparse` et `file-saver` (exports CSV/JSON)
  - `chart.js` et `vue-chartjs` (graphiques)
  - `uuid` (génération d'identifiants uniques)

## Utilisation locale

```bash
# 1. Cloner le dépôt
git clone https://github.com/bloa/searchive.git
cd searchive

# 2. Installer les dépendances
npm install

# 3. Lancer le frontend
npm run dev
```
