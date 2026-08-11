# Rapport Technique — Sprint 0 & Sprint 1

**Projet Searchive — Application de suivi et d'analyse de recherche de stage**
**Auteurs :** Yuwen LIU & Yaser ALNEZAMI
**Encadrant :** Aymeric Blot
**Période couverte :** phase de cadrage (semaine du 19 juillet) + Sprint 0 & Sprint 1 (26 – 31 juillet 2026)
**Dépôt :** github.com/YALNEZAMI/Searchive

---

## 1. Introduction

Ce rapport couvre la phase de cadrage ainsi que les deux premiers sprints du projet Searchive, mené dans le cadre d'un stage de substitution de Master 1. On nous avait demandé de structurer ce rapport autour de quatre points : l'Agile, la répartition, la techno et les galères. C'est ce qu'on a essayé de faire, en s'appuyant sur deux sources concrètes : le document de cadrage rédigé à deux sur Google Docs avant qu'on touche au code, et l'historique des commits du dépôt Git, qui donne une trace datée de ce qui a réellement été fait.

---

## 2. Phase de cadrage préalable

Avant d'ouvrir le Sprint 0, on a passé une session de travail commune sur Google Docs pour poser le cadre du projet (le 20 juillet). Ce n'est pas du code, mais on considère que c'est un livrable à part entière — dans un Scrum plus formel, on parlerait presque d'un Sprint 0 de planification produit, à distinguer du Sprint 0 technique qui a suivi.

### 2.1 Contenu du document de cadrage

Le document couvrait plusieurs points :

- **Finalité du projet** : reformulation du besoin exprimé par le client (manque de données exploitables sur la recherche de stage des étudiants) et des objectifs visés.
- **Méthodologie** : on a choisi de fonctionner en sprints courts, chacun se terminant sur un livrable exécutable.
- **Gestion du temps** : découpage indicatif en quatre sprints (Sprint 0 à Sprint 3), chacun avec un périmètre fonctionnel défini au départ.
- **Stack technique** : premières pistes technologiques (Vite, Vue, Pinia, persistance locale), confirmées ensuite au Sprint 0.
- **Versionnement Git** : règles de collaboration sur le dépôt (droits d'écriture, stratégie de branche, répartition par fichiers pour limiter les conflits).

### 2.2 Backlog produit initial (user stories)

Un premier backlog, sous forme de user stories informelles, est sorti de cette session :

- Créer une candidature
- Chercher une candidature
- Supprimer une candidature
- Mettre à jour une candidature
- Visualiser un graphe
- Télécharger un export CSV
- Télécharger un export JSON

Ce backlog a été affiné puis réparti entre les quatre sprints (voir §2.4), selon un principe simple : créer/consulter d'abord (Sprint 1), modifier et visualiser ensuite (Sprint 2), finaliser et exporter en dernier (Sprint 3).

### 2.3 Décisions d'architecture actées en amont

Trois décisions ont été prises collectivement dès cette phase, avant la moindre ligne de code :

1. **Projet entièrement front-end**, sans backend ni serveur applicatif à maintenir.
2. **Persistance par LocalStorage**, jugée suffisante pour un usage mono-utilisateur.
3. **Bibliothèques externes pour les exports** (CSV / JSON) plutôt qu'une implémentation maison, pour fiabiliser cette fonctionnalité prévue au Sprint 3.

### 2.4 Backlog détaillé par sprint (état à l'issue du cadrage)

| Sprint       | Contenu prévu                                                                                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sprint 0** | Initialisation du projet (Vite), store Pinia, configuration du routage, partage des droits d'écriture GitHub, premiers commits/push, répartition par fichiers pour éviter les conflits             |
| **Sprint 1** | Interfaces `Company` et `Application`, formulaire + stockage des candidatures, formulaire + stockage des entreprises, liste des candidatures (composant + grille d'affichage), recherche et filtre |
| **Sprint 2** | Modification du statut d'une candidature (avec date), suppression avec popup de confirmation, graphiques Chart.js (Sankey, Gantt, évolution candidatures/temps, statistiques numériques)           |
| **Sprint 3** | Tableau de bord regroupant les graphiques du Sprint 2, export CSV, export JSON                                                                                                                     |

Cette planification a bougé en cours de route (voir §4 et §5), mais elle a servi de fil conducteur tout au long du projet et montre qu'il y a bien eu un cadrage explicite avant de coder — ce qu'on attend normalement d'une démarche Agile même allégée.

---

## 3. Démarche Agile appliquée (Sprint 0 & 1)

### 3.1 Organisation en sprints

Le projet a été découpé en sprints courts, de deux-trois jours à une semaine, chacun visant un objectif fonctionnel précis et se terminant sur un dépôt exécutable. Le **Sprint 0** (26–28 juillet) n'avait qu'un seul but : poser les fondations techniques, sans aucune fonctionnalité métier livrée. Le **Sprint 1** (29–31 juillet) devait livrer les premières fonctionnalités utilisateur : création d'entreprises et de candidatures, consultation de la liste des candidatures.

### 3.2 Fonctionnement itératif

On n'a pas figé les tâches à l'avance : on a plutôt avancé par itérations courtes, chaque fonctionnalité étant découpée en plusieurs commits successifs, corrigés au fil des tests manuels. L'historique du dépôt le montre bien : plusieurs commits correctifs (_« fix bugs of createCompany.vue »_, _« fix candidature saving »_, _« fix router pushing call »_, _« fix phone index binding »_) suivent de près les commits d'implémentation initiale — signe d'un cycle court développement → test manuel → correction, plutôt que d'une planification figée à l'avance.

### 3.3 Preuve d'avancement : chronologie des commits

Voici, reconstituée à partir de l'historique Git, la chronologie réelle des deux sprints.

| Date               | Sprint   | Nb. commits | Nature des travaux                                                                                                                      |
| ------------------ | -------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 26 juillet         | Sprint 0 | 7           | Initialisation du projet, configuration du store Pinia, mise en place du routage, premier store LocalStorage                            |
| 28 juillet         | Sprint 0 | 1           | Amélioration du store LocalStorage (sérialisation JSON automatique)                                                                     |
| 29 juillet (matin) | Sprint 1 | 6           | Définition et correction des interfaces `Company` / `Application`, ajout de Tailwind CDN, jeu de données de test                        |
| 29 juillet         | Sprint 1 | 28          | Formulaires de création (entreprise, candidature), stores CRUD, composant de notification, liste des candidatures, corrections diverses |
| 31 juillet         | Sprint 1 | 4           | Finalisation : README, user stories, méthode `resetForm()`, fusion de branches                                                          |

46 commits en six jours pour une équipe de deux, ça reflète des commits fréquents et ciblés, chacun correspondant à une unité de travail cohérente et testable — ce qui colle plutôt bien aux bonnes pratiques du développement itératif en contexte Agile.

### 3.4 Definition of Done

On a considéré une fonctionnalité comme terminée quand : (1) le code correspondant était implémenté et fusionné sur la branche principale, (2) il avait été testé à la main dans le navigateur par son auteur, et (3) il ne cassait pas les fonctionnalités déjà livrées. Cette définition, informelle, a été appliquée de façon constante sur les deux sprints.

---

## 4. Répartition des tâches

La répartition ci-dessous s'appuie sur l'historique des commits GitHub et reflète la contribution réelle de chaque membre.

### 4.1 Sprint 0 — Fondations techniques

Le Sprint 0 a été porté principalement par **Yaser Alnezami**, qui a initialisé le projet (Vite, Vue 3, TypeScript), configuré le store Pinia, mis en place Vue Router et écrit la première version du store LocalStorage (7 commits entre le 26 et le 27 juillet).

Cette asymétrie s'explique par une contrainte logistique : **Yuwen était en déplacement (vol de retour dans son pays d'origine) pendant les premiers jours du Sprint 0**, et n'a donc pas pu contribuer au code sur cette fenêtre. Yaser a couvert seul l'initialisation pour ne pas retarder le calendrier prévu en phase de cadrage (§2). Dès son retour, le 28 juillet, **Yuwen a rejoint activement le développement**, en commençant par fiabiliser le stockage (sérialisation/désérialisation JSON automatique du store LocalStorage) — une base qui a servi à tous les stores développés ensuite — puis en prenant en charge une bonne partie des tâches du Sprint 1 (cf. §4.2).

Concrètement, Yaser a dû porter le Sprint 0 tout seul pendant que Yuwen était dans l'avion. On a rattrapé le coup derrière, mais c'est un vrai point d'attention pour la suite.

### 4.2 Sprint 1 — Fonctionnalités de base

Le Sprint 1 a vu une répartition plus équilibrée, avec une spécialisation par domaine fonctionnel :

| Membre             | Contributions principales (Sprint 1)                                                                                                                                                                                                                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Yaser Alnezami** | Interfaces de données (`Company`, `Application`), stores `useApplicationStore` / `useCompanyStore`, formulaire de création de candidature, composant `Notification`, utilitaire `generateId()`, gestion des identifiants et de la validation, corrections de bugs (liaison téléphone, chemins de route, sérialisation) |
| **Yuwen Liu**      | Correction de la syntaxe des interfaces partagées, composant et formulaire de création d'entreprise (`CreateCompany.vue`), affichage de la liste des candidatures, rédaction des user stories, ajout de `resetForm()` dans le store applicatif                                                                         |

Cette répartition par fichiers et par domaine (plutôt qu'une alternance sur les mêmes fichiers) a été choisie dès le Sprint 1 pour limiter les conflits de fusion, les deux membres travaillant en parallèle sur des composants largement indépendants — un principe déjà posé lors du cadrage (§2.1).

---

## 5. Choix techniques

### 5.1 Sprint 0 — Choix structurants

- **Vue 3 (Composition API) + TypeScript + Vite** : pour le typage statique, qui limite les erreurs d'intégration entre composants, et pour un temps de build/rechargement rapide, adapté à un développement itératif à deux.
- **Pinia comme gestionnaire d'état** : intégration native avec la Composition API, plus simple que Vuex.
- **LocalStorage comme mécanisme de persistance** : décision majeure, actée dès le cadrage (§2.3), qui écarte d'emblée backend et base de données — cohérent avec la contrainte de déploiement simple exprimée par le client.

### 5.2 Sprint 1 — Choix complémentaires

- **Tailwind CSS via CDN** : intégré en fin de Sprint 0 / début de Sprint 1, pour aller vite sur le prototypage visuel sans monter de chaîne de build CSS.
- **uuid** : pour la génération d'identifiants uniques, factorisée dans un utilitaire `generateId()` partagé entre les deux stores.
- **Store LocalStorage générique** : plutôt que de dupliquer la logique d'accès au stockage dans chaque store métier, on a fait un store utilitaire dédié qui centralise la sérialisation JSON, l'accès aux clés et les valeurs par défaut — décision prise après le premier retour d'usage du store initial du Sprint 0.

On s'est rendu compte qu'on répétait la même logique de sérialisation partout, donc on l'a mutualisée. C'est du bon sens plus que de l'Agile, mais ça nous a fait gagner du temps.

---

## 6. Difficultés rencontrées et solutions apportées

### 6.1 Signature et robustesse du store LocalStorage

La première version du store, écrite au Sprint 0, ne gérait pas la sérialisation automatique des objets JavaScript en JSON : chaque store appelant devait faire cette conversion à la main. On a corrigé ça au Sprint 0 en ajoutant une sérialisation/désérialisation automatique, puis affiné au Sprint 1 (commit _« improve localstorage key abscences case handling »_) pour gérer proprement le cas où une clé n'existe pas encore dans le stockage du navigateur, et éviter des erreurs au premier lancement.

### 6.2 Accès réseau lors de l'installation des dépendances

On a eu des erreurs `ETIMEDOUT` en installant les paquets npm, sans doute liées à des restrictions réseau locales. On a contourné le problème en configurant temporairement un miroir npm alternatif (npmmirror.com), ce qui a rétabli une installation fiable.

### 6.3 Incohérences d'interface entre les deux développeurs

Un écart de nommage est apparu entre nous deux sur le champ « secteur » de l'entreprise (`sectore` au lieu de `sector`), repéré lors de l'intégration du formulaire de création d'entreprise avec le store correspondant. C'est typique d'un développement en parallèle sur des interfaces partagées sans revue croisée systématique. On l'a corrigé dès qu'on l'a vu, et on a convenu de se relire rapidement les interfaces avant de les utiliser dans un nouveau composant.

### 6.4 Absence de fonction de réinitialisation du formulaire

Le formulaire de création de candidature ne proposait au départ aucun moyen de vider ses champs après soumission — il fallait rafraîchir la page. Repéré lors des tests manuels de fin de Sprint 1, ce manque a été comblé par une méthode `resetForm()` dans le store applicatif, appelée automatiquement après une création réussie.

### 6.5 Affichage conditionnel défectueux

Sur la carte de candidature, une directive `v-if` mal positionnée sur le lien vers l'offre masquait toute la carte quand ce lien était absent, au lieu de masquer juste le lien. On a corrigé en déplaçant la condition directement sur l'élément concerné.

### 6.6 Coordination Git à deux

Les premiers conflits de fusion, apparus sur des modifications concurrentes de fichiers partagés (stores, interfaces), ont été réglés avec `git pull --no-rebase`, et on a adopté dès le Sprint 1 une répartition des tâches par fichier plutôt que par fonctionnalité transverse (cf. §4.2), ce qui a nettement réduit les conflits sur la suite du sprint.

---

## 7. Bilan des Sprints 0 & 1

Le Sprint 0 nous a posé la brique technique. Le Sprint 1 a livré les formulaires et la liste. On a 46 commits, soit une moyenne de 7-8 par jour — un rythme soutenu, mais tenable.
