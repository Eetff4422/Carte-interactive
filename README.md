**Carte de France Interactive**

**Introduction**
Cette application web interactive permet aux utilisateurs d'explorer les villes françaises en cliquant sur une carte de France métropolitaine. En fonction du point cliqué, une requête est envoyée à une API personnalisée qui interroge une base de données pour récupérer les villes à proximité, en fonction de différents paramètres configurables.

**Notice d'Utilisation**
**Installation**
1. Faites un git clone de ce projet dans le répertoire de votre choix en local.

2. Prérequis :
- Docker installé sur votre machine.
- Navigateur web moderne pour l'interface utilisateur.
- Vérifier que les ports suivants ne sont pas utilisés:
    - 8080 (Backend)
    - 3000 (Frontend)
    - 3306 (Base de données)

3. Lancement de l'application :
- Ouvrez un terminal dans le répertoire du projet.

- Exécutez *docker-compose up --build* pour construire et démarrer les conteneurs de l'application, y compris la base de données, l'API, et le client.

**Utilisation**
- Navigation : Ouvrez votre navigateur et accédez à http://localhost:3000 pour voir la carte de France.

- Interaction : Cliquez n'importe où sur la carte pour voir les villes à proximité s'afficher sur la carte et dans une liste latérale.

- Paramétrage : Après avoir cliqué sur la carte un tableau contenant des villes ainsi que leurs informations s'affichera. Vous pourrez alors utiliser le filtre du tableau pour entrer des paramètres.

**Tests**
**Frontend**
- Après avoir lancer le conteneur vous devez vous positionnez dans le dossier client/cypress et faire la commande suivante:
    - npm run cypress:open

**Backend**
- Après avoir lancer le conteneur vous devez vous positionnez dans le dossier server/api-one et faire la commande suivante:
    - mvn test


**Choix Architecturaux**
**Architecture de l'Application**

L'application est divisée en trois composants principaux : un client web, une API REST, et une base de données. Cette architecture microservices permet une évolutivité et une maintenance facilitées.

- Client Web : Développé en React pour une expérience utilisateur dynamique et interactive.

- API REST : Implémentée en Spring Boot (Java), elle gère les requêtes côté serveur et communique avec la base de données.

- Base de Données : Utilise MySQL pour stocker les données des villes françaises.

**Technologies Utilisées**

- Frontend : React.
- Backend : Java avec Spring Boot.
- Base de Données : MySQL.
- Tests : JUnit et Mockito pour le backend, Cypress pour les tests d'acceptation.

**Expérience et Réflexions**
**Architecture Initiale**
Nous avons opté pour une architecture client serveur. Cela nous a permis de mieux centraliser nos données et de faire des mises à jour ciblées sans pour autant modifier toute notre application.

L'architecture initiale a été globalement respectée, mais quelques ajustements ont été nécessaires pour optimiser les performances et la facilité de déploiement, notamment l'utilisation de Docker.

**Solutions Alternatives**
Des solutions alternatives comme l'utilisation de ASP.NET Core pour l'API ou MongoDB comme base de données ont été explorées, mais la combinaison Java/Spring Boot/MySQL a été choisie pour sa robustesse et sa communauté active.

**Améliorations Envisagées**
- Architecturales : Intégration d'un service de cache pour améliorer les performances.

- Technologiques : Exploration de frameworks frontend plus récents comme Svelte.

**Architecture (C4 Model)**
Voir le répertoire /docs pour les diagrammes d'architecture utilisant PlantUML/C4.

**Documentation API**
Voir le README de la branche backend.
