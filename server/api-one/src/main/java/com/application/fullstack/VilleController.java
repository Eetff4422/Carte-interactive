package com.application.fullstack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/cities")
public class VilleController {
    private final VilleService villeService;

    @Autowired
    public VilleController(VilleService villeService) {
        this.villeService = villeService;
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{latitude}/{longitude}")
    public ResponseEntity<List<Ville>> getVillesNear(
            @PathVariable double latitude,
            @PathVariable double longitude,
            @RequestParam(required = false) Integer maxVilles,
            @RequestParam(required = false) Double maxDistance,
            @RequestParam(required = false) Integer minPopulation,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Integer minPopulationFilter,
            @RequestParam(required = false) List<String> excludedRegions) {
        List<Ville> villes = villeService.findVillesNear(latitude, longitude, maxVilles, maxDistance, minPopulation, limit, minPopulationFilter, excludedRegions);
        return ResponseEntity.ok(villes);
    }


}
