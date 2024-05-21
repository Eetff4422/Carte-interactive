# API REST de recherche de villes à proximité

Cette API REST permet de rechercher les villes situées à proximité d'un point géographique donné, spécifié par sa latitude et sa longitude.

## Technologies utilisées

- Spring Boot : Framework Java pour le développement rapide d'applications web.
- JdbcTemplate : Composant Spring pour simplifier l'accès aux bases de données relationnelles via JDBC.

## Points d'accès (Endpoints)

### Rechercher les villes à proximité

- URL : `/cities/{latitude}/{longitude}`
- Méthode HTTP : GET
- Paramètres URL : - {latitude} : Latitude du point de recherche (type : double). - {longitude} : Longitude du point de recherche (type : double).
- Paramètres facultatifs : - maxVilles : Nombre maximum de villes à retourner (type : int). - maxDistance : Distance maximale (en kilomètres) pour la recherche (type : double). - minPopulation : Population minimale des villes à retourner (type : int). - limit : Limite du nombre de résultats (type : int). - minPopulationFilter : Population minimale des villes à filtrer (type : int).- excludedRegions: filtre des villes a afficher selon les régions (type : string)


  - Exemple de requête :
    `GET /cities/48.8566/2.3522?maxDistance=50&minPopulation=100000&excludedRegions=Bretagne,Occitanie`

  - Réponse : Liste des villes à proximité du point spécifié, au format JSON.

## Exécution et déploiement

1. Assurez-vous d'avoir Java JDK et Maven installés sur votre système.
2. Clonez ce dépôt sur votre machine.
3. Configurez les paramètres de connexion à votre base de données dans le fichier "application.properties".
4. Lancez l'application en exécutant la classe " FullstackApplication.java".
5. L'API sera disponible à l'URL ``http://localhost:8081`.

## Exemple d'utilisation

Vous pouvez utiliser cette API pour construire des applications qui nécessitent la récupération de villes à proximité d'un point géographique spécifique, comme des applications de voyage, de cartographie, ou de recommandation basées sur la localisation.
