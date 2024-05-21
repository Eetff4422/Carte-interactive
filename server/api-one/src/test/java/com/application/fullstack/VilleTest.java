package com.application.fullstack;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class VilleTest {

    @Test
    public void testConstructeurEtGetters() {
        Long id = 1L;
        String name = "Paris";
        double latitude = 48.8566;
        double longitude = 2.3522;
        String region = "Ile-de-France";
        int population = 2148000;

        Ville ville = new Ville(id, name, latitude, longitude, region, population);

        assertEquals(id, ville.getId());
        assertEquals(name, ville.getName());
        assertEquals(latitude, ville.getLatitude());
        assertEquals(longitude, ville.getLongitude());
        assertEquals(region, ville.getRegion());
        assertEquals(population, ville.getPopulation());
    }

    @Test
    public void testSetters() {
        Ville ville = new Ville();

        Long id = 1L;
        String name = "Marseille";
        double latitude = 43.2964;
        double longitude = 5.37;
        String region = "Provence-Alpes-Côte d'Azur";
        int population = 855393;

        ville.setId(id);
        ville.setName(name);
        ville.setLatitude(latitude);
        ville.setLongitude(longitude);
        ville.setRegion(region);
        ville.setPopulation(population);

        assertEquals(id, ville.getId());
        assertEquals(name, ville.getName());
        assertEquals(latitude, ville.getLatitude());
        assertEquals(longitude, ville.getLongitude());
        assertEquals(region, ville.getRegion());
        assertEquals(population, ville.getPopulation());
    }
}
