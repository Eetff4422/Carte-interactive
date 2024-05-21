# Étape 1: Utiliser une image Maven pour construire le projet Java
FROM maven:3.8.1-openjdk-17 as builder

# Copier les fichiers du projet dans le conteneur
COPY src /home/app/src
COPY pom.xml /home/app

# Construire l'application et créer un fichier JAR
RUN mvn -f /home/app/pom.xml clean package -DskipTests

# Étape 2: Utiliser une image Java pour exécuter l'application
FROM openjdk:17-oracle

# Copier le fichier JAR depuis l'étape de construction
COPY --from=builder /home/app/target/fullstack-0.0.1-SNAPSHOT.jar /usr/local/lib/ville-service.jar

COPY --from=builder /usr/share/maven /usr/share/maven

ENV PATH="/usr/share/maven/bin:${PATH}"
# Exposer le port sur lequel votre application écoute
EXPOSE 8081

# Commande pour démarrer l'application
CMD ["java", "-jar", "/usr/local/lib/ville-service.jar"]
