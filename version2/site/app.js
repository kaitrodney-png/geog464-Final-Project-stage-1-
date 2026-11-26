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
  Cutblock: '#2c4ba0',
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

// Keeps track of all individual caribou population boundaries
const populationFeatureLayers = []; 
// Keeps track of the Return to Québec Overview button
let overviewButton;

// Empty layer for population-specific fire disturbances
let fireLayer = L.geoJSON(null, {
  style: {
    color: '#e8762490',
    weight: 1,
    fillColor: '#e8762490',
    fillOpacity: 0.5
  }
});

// Empty layer for population-specific linear disturbances
let linearLayer = L.geoJSON(null, {
  style: {
    color: '#555B61',
    weight: 2,
    opacity: 0.8
  }
}); 

// Keeps track of the map's layer control
let layerControl;


function addCaribouPopup(feature, layer) {
  const p = feature.properties;

  // Popup shown when clicking a population on the overview
  layer.bindPopup(
    '<strong class="population-popup-title">' + p.Local_Pop_Name + '</strong><br>' +
   '<button class="explore-population">Explore this population</button>'
  );

  // Keep track of each individual population boundary
  populationFeatureLayers.push(layer);

  // When the popup opens, activate its Explore button
  layer.on('popupopen', function (event) {
    const button = event.popup.getElement()
      .querySelector('.explore-population');

    button.addEventListener('click', function () {
      map.closePopup();
      selectPopulation(layer);
    });
  });
}


// Shared function for selecting a population
function selectPopulation(selectedLayer) {

  // Hide every population except the selected one
  populationFeatureLayers.forEach(function (populationLayer) {
    if (populationLayer !== selectedLayer) {
      map.removeLayer(populationLayer);
    }
  });
  // Disable the population popup in individual view
selectedLayer.unbindPopup();

  // Hide the introductory information
  document.querySelector('.story').style.display = 'none';

  // Show the Return to Québec Overview button
  overviewButton.style.display = 'block';

  // Zoom to the selected population
  map.fitBounds(selectedLayer.getBounds(), {
    padding: [30, 30]
  });
// Get the information for the selected population
const p = selectedLayer.feature.properties;

// Get the selected population's name
const populationName = p.Local_Pop_Name;

// Build the path to its fire GeoJSON file
const fireFile = "../Data/Fire_by_POP/" + populationName + "_Fire.geojson";


fetch(fireFile)
  .then(response => response.json())
  .then(data => {

    // Load the selected population's fire data
    fireLayer.clearLayers();
    fireLayer.addData(data);

    // Add the fire layer to the map
    //fireLayer.addTo(map);

    // Add the fire checkbox to the layer control
  layerControl.addOverlay(fireLayer, 'Fire disturbances');

  })
  .catch(error => {
    console.error("Error loading fire data:", error);
  });

  
  // Build the path to its linear disturbance GeoJSON file
const linearFile = "../Data/Linear_by_POP/" + populationName + "_Linear.geojson";

fetch(linearFile)
  .then(response => response.json())
  .then(data => {

    // Load the selected population's linear data
    linearLayer.clearLayers();
    linearLayer.addData(data);

    // Add the linear checkbox to the layer control
    layerControl.addOverlay(linearLayer, 'Linear disturbances');

  })
  .catch(error => {
    console.error("Error loading linear data:", error);
  }); 

// Display the population name as the panel heading
document.getElementById('populationInfoName').textContent =
  p.Local_Pop_Name;

// Display the remaining population information
document.getElementById('populationInfoDetails').innerHTML =
  '<p><strong>English name:</strong> ' + (p.name_en || 'Not available') + '</p>' +
  '<p><strong>Scientific name:</strong> ' + (p.name_sci || 'Not available') + '</p>' +
  '<p><strong>Status:</strong> ' + (p.status || 'Not available') + '</p>' +
  '<p><strong>Stability level:</strong> ' + 
  (p.Level_Of_Stability || 'Not available').replace(/(S\d)(S\d)/g, '$1-$2') +
'</p>';
// Make the information panel visible
document.getElementById('populationInfo').style.display = 'block'; 
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
  fetch('../Data/Take2/Quebec_Without_Cutblocks.geojson').then(response  => response.json())
    // PART 8: change the file name to your own
])
  .then(function ([forestierData, gaspesieData, PolyData, ManicouaganPolyData, ManouanePolyData, PipmuacanPolyData, ValdOrPolyData, QubecPolyData, QuebecWithoutCutblocksData]) {
   
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

 /* creates the information that goes in the drop down, the boolean is what actually sorts through and takes out bad data if it stil is present */ 
const populationSelect = document.getElementById('populationSelect');
const populationNames = [...new Set(
  populationFeatureLayers
    .map(function (layer) {
      return layer.feature.properties.Local_Pop_Name;
    })
    .filter(Boolean)
)].sort();
/* adds the actual names onto the drop down menu */
populationNames.forEach(function (name) {
  const option = document.createElement('option');

  option.value = name;
  option.textContent = name;

  populationSelect.appendChild(option);
});

// When someone selects a population from the dropdown
populationSelect.addEventListener('change', function () {

  // Get the name selected in the dropdown
  const selectedName = populationSelect.value;

  // Find the matching population boundary
  const selectedLayer = populationFeatureLayers.find(function (layer) {
    return layer.feature.properties.Local_Pop_Name === selectedName;
  });

  // Use the same function as clicking a boundary on the map
  if (selectedLayer) {
    selectPopulation(selectedLayer);
  }

}); 

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


layerControl = L.control.layers({
  'Caribou Populations': L.layerGroup([
    forestierLayer,
    gaspesieLayer
  ])
}, {
  'Anthropogenic disturbances': allDisturbances,
}, {
  collapsed: false
}).addTo(map);

console.log("Layer control created:", layerControl);

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

// NEW: Create the Return to Québec Overview button
const overviewControl = L.control({
  position: 'topleft'
});

overviewControl.onAdd = function () {

  const container = L.DomUtil.create('div', 'leaflet-bar');

 overviewButton = L.DomUtil.create('button', 'overview-button', container); 
 overviewButton.style.display = 'none'; 


  overviewButton.type = 'button';
  overviewButton.textContent = 'Return to Québec Overview';

  L.DomEvent.disableClickPropagation(container);


  
    // EVENT: When wanting to return, listen for a click on the button
  L.DomEvent.on(overviewButton, 'click', function () {

  // Restore all population boundaries and their overview popups
  populationFeatureLayers.forEach(function (populationLayer) {

    // Restore the population boundary
    populationLayer.addTo(map);

    // Get the population information
    const p = populationLayer.feature.properties;

    // Restore the overview popup
    populationLayer.bindPopup(
      '<strong>' + p.Local_Pop_Name + '</strong><br>' +
      '<button class="explore-population">Explore this population</button>'
    );

  });

  // Remove fire disturbances from the map
  map.removeLayer(fireLayer);

  // Remove fire disturbances from the layer control
  layerControl.removeLayer(fireLayer);

  map.removeLayer(linearLayer);
  layerControl.removeLayer(linearLayer);

  // Hide the Return button
  overviewButton.style.display = 'none';


  // Close any open popup
  map.closePopup();

  // Bring back the introductory story
  document.querySelector('.story').style.display = 'block';

  // Hide the individual population information panel
  document.getElementById('populationInfo').style.display = 'none';

  // Calculate the full provincial extent
  const provinceBounds = L.featureGroup([
    forestierLayer,
    gaspesieLayer
  ]).getBounds();

  // Zoom back out to the provincial overview
  map.fitBounds(provinceBounds, {
    padding: [30, 30]
  });

});

  // Return the button container to Leaflet
  return container;
};

// Add the button to the map
overviewControl.addTo(map);

// Set the initial map view
map.fitBounds(forestierLayer.getBounds());

}).catch(function (err) {
  console.error("GeoJSON loading failed:", err);
});

