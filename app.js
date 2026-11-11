// BEHAVIOUR: what happens on the page. Runs top to bottom when the page loads.
// Lab 3. Parts 6 to 8 of the handout ask you to change the lines marked PART.

// PART 7 will change this line. Leave it for now.
const map = L.map('map', { preferCanvas: true }).setView([47.15, -82.64], 12);

// Base map: OpenStreetMap. It needs the page served by Live Server, which is how
// this lab opens it. A page opened by double-click gets "Access blocked" tiles.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// PART 6: how many pipes to draw. Start small, then try them all.
const LIMIT = Infinity;  // change to 1000, 10000, or Infinity
const colours = { Combined: '#d62728', Sanitary: '#8c564b', Storm: '#1f77b4' };

function addCaribouPopup(feature, layer) {
  const p = feature.properties;

  layer.bindPopup(
    '<h3>Caribou Population</h3>' +
    '<strong>' + p.Local_Pop_Name + '</strong><br>' +
    'English name: ' + p.name_en + '<br>' +
    'French name: ' + p.name_fr + '<br>' +
    'Scientific name: ' + p.name_sci + '<br>' +
    'Status: ' + p.status + '<br>' +
    'Stability level: ' + p.Level_Of_Stability + '<br>' +
    'Area: ' + p.area_km2 + ' km²<br>'
  );
} 
Promise.all([
  fetch('../Data/Cleaned/Caribou_Simplified.geojson').then(response  => response.json()),
  fetch('../Data/Cleaned/Caribou_Gaspesie_Simplified.geojson').then(response  => response.json()),
  fetch('../Data/Take2/Charlevoix2020_Disturb_Perturb_Poly.geojson').then(response  => response.json()), 
  fetch('../Data/Take2/Manicouagan2020_Disturb_Perturb_Poly.geojson').then(response  => response.json()),
  fetch('../Data/Take2/Manouane2020_Disturb_Perturb_Poly.geojson').then(response  => response.json()),
  fetch('../Data/Take2/Pipmuacan2020_Disturb_Perturb_Poly.geojson').then(response  => response.json()),
  fetch('../Data/Take2/ValdOr2020_Disturb_Perturb_Poly.geojson').then(response  => response.json()),
  fetch('../Data/Take2/Quebec_HU_Cutblocks.geojson').then(response  => response.json()), 
  fetch('../Data/Take2/Quebec_Without_Cutblocks.geojson').then(response  => response.json()),

    // PART 8: change the file name to your own
])
  .then(function ([forestierData, gaspesieData, PolyData, ManicouaganPolyData, ManouanePolyData, PipmuacanPolyData, ValdOrPolyData, QubecPolyData, QuebecWithoutCutblocksData]) {
   
  const forestierLayer = L.geoJSON(forestierData, {
    style: {
      color: '#04522a',
      fillColor: '#04522a',
      weight: 2,
      fillOpacity: 0.35
    },
    onEachFeature: addCaribouPopup
  }).addTo(map);

const gaspesieLayer = L.geoJSON(gaspesieData, {
    style: {
      color: '#1F2D5A',
      fillColor: '#1F2D5A',
      weight: 2,
      fillOpacity: 0.35
    },
    onEachFeature: addCaribouPopup
  }).addTo(map);


const PolyLayer = L.geoJSON(PolyData, {
    style: {
      color: '#FFD700',
      fillColor: '#FFD700',
      weight: 2,
      fillOpacity: 0.35
    },
  });

const ManicouaganLayer = L.geoJSON(ManicouaganPolyData, {
  style: {
    color: '#8E44AD',
    fillColor: '#8E44AD',
    weight: 2,
    fillOpacity: 0.35
  },

});
const ManouaneLayer = L.geoJSON(ManouanePolyData, {
  style: {
    color: '#FF6347',
    fillColor: '#FF6347',
    weight: 2,
    fillOpacity: 0.35
  },

});
const PipmuacanLayer = L.geoJSON(PipmuacanPolyData, {
  style: {
    color: '#32CD32',
    fillColor: '#32CD32',
    weight: 2,
    fillOpacity: 0.35
  },

});
const ValdOrLayer = L.geoJSON(ValdOrPolyData, {
  style: {
    color: '#FFD700',
    fillColor: '#FFD700',
    weight: 2,
    fillOpacity: 0.35
  },
});
const QuebecLayer = L.geoJSON(QubecPolyData, {
  style: {
    color: '#0000FF',
    fillColor: '#0000FF',
    weight: 2,
    fillOpacity: 0.35
  },
});
const QuebecWithoutCutblocksLayer = L.geoJSON(QuebecWithoutCutblocksData, {
  style: {
    color: '#9f1f7f',
    fillColor: '#9f1f7f',
    weight: 2,
    fillOpacity: 0.35
  },
}).addTo(map);
const allDisturbances = L.featureGroup([
  PolyLayer,
  ManicouaganLayer,
  ManouaneLayer,
  PipmuacanLayer,
  ValdOrLayer,
  QuebecLayer,
  QuebecWithoutCutblocksLayer
]).addTo(map);
  L.control.layers(null, {
  'Anthropogenic disturbances': allDisturbances
}, {
  collapsed: false
}).addTo(map);

  map.fitBounds(allDisturbances.getBounds());

})
.catch(function (err) {
  console.error("GeoJSON loading failed:", err);
});


