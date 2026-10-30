// BEHAVIOUR: what happens on the page. Runs top to bottom when the page loads.

// 1. Create the map inside the div with id="map", centred on Montreal at zoom 12.
//    setView takes [latitude, longitude]. Note the order: lat first here.
const map = L.map('map').setView([45.51, -73.58], 12);

// 2. Add a base map (tiles) from OpenStreetMap. Attribution is required by their licence.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// 3. Load the GeoJSON that the notebook wrote. The path is relative to this site/ folder,
//    so ../data/Aires_repartition_MT.geojson means "go up one folder, then into data".
//    This only works through Live Server (http://...), not from a file:// address.
fetch('../Data/Aires_repartition_MT_simplified.geojson')
  .then(function (response) {
    if (!response.ok) { throw new Error('HTTP ' + response.status + ' loading places.geojson'); }
    return response.json();
  })
  .then(function (data) {
    // 4. Draw every feature. onEachFeature runs once per feature and builds its popup
    //    from the properties the notebook wrote. GeoJSON coordinates are [lon, lat].
    L.geoJSON(data, { 
      style: function (feature) {
  return { color: '#1F2D5A', weight: 2, fillOpacity: 0.35 };
},
      onEachFeature: function (feature, layer) {
        const p = feature.properties;
        layer.bindPopup('<strong>' + p.NOM_ANGLA + '</strong><br>' + p.NOM_FRANCA + '<br>' + p.NOM_SCIENT + '<br>' + p.FAMILLE);
      }
    }).addTo(map);
    document.getElementById('status').textContent = data.features.length + ' places loaded';
  })
  .catch(function (err) {
    // 5. If anything above fails, say so on the page AND in the console (F12).
    //    Never hide an error: it is the pipeline telling you which link broke.
    document.getElementById('status').textContent = 'Could not load places.geojson. Open the console (F12) for details.';
    console.error(err);
  });
