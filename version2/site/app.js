// BEHAVIOUR: what happens on the page. Runs top to bottom when the page loads.
// Lab 3. Parts 6 to 8 of the handout ask you to change the lines marked PART.

// PART 7 will change this line. Leave it for now.
const map = L.map('map', { preferCanvas: true })

// Base map: OpenStreetMap. It needs the page served by Live Server, which is how
// this lab opens it. A page opened by double-click gets "Access blocked" tiles.
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// PART 6: how many pipes to draw. Start small, then try them all.
const LIMIT = Infinity;  // change to 1000, 10000, or Infinity
const disturbanceColours = {
  Cutblock: '#be621b',
  Settlement: '#7570b3',
  Mine: '#e7298a',
  Agriculture: '#4d7e16',
  Harvest: '#1b9e77',
  'Oil/Gas': '#e6ab02',
  Unknown: '#6b7280'
};

function styleDisturbance(feature) {
  const colour = disturbanceColours[feature.properties.Class] || disturbanceColours.Unknown;
  return {
    color: colour,
    fillColor: colour,
    weight: 1.5,
    fillOpacity: 0.45
  };
}

function addDisturbancePopup(feature, layer) {
  const disturbanceClass = feature.properties.Class || 'Unknown';
  layer.bindPopup(
    '<h3>Disturbance Type</h3>' +
    '<strong>' + disturbanceClass + '</strong>'
  );
}

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
  fetch('../Data/Take2/Caribou_Fire_Web.geojson').then(response  => response.json())

    // PART 8: change the file name to your own
])
  .then(function ([forestierData, gaspesieData, PolyData, ManicouaganPolyData, ManouanePolyData, PipmuacanPolyData, ValdOrPolyData, QubecPolyData, QuebecWithoutCutblocksData, FireData]) {
   
  const forestierLayer = L.geoJSON(forestierData, {
    style: {
      color: '#8b8066',
      fillColor: '#8b8066',
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

  const FireLayer = L.geoJSON(FireData, {
    style: {
      color: '#e82214',
      fillColor: '#e82214',
      weight: 2,
      fillOpacity: 0.35
    },
  }).addTo(map);

const disturbanceData = [
  PolyData,
  ManicouaganPolyData,
  ManouanePolyData,
  PipmuacanPolyData,
  ValdOrPolyData,
  QubecPolyData,
  QuebecWithoutCutblocksData
];

const classLayers = {};

Object.keys(disturbanceColours).forEach(function (className) {
  const features = disturbanceData.flatMap(function (data) {
    return data.features.filter(function (feature) {
      return (feature.properties.Class || 'Unknown') === className;
    });
  });

  classLayers[className] = L.geoJSON({
    type: 'FeatureCollection',
    features: features
  }, {
    style: styleDisturbance,
    onEachFeature: addDisturbancePopup
  }).addTo(map);
});

const allDisturbances = L.layerGroup(
  Object.values(classLayers)
).addTo(map);

L.control.layers({
  'Caribou Populations': L.layerGroup([
    forestierLayer,
    gaspesieLayer
  ])
}, {
  'Anthropogenic disturbances': allDisturbances,
  'Natural disturbances': FireLayer
}, {
  collapsed: false
}).addTo(map);

const disturbanceLegend = L.control({
  position: 'bottomright'
});

disturbanceLegend.onAdd = function () {
  const div = L.DomUtil.create('div', 'legend');

  div.style.background = 'white';
  div.style.padding = '8px 10px';
  div.style.lineHeight = '1.5';
  div.style.borderRadius = '4px';

  div.innerHTML = '<strong>Disturbance class</strong><br>';

  Object.entries(classLayers).forEach(function ([className, layer]) {
    const label = document.createElement('label');
    label.style.display = 'block';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;

    const swatch = document.createElement('span');
    swatch.style.display = 'inline-block';
    swatch.style.width = '12px';
    swatch.style.height = '12px';
    swatch.style.margin = '0 6px';
    swatch.style.background =
      disturbanceColours[className];

    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        layer.addTo(map);
      } else {
        map.removeLayer(layer);
      }
    });

    label.appendChild(checkbox);
    label.appendChild(swatch);
    label.appendChild(document.createTextNode(className));
    div.appendChild(label);
  });

  L.DomEvent.disableClickPropagation(div);
  return div;
};

disturbanceLegend.addTo(map);

map.fitBounds(forestierLayer.getBounds());
  
}).catch(function (err) {
  console.error("GeoJSON loading failed:", err);
})