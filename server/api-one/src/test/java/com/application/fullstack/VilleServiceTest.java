package com.application.fullstack;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import java.util.ArrayList;
import java.util.List;

import com.application.fullstack.Ville;
import com.application.fullstack.VilleService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class VilleServiceTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    private VilleService villeService;

    @BeforeEach
    public void setUp() {
        villeService = new VilleService(jdbcTemplate);
    }

    @Test
    public void testFindVillesNear() {
        double lat = 48.8566;
        double lon = 2.3522;
        Integer maxVilles = 10;
        Double maxDistance = 50.0;
        Integer minPopulation = 100000;
        Integer limit = 20;
        Integer minPopulationFilter = 50000;
        List<String> excludedRegions = new ArrayList<>();
        excludedRegions.add("Bretagne");

        List<Ville> mockVilles = new ArrayList<>();
        // Ajoutez des villes simulées à la liste mockVilles

        when(jdbcTemplate.query(anyString(), any(Object[].class), any(RowMapper.class))).thenReturn(mockVilles);

        List<Ville> result = villeService.findVillesNear(lat, lon, maxVilles, maxDistance, minPopulation, limit, minPopulationFilter, excludedRegions);

        // Vérifiez que la méthode a été appelée avec les bons paramètres
        // Vous pouvez également ajouter d'autres assertions en fonction de votre logique métier

        assertThat(result).isNotNull();
        // Ajoutez d'autres assertions selon votre logique métier
    }
}
