package com.application.fullstack;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class VilleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetVillesNear() throws Exception {
        double latitude = 48.8566;
        double longitude = 2.3522;
        int maxVilles = 10;
        double maxDistance = 50.0;
        int minPopulation = 100000;
        int limit = 20;
        int minPopulationFilter = 50000;
        String excludedRegions = "Bretagne";

        mockMvc.perform(get("/cities/{latitude}/{longitude}", latitude, longitude)
                        .param("maxVilles", String.valueOf(maxVilles))
                        .param("maxDistance", String.valueOf(maxDistance))
                        .param("minPopulation", String.valueOf(minPopulation))
                        .param("limit", String.valueOf(limit))
                        .param("minPopulationFilter", String.valueOf(minPopulationFilter))
                        .param("excludedRegions", excludedRegions)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                // Add more assertions as needed
                .andExpect(jsonPath("$").isArray()); // Example assertion for response body as array
    }
}
