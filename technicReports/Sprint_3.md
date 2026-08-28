## **Rapport Technique – Sprint 3**

### **1\. Objectifs du Sprint**

Le Sprint 3 avait pour objectifs de :

- Créer un tableau de bord unifié (`Dashboard`) offrant une vue d’ensemble de la recherche de stage.
- Implémenter l’export des candidatures aux formats CSV et JSON.
- Finaliser l’interface et préparer le livrable pour les futurs utilisateurs.
- Rédiger le guide d’utilisation et nettoyer le code.

### **2\. Fonctionnalités réalisées**

#### **2.1 Tableau de bord (`Dashboard.vue`)**

- **Page d’accueil** : remplace la liste des candidatures comme page principale (`/`).
- **Contenu** :
  - 6 cartes statistiques identiques à celles de la page `Statistics` (total, en attente, entretiens, acceptées, refusées, sources).
  - Section « Dernières candidatures » affichant les 3 candidatures les plus récentes (triées par date).
  - Boutons d’action : « Nouvelle candidature », « Statistiques », « Exporter ».
- **Responsive** : la disposition des boutons s’adapte aux écrans mobiles (`flex-col` → `sm:flex-row`).

#### **2.2 Export CSV / JSON (`ExportModal.vue`)**

- **Modal dédiée** : ouverte depuis le Dashboard, propose deux formats d’export.
- **Export JSON** :
  - Génère un fichier `candidatures.json` contenant toutes les applications, avec l’objet `company` complet (résolu via le `companyStore`) et l’historique `statusHistory`.
  - Ajout d’un BOM UTF-8 pour une meilleure compatibilité.
- **Export CSV** :
  - Colonnes définies : ID, titre, entreprise, statut, source, URL, dates, ville, code postal, téléphone, email, historique.
  - Échappement des caractères spéciaux (`"` doublés) et formatage des dates en français.
  - Ajout d’un BOM pour Excel.
- **Téléchargement** : création d’un blob, lien temporaire, clic programmatique, révocation de l’URL.

#### **2.3 Corrections et améliorations**

- **Responsive du Dashboard** : ajustements des classes Tailwind pour un affichage correct sur mobile.
- **Nettoyage** : suppression de logs inutiles, harmonisation des imports.
- **Compatibilité TypeScript** : assouplissement local du typage pour le plugin Sankey.

### **3\. Choix techniques**

- **Tableau de bord** : réutilisation des composants existants (`StatCard`, `ApplicationCard`).
- **Export** : pas de librairie externe supplémentaire ; utilisation de `Blob` et `URL.createObjectURL` pour le téléchargement. Le format CSV est généré manuellement pour un contrôle total des colonnes.

### **4\. Répartition des tâches**

| Tâche                                                     | Responsable | Période        |
| --------------------------------------------------------- | ----------- | -------------- |
| **Dashboard (`dashboard.vue`) et intégration des cartes** | **Yaser**   | **11 août**    |
| **ExportModal (`ExportModal.vue`) – logique JSON/CSV**    | **Binôme**  | **11 août**    |
| **Correction responsive et tests**                        | **Binôme**  | **11–13 août** |
| **Guide d’utilisation (`GUIDE_UTILISATEUR.md`)**          | **Yuwen**   | **13 août -**  |
| **Rapport technique final**                               | **Binôme**  | **13 août -**  |

### **5\. Problèmes rencontrés et solutions**

#### **5.1 Responsive du Dashboard**

- **Problème** : sur petits écrans, les boutons étaient trop larges ou mal alignés.
- **Solution** : utilisation de classes conditionnelles (`flex-col` par défaut, `sm:flex-row` au-delà du point de rupture), et ajustement de la hauteur du bouton d’export.

#### **5.2 Cohérence des données de test**

- **Problème** : les données générées par `fillTestData()` ne contenaient pas toujours `statusHistory`, ce qui rendait le Sankey et le Gantt vides.
- **Solution** : ajout manuel de `statusHistory` dans `testData.ts` pour chaque candidature (29 entrées), et maintien de `fillTestData()` qui ne remplit que si `localStorage` est vide.

### **6\. Livrables du Sprint 3**

- Code source mis à jour sur la branche `sprint-3`.
- Nouveaux composants : `Dashboard.vue`, `ExportModal.vue`
- Guide utilisateur (`GUIDE_UTILISATEUR.md`).
- Rapport technique.

### **7\. Conclusion**

Le Sprint 3 a permis de transformer l’application en un outil complet et prêt à être utilisé : un tableau de bord synthétique, des exports standards pour l’analyse externe.
