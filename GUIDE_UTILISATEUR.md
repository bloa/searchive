# Guide d'utilisation – Searchive

## 1. Introduction

Searchive est une application web de suivi et d'analyse de recherche de stage. Elle permet aux étudiants d'enregistrer leurs candidatures, de suivre leur progression et de visualiser des statistiques personnelles. Les données sont stockées localement dans le navigateur (localStorage) et aucune connexion Internet n'est requise après le chargement initial.

## 2. Lancer l'application

### 2.1 Prérequis

- Node.js (version 20 ou supérieure recommandée)
- npm (généralement installé avec Node.js)

### 2.2 Installation

1. Téléchargez le code source depuis le dépôt Git (ou copiez le dossier du projet).
2. Ouvrez un terminal dans le dossier du projet.
3. Installez les dépendances :
   ```bash
   npm install
   ```
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
5. Ouvrez votre navigateur et accédez à l'adresse indiquée (par défaut : http://localhost:5173).

   Remarque : Pour une utilisation quotidienne, vous pouvez simplement ouvrir le fichier dist/index.html si une version compilée a été fournie. Sinon, utilisez npm run dev.

## 3. Premiers pas

Au premier lancement, l'application peut être vide ou contenir des données de démonstration (selon la configuration). Si des données de test sont présentes, vous pouvez les supprimer ou les conserver pour explorer l'interface.

## 4. Ajouter une entreprise

1. Depuis le tableau de bord ou la page « Candidatures », cliquez sur « Nouvelle candidature ».

2. Dans le formulaire de candidature, le champ Entreprise comporte un bouton « + ».

3. Cliquez sur ce bouton pour ouvrir le formulaire d'ajout d'entreprise.

4. Renseignez le nom, le site web (optionnel), le secteur et la taille.

5. Cliquez sur « Ajouter l'entreprise ». Celle-ci apparaît alors dans la liste déroulante.
