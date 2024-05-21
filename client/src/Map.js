import React, { useState } from 'react';
import './Map.css';

function haversineDistance(lat1, lon1, lat2, lon2) {

  const R = 6371; // Rayon de la Terre en kilomètres
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance en kilomètres
}

function Map(props) {
  const { image, convertToLat, convertToLon, convertCoordsToPosition} = props;
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lon: null, x: null, y: null });
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [cities, setCities] = useState([]);

  const [showInfo, setShowInfo] = useState(false);
  const [closestCity, setClosestCity] = useState(null);


  async function handleMouseMove(city) {
    setClosestCity(city);
    setShowInfo(true);
  }

  const handleMouseLeave = () => {
    setShowInfo(false);
  };

  // Extraction des régions uniques
  const uniqueRegions = Array.from(new Set(cities.map(city => city.region)));

  const [filterSettings, setFilterSettings] = useState({
    minVille: '',
    minPopulation: '',
  });

  async function handleClick(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const infoLat = convertToLat(x, y);
    const lon = convertToLon(x, y);

    // Réinitialiser les régions sélectionnées à chaque clic
    setSelectedRegions([])
    const lat = infoLat.lat
    // Stocker les nouvelles coordonnées dans l'état
    setCoords({ lat, lon, x, y });

    const cit = await fetchCities(infoLat.lat, lon);

    // Appel à la fonction pour créer et afficher les marqueurs
    createAndDisplayMarkers(cit, infoLat.lat, lon, infoLat.quadrant)

    setCities(cit);
    
    updateCityTable(cit, infoLat.lat, lon);
  }

  function resetFilters() {
    // Réinitialiser les états liés aux filtres à leurs valeurs par défaut
    setFilterSettings({
      minVille: '',
      minPopulation: '',
    });
    setSelectedRegions([]);
  }
  
  
  function handleMouseOver(city, userLat, userLon) {
    const distance = haversineDistance(userLat, userLon, city.latitude, city.longitude);
    const detailsDiv = document.getElementById('city-details');
    detailsDiv.innerHTML = `
      <h3>${city.name}</h3>
      <p>Distance Haversine: ${Math.round(distance)} km</p>
      <p>Latitude: ${city.latitude}</p>
      <p>Longitude: ${city.longitude}</p>
      <p>Region: ${city.region}</p>
      <p>Population: ${city.population}</p>
    `;
    detailsDiv.style.display = 'block';
  }

  
  function updateCityTable(cities, latPoint, lonPoint) {

    let filteredCities = cities.filter(city => selectedRegions.length === 0 || selectedRegions.includes(city.region));
    const listDiv = document.getElementById('city-table');
    listDiv.innerHTML = ''; // Effacer le contenu précédent
  
    // Créer le tableau s'il n'existe pas déjà
    let table = document.createElement('table');
    table.setAttribute('class', 'city-table'); // Pour le style CSS
  
    // Ajouter l'en-tête du tableau
    let thead = table.createTHead();
    let row = thead.insertRow();
    let headers = ['Nom', 'Latitude', 'Longitude', 'Région', 'Population'];
    
    headers.forEach(headerText => {
      let header = document.createElement('th');
      header.textContent = headerText;
      header.classList.add('table-header');
      row.appendChild(header);
    });
  
    let filterHeader = document.createElement('th');
    let filterButton = document.createElement('button');
    filterButton.textContent = 'Filtre';
    filterButton.onclick = () => setShowFilterModal(true);
    filterHeader.appendChild(filterButton);
    row.appendChild(filterHeader);

    // Ajouter les lignes de données du tableau
    let tbody = table.createTBody();
    filteredCities.forEach(city => {

      let row = tbody.insertRow();
      row.dataset.name = city.name;
      
      row.insertCell().textContent = city.name;
      row.insertCell().textContent = city.latitude;
      row.insertCell().textContent = city.longitude;
      row.insertCell().textContent = city.region;
      row.insertCell().textContent = city.population;
      row.setAttribute('data-name', city.name);
      console.log(city);
      row.addEventListener('mouseover', () => {
        handleMouseOver(city, latPoint, lonPoint);
        highlightMarker(city.name);
        highlightRow(city.name);
      });
    });
  
    listDiv.appendChild(table); // Ajouter le tableau à la div
  }
  
  async function fetchCities(lat, lon) {
    try {
      const response = await fetch(`/api/cities/${lat}/${lon}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCities(data);
      return data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }

  async function fetchFilteredCities(lat, lon, settings) {
    // Destructurer les paramètres depuis les settings
    const { minVille, minPopulation } = settings;
    
    // Initialiser les parties de la chaîne de requête en fonction des paramètres fournis
    let queryParams = [];
    
    // Ajouter conditionnellement le paramètre 'limit' seulement s'il est valide
    if (minVille > 0) {
        queryParams.push(`limit=${minVille}`);
    }
    
    // Ajouter conditionnellement le paramètre 'minPopulation' seulement s'il est valide
    if (minPopulation > 0) {
        queryParams.push(`minPopulation=${minPopulation}`);
    }

    // Construire la chaîne de requête finale à partir des parties valides
    const queryString = queryParams.join('&');
    
    try {
        const response = await fetch(`/api/cities/${lat}/${lon}?${queryString}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching filtered cities:', error);
        return [];
    }
}

  const applyFilters = async () => {
    if (coords.lat !== null && coords.lon !== null) {
        const filteredCities = await fetchFilteredCities(coords.lat, coords.lon, filterSettings);
        updateCityTable(filteredCities, coords.lat, coords.lon);
        setShowFilterModal(false);
    } else {
        console.error("Les coordonnées ne sont pas définies.");
    }
  };

  
  const mapStyle = {
    flex: '0 0 50%',
    height: '100vh',
    background: 'lightblue',
  };

  const mapContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
  };


  const detailsStyle = {
    flex: 1,
  };

  function handleRegionChange(e) {
    const { options } = e.target;
    const value = [];
    let allRegionsSelected = false;
  
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].value === "" && options[i].selected) {
        allRegionsSelected = true;
        break;
      } else if (options[i].selected) {
        value.push(options[i].value);
      }
    }
  
    if (allRegionsSelected) {
      setSelectedRegions([]); // Réinitialise les régions sélectionnées pour afficher toutes les villes
    } else {
      setSelectedRegions(value); // Met à jour avec les régions sélectionnées
    }
  }
  
  function createAndDisplayMarkers(cities, latPoint, lonPoint, quadrant) {
    // Supprimer les marqueurs existants si nécessaire
    document.querySelectorAll('.city-marker').forEach(marker => marker.remove());
  
    // Créer et afficher un marqueur pour chaque ville
    cities.forEach(city => {
      const position = convertCoordsToPosition(city.latitude, city.longitude, quadrant);
      console.log(position);
      const marker = document.createElement('div');
      marker.className = 'city-marker';
      
      marker.style.left = `${Math.abs(position.x) }px`;
      marker.style.top = `${Math.abs(position.y) }px`;
      marker.style.backgroundColor = 'yellow'; // Style du marqueur
      marker.dataset.name = city.name;

       // Style de base pour les marqueurs
      Object.assign(marker.style, {
        position: 'absolute',
        height: '10px',
        width: '10px',
        borderRadius: '50%',
        backgroundColor: 'yellow',
        transform: 'translate(-50%, -50%)',
      });
      console.log(marker);
      marker.addEventListener('mouseover', () => {
        highlightRow(city.name);
        highlightMarker(city.name);
        handleMouseOver(city, latPoint, lonPoint);
      });

      // Ajouter les gestionnaires d'événements
      marker.addEventListener('mousemove', (e) => {
        handleMouseMove(city);
      });

      marker.addEventListener('mouseleave', (e) => {
        handleMouseLeave();
      });

      //marker.setAttribute('data-name', city.name); // Attribut pour identifier la ville
      document.querySelector('.Map').appendChild(marker);
    });
  }

  function highlightRow(cityName) {
    // Parcourez toutes les lignes et mettez en surbrillance celle correspondante
    document.querySelectorAll('.city-table tr').forEach(row => {
        if (row.getAttribute('data-name') === cityName) {
            row.classList.add('highlight'); // ou modifiez le style directement
        } else {
            row.classList.remove('highlight');
        }
    });
}

function highlightMarker(cityName) {
    // Parcourez tous les marqueurs et mettez en surbrillance le correspondant
    document.querySelectorAll('.city-marker').forEach(marker => {
        if (marker.getAttribute('data-name') === cityName) {
            marker.classList.add('highlight-marker'); // ou modifiez le style directement
        } else {
            marker.classList.remove('highlight-marker');
        }
    });
}

  function FilterModal({ onClose, onApplyFilter, filterSettings, setFilterSettings }) {
    // Gestionnaire pour mettre à jour filterSettings localement
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFilterSettings((prevSettings) => ({
        ...prevSettings,
        [name]: value,
      }));
    };
  
    // Gestionnaire pour appeler onApplyFilter avec les nouveaux paramètres
    const handleSubmit = (e) => {
      e.preventDefault(); // Empêcher le rechargement de la page
      onApplyFilter(filterSettings); // Appliquer les filtres avec les paramètres actuels
      onClose(); // Fermer la modale après l'application
    };
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className='filter-modal'>
          <form onSubmit={handleSubmit}>
            <h2>Paramètres de Filtrage</h2>
            
            {/* Champ pour le nombre minimal de villes */}
            <div><label>
              Nombre de villes minimum :
              <input
                type="number"
                name="minVille"
                value={filterSettings.minVille}
                onChange={handleChange}
              />
            </label></div>
  
            {/* Champ pour la population minimale */}
            <div><label>
              Population minimale :
              <input
                type="number"
                name="minPopulation"
                value={filterSettings.minPopulation}
                onChange={handleChange}
              />
            </label></div>
            {/* Sélecteur de régions */}
            <select multiple value={selectedRegions} onChange={handleRegionChange}>
              <option value="">Toutes les régions</option>
                {uniqueRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            <div>
              <button onClick={resetFilters}>Réinitialiser les filtres</button>
              <button type="button" onClick={onClose}>Fermer</button>
              <button type="submit">Appliquer</button>
            </div>
          </form>
        </div>
      </div>
      </div>
    );
  }
  

  return (
    <div className="map-container" style={mapContainerStyle} >
      <div onClick={handleClick} className="Map" style={mapStyle}>
        <img src={image} alt="Map" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        {coords.lat && coords.lon && (
          <span className="marker" style={{
            position: 'absolute',
            top: `${coords.y}px`, // Coordonnée Y calculée
            left: `${coords.x}px`, // Coordonnée X calculée
            // Style du marqueur
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'red',
            transform: 'translate(-50%, -50%)' // Centrer le marqueur
          }}>
            {showInfo && closestCity && (<div className='city-marker'>
            <table className='city-table-hover'>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Région</th>
                <th>Population</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{closestCity.name}</td>
                <td>{closestCity.latitude}</td>
                <td>{closestCity.longitude}</td>
                <td>{closestCity.region}</td>
                <td>{closestCity.population}</td>
              </tr>
            </tbody>
          </table></div>)}
          </span>
        )}
      </div>
        {showFilterModal && (
          <FilterModal
            filterSettings={filterSettings}
            setFilterSettings={setFilterSettings}
            onClose={() => setShowFilterModal(false)}
            onApplyFilter={applyFilters}
          />
        )}
        <div className='table-and-details'>
          <div id="city-details" style={detailsStyle}>
            {/* Détails de la ville s'afficheront ici */}
          </div>
          <div id="city-table" className='city-table-container' >
            {/* Liste des villes s'affichera ici */}
          </div>
        </div>
      </div>
  );
}


export default Map;
