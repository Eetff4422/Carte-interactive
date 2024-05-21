package com.application.fullstack;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VilleService {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public VilleService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Ville> findVillesNear(double lat, double lon, Integer maxVilles, Double maxDistance, Integer minPopulation, Integer limit, Integer minPopulationFilter, List<String> excludedRegions) {
        final double R = 6371; // Rayon de la Terre en km
        double radiusInRadians = (maxDistance != null ? maxDistance : 50) / R;

        StringBuilder sqlBuilder = new StringBuilder("SELECT * FROM ville WHERE " +
                "acos(sin(?)*sin(radians(latitude)) + cos(?)*cos(radians(latitude))*cos(radians(longitude)-?)) <= ?");

        if (minPopulation != null) {
            sqlBuilder.append(" AND population >= ").append(minPopulation);
        }

        if (minPopulationFilter != null) {
            sqlBuilder.append(" AND population >= ").append(minPopulationFilter);
        }

        if (excludedRegions != null && !excludedRegions.isEmpty()) {
            sqlBuilder.append(" AND region NOT IN (");
            for (int i = 0; i < excludedRegions.size(); i++) {
                sqlBuilder.append("'").append(excludedRegions.get(i)).append("'");
                if (i < excludedRegions.size() - 1) {
                    sqlBuilder.append(", ");
                }
            }
            sqlBuilder.append(")");
        }

        if (limit != null) {
            sqlBuilder.append(" LIMIT ").append(limit);
        }

        String sql = sqlBuilder.toString();

        List<Ville> villes = jdbcTemplate.query(sql, new Object[]{
                Math.toRadians(lat),
                Math.toRadians(lat),
                Math.toRadians(lon),
                radiusInRadians
        }, rowMapper);

        return maxVilles != null && villes.size() > maxVilles ? villes.subList(0, maxVilles) : villes;
    }


    private final RowMapper<Ville> rowMapper = (rs, rowNum) -> new Ville(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getDouble("latitude"),
            rs.getDouble("longitude"),
            rs.getString("region"),
            rs.getInt("population")
    );
}
