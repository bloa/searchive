# Rapport Technique — Sprint 2

**Projet Searchive — Application de suivi et d'analyse de recherche de stage**
**Auteurs :** Yuwen LIU & Yaser ALNEZAMI
**Encadrant :** Aymeric Blot
**Période couverte :** 4 – 7 août 2026
**Branche :** `Sprint-2`
**Dépôt :** github.com/YALNEZAMI/Searchive

> **Note de traçabilité** : le commit du 5 août intitulé _« init technic report for Sprint 0 and 1 »_ correspond en réalité à un fichier vide, déposé comme place-holder sur le dépôt. Le contenu du rapport Sprint 0 & 1 a été rédigé en parallèle et livré séparément. On le précise ici pour que l'historique Git et les livrables réels restent cohérents.

---

## 1. Objectifs du Sprint

- Permettre la modification du statut d'une candidature avec suivi temporel (historique).
- Implémenter la suppression d'une candidature avec confirmation.
- Développer des cartes statistiques synthétiques (total, en attente, acceptées…).
- Créer les visualisations graphiques : diagramme de distribution (barres), courbe d'évolution, diagramme de Gantt.
- Enrichir les données de test pour les démonstrations.

Ce périmètre reprend directement ce qui avait été défini pour le Sprint 2 dès la phase de cadrage (cf. Rapport Technique Sprint 0 & 1, §2.4).

---

## 2. Démarche Agile appliquée

### 2.1 Cadre temporel du sprint

Le Sprint 2 s'est étalé du 4 au 7 août 2026, soit quatre jours de travail, sur une branche dédiée `Sprint-2`. L'idée de créer cette branche était d'isoler le développement des fonctionnalités avancées (modification de statut, suppression, visualisations) sans toucher à l'état stable de la branche principale.

### 2.2 Fonctionnement itératif

Comme sur les sprints précédents, on a fonctionné par implémentation puis correction rapide, ce qui se voit directement dans l'historique des commits : les correctifs (_« fix status color coherence with other charts »_, _« fix test logic »_, _« fix the bug of the graph height »_) arrivent juste après les commits d'implémentation des composants graphiques concernés — signe qu'on teste manuellement chaque fonctionnalité dès qu'elle est posée, plutôt que d'attendre la fin du sprint.

### 2.3 Preuve d'avancement : chronologie des commits

| Date    | Nb. commits            | Nature des travaux                                                                                                                                                                                                                                                                                                   |
| ------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4 août  | 7 (3 Yaser + 4 Yuwen)  | Ouverture de la branche `Sprint-2`, installation de Chart.js, initialisation du `SankeyDiagram`, page de visualisation des statistiques, correction du bug de hauteur du graphique, amélioration de la réactivité du bouton d'annulation, fusion de branche                                                          |
| 5 août  | 1 (Yuwen)              | Dépôt du fichier place-holder pour le rapport technique Sprint 0 & 1 (contenu réel livré séparément, cf. note en tête de document)                                                                                                                                                                                   |
| 6 août  | 2 (Yaser)              | Initialisation et intégration du composant `StatCard`                                                                                                                                                                                                                                                                |
| 7 août  | 10 (6 Yaser + 4 Yuwen) | Cohérence des couleurs de statut entre graphiques, masquage du bouton de modification sur les statuts finaux, ajout du statut `abandoned`, correction de la logique de test, données de test, suppression d'une candidature, ajustement dynamique de la frise temporelle, diagramme de Gantt, modification de statut |
| 15 août | 1 (Yuwen)              | Réalisation du diagramme de flux Sankey                                                                                                                                                                                                                                                                              |

Vingt commits en quatre jours, un rythme comparable à celui des sprints précédents — on reste sur le même mode de développement incrémental à cycle court.

### 2.4 Definition of Done

Une fonctionnalité du Sprint 2 était considérée comme terminée quand : (1) le composant ou la méthode de store correspondante était implémentée et fonctionnait sur la branche `Sprint-2`, (2) elle avait été testée à la main avec le jeu de données de démonstration enrichi (20 entreprises, 29 candidatures), et (3) elle ne cassait rien de ce qui avait déjà été livré (création, liste, filtrage).

---

## 3. Fonctionnalités réalisées

### 3.1 Modification de statut avec historique

- Composant `StatusUpdateModal.vue` : fenêtre modale pour choisir le nouveau statut et sa date.
- Nouvelle méthode `updateStatus(id, newStatus, date)` dans `useApplicationStore`, qui :
  - initialise le tableau `statusHistory` s'il n'existe pas encore, en y ajoutant l'état initial ;
  - ajoute le nouveau statut à l'historique ;
  - met à jour le statut courant et renseigne automatiquement les dates associées (`HRInterviewDate`, `technicalInterviewDate`, etc.).
- Intégration dans `Application.vue` : le bouton « crayon » émet un événement `edit` vers le composant parent.
- Règle métier : le bouton de modification est masqué sur les statuts finaux (`accepted`, `refused`, `abandoned`), qui n'ont plus de transition logique possible.

### 3.2 Suppression avec confirmation

- Confirmation directement intégrée dans `Application.vue` : une popup interne affiche le titre et l'entreprise de la candidature et demande validation avant suppression.
- L'événement `delete` est émis vers `ApplicationList.vue`, qui appelle `deleteApplication`.

### 3.3 Cartes statistiques

- Composant `StatCard.vue` : affiche un label, une valeur, une icône et une tendance.
- Les calculs (dans `Statistics.vue` / `Dashboard.vue`) agrègent, à partir du store, les totaux, la répartition par statut, le nombre d'entretiens et le nombre de sources distinctes.
- Résultat : six cartes en tête de la page Statistiques.

### 3.4 Diagrammes

- **Distribution sources/statuts** (`SankeyDiagram.vue`) : en pratique un diagramme à barres empilées, avec un code couleur par statut (le nom du fichier vient d'une intention initiale d'implémenter un vrai Sankey, non retenue faute de temps sur ce sprint).
- **Évolution temporelle** (`LineChart.vue`) : courbe cumulée ou mensuelle, avec bascule via boutons. Le défaut initial de hauteur infinie a été corrigé par un conteneur à hauteur fixe.
- **Diagramme de Gantt** (`GanttChart.vue`) :
  - exploite directement `statusHistory` pour afficher des segments colorés par statut ;
  - axe temporel dynamique, pas de sept jours et largeur minimale par graduation pour éviter les chevauchements d'étiquettes ;
  - largeur totale adaptée automatiquement au nombre de jours couverts (minimum 700px, 6px par jour).

### 3.5 Données de test

- `testData.ts` enrichi : vingt entreprises et vingt-neuf candidatures, chacune avec un `statusHistory` complet — nécessaire pour que le Gantt ait quelque chose à afficher.
- Fonction `fillTestData()` dans `localStorage.ts` : injecte ce jeu de données si le stockage local est vide.
- Appel automatique au démarrage (`App.vue`), pour ne pas avoir à ressaisir les données à chaque démo.

---

## 4. Répartition des tâches

| Tâche                                                                                         | Responsable principal                                           |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Modification de statut + `StatusUpdateModal` + méthode `updateStatus` du store                | Yuwen                                                           |
| Diagramme de Gantt (`GanttChart.vue`) + ajustement dynamique de la frise                      | Yuwen                                                           |
| SankeyFlow (diagramme de flux Sankey)                                                         | Yuwen                                                           |
| Cartes statistiques (`StatCard`, calculs d'agrégation)                                        | Yaser                                                           |
| `SankeyDiagram` (diagramme à barres empilées)                                                 | Yaser                                                           |
| Mise en place initiale de `LineChart` (courbe d'évolution)                                    | Yaser                                                           |
| Suppression avec popup de confirmation (`Application.vue`)                                    | Yaser                                                           |
| Données de test initiales (`testData.ts`, `fillTestData`)                                     | Yaser (complément de jeu de données ajouté par Yuwen le 7 août) |
| Corrections diverses (cohérence des couleurs, bug de hauteur du `LineChart`, logique de test) | Binôme                                                          |

L'historique des commits confirme le rééquilibrage amorcé au Sprint 1 : **11 commits pour Yaser, 9 pour Yuwen**, avec une spécialisation qui reste cohérente d'un sprint à l'autre — Yaser sur les composants graphiques statistiques et la robustesse de la logique métier (statuts finaux, jeu de données), Yuwen sur la dimension temporelle (Gantt, historique de statut, SankeyFlow) et les pages de visualisation. On a aussi eu quelques interventions croisées (le correctif de hauteur du `LineChart`, développé au départ par Yaser, a été corrigé par Yuwen), ce qui montre qu'on n'est pas cloisonnés chacun sur ses fichiers — les deux comprennent le code de l'autre.

---

## 5. Architecture et choix techniques

- **Stack inchangée** : Vue 3 (Composition API) + TypeScript, Pinia, Vite, Vue Router, LocalStorage — rien à remettre en cause par rapport aux choix actés en cadrage et au Sprint 0.
- **Gantt sans bibliothèque externe** : après évaluation, on a écarté une bibliothèque tierce dédiée (type `chartjs-chart-gantt`), trop compliquée à adapter à notre structure `statusHistory`. On est partis sur une implémentation CSS/JS maison, qui donne un contrôle total sur le rendu par statut.
- **Chart.js** gardé pour les composants sans besoin de représentation temporelle particulière (`LineChart`, diagramme à barres), où la bibliothèque standard suffisait.
- **Extension du modèle de données** : ajout du type `StatusHistoryEntry` à l'interface `Application`, consommé directement par les composants de visualisation (`GanttChart` notamment), sans structure de données parallèle à maintenir.

---

## 6. Difficultés rencontrées et solutions apportées

### 6.1 Chevauchement des étiquettes sur le diagramme de Gantt

Avec peu de candidatures ou des dates rapprochées, les étiquettes de l'axe temporel se chevauchaient et rendaient le graphique illisible. Réglé en ajoutant une largeur minimale par graduation et un filtrage des étiquettes affichées (on n'en garde une que si elle est à plus de 40 pixels de la précédente).

### 6.2 Hauteur infinie du graphique d'évolution

`LineChart.vue` avait un problème de dimensionnement — hauteur non bornée, donc affichage incohérent selon le contenu de la page. Corrigé en fixant explicitement la hauteur du conteneur (classe `h-80`).

### 6.3 Données de test incomplètes pour le Gantt

Le jeu de données de test initial n'avait pas de champ `statusHistory`, donc rien à afficher côté Gantt. On a enrichi `testData.ts` à la main, en donnant à chaque candidature de test un historique de statuts cohérent et daté.

### 6.4 Affichage du bouton de modification sur les statuts finaux

Au départ, on pouvait déclencher une modification de statut même sur une candidature déjà à un état final (acceptée, refusée, abandonnée) — ce qui n'a aucun sens côté métier. On a masqué le bouton pour les statuts `accepted`, `refused` et `abandoned`. Cette règle, encore assez ad hoc à ce stade, préfigure la machine à états qu'on a formalisée plus tard dans le projet.

### 6.5 Rigueur du typage TypeScript sur les transitions de statut

Le typage strict des statuts (type union) a provoqué des erreurs de compilation sur certaines transitions programmatiques. On a utilisé des assertions de type ciblées (`as Application['status']`) là où c'était nécessaire, sans affaiblir le typage du reste du code.

---

## 7. Livrables du Sprint 2

- Code fonctionnel sur la branche `Sprint-2`.
- Store applicatif enrichi de `updateStatus` et de la gestion de l'historique de statuts.
- Quatre nouveaux composants de visualisation : `StatCard`, `SankeyDiagram`, `LineChart`, `GanttChart`.
- Jeu de données de test complet (20 entreprises, 29 candidatures avec historique).
- Documentation intégrée au code (commentaires en français).

---

## 8. Bilan du Sprint 2

Le Sprint 2 fait passer l'application d'un simple outil de saisie (Sprint 1) à un vrai outil de suivi et d'analyse — c'était l'objectif initial du projet. La décision structurante du sprint, c'est l'ajout de l'historique de statuts : c'est ce qui rend possibles toutes les visualisations développées (Gantt, courbe d'évolution), et plus largement toute exploitation statistique future des données de recherche de stage.

Côté organisation, le Sprint 2 confirme ce qu'on observait déjà au Sprint 1 : une répartition des tâches à peu près équilibrée entre les deux (11 contre 9 commits), une spécialisation qui tient d'un sprint à l'autre, et quelques interventions croisées ponctuelles sur les composants de l'autre — signe qu'on comprend correctement le code produit par l'autre, pas juste le sien.
