import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Map from './Map';
import Navbar from './Navbar';
import mapImage from './france.png';


const topLeftCorner = { latitude: 48.5403, longitude: -4.6575 }; //Ploudalmézeau
const bottomRightCorner = { latitude: 43.7034, longitude: 7.2663 };

function determineQuadrant(x, y, rect) {
  const isTop = y < rect.height / 2;
  const isLeft = x < rect.width / 2;
  
  if (isTop && isLeft) {
    return 'topLeft';
  } else if (isTop && !isLeft) {
    return 'topRight';
  } else if (!isTop && isLeft) {
    return 'bottomLeft';
  } else {
    return 'bottomRight';
  }
}

function convertToLat(x, y) {
  const rect = document.querySelector('.Map').getBoundingClientRect();
  const quadrant = determineQuadrant(x,y,rect);
  let margeErreurLat;
  if (quadrant === 'topLeft') {
    margeErreurLat = 0.98;
  }else if(quadrant === 'bottomLeft'){
    margeErreurLat = -0.5;
  }else if(quadrant === 'bottomRight'){
    margeErreurLat = -0.9;
  }else if(quadrant === 'topRight'){
    margeErreurLat = 2.78;
  }
  const mapHeight = rect.height;
  const lat = topLeftCorner.latitude - ((topLeftCorner.latitude - bottomRightCorner.latitude) * (y) / mapHeight) + margeErreurLat;
  return {lat, quadrant} ;
}

function convertToLon(x, y) {
  const rect = document.querySelector('.Map').getBoundingClientRect();
  const mapWidth = rect.width;
  const quadrant = determineQuadrant(x,y,rect);
  let margeErreurLon;
  if (quadrant === 'topLeft') {
    margeErreurLon = -0.6;
  }else if(quadrant === 'bottomLeft'){
    margeErreurLon = -0.53;
  }else if(quadrant === 'bottomRight'){
    margeErreurLon = 0.94;
  }else if(quadrant === 'topRight'){
    margeErreurLon = 1.0;
  }
  const longitudeRange = bottomRightCorner.longitude - topLeftCorner.longitude;
  const lonRatio = (x) / mapWidth;
  return topLeftCorner.longitude + longitudeRange * lonRatio + margeErreurLon ;
}

function convertCoordsToPosition(lat, lon, quadrant) {
  const rect = document.querySelector('.Map').getBoundingClientRect();
  const mapWidth = rect.width;
  const mapHeight = rect.height;
  
  let margeErreurLat;
  let margeErreurLon;
  let addPix;

  if (quadrant === 'topLeft') {
    margeErreurLon = -0.6;
    margeErreurLat = 0.98;
    addPix = 0;
  }else if(quadrant === 'bottomLeft'){
    margeErreurLon = -0.53;
    margeErreurLat = -0.5;
    addPix = 0;
  }else if(quadrant === 'bottomRight'){
    margeErreurLon = 0.94;
    margeErreurLat = -0.9;
    addPix = 0;
  }else if(quadrant === 'topRight'){
    margeErreurLon = 1.0;
    margeErreurLat = 2.78;
    addPix = 50;
  }
  console.log(addPix);
  const x = Math.abs((mapWidth * (lon - topLeftCorner.longitude - margeErreurLon)) / (topLeftCorner.longitude - bottomRightCorner.longitude));
  const y = addPix + Math.abs((mapHeight * (lat - topLeftCorner.latitude - margeErreurLat)) / (topLeftCorner.latitude - bottomRightCorner.latitude));

  return { x, y };
}



function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
          <Routes>
            <Route path="/" element={<Map image={mapImage}
              convertToLat={convertToLat}
              convertToLon={convertToLon} convertCoordsToPosition={convertCoordsToPosition}/>} />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
