// Load the peaks from localStorage to sync with table
const savedPeaks = JSON.parse(localStorage.getItem("peaks"));
if (savedPeaks) {
  savedPeaks.forEach((savedPeak, index) => {
    peaks[index].climbed = savedPeak.climbed;
    peaks[index].date = savedPeak.date;
  });
}

// Initialize the map (assuming you're using Leaflet)
const map = L.map('map').setView([42.7, 0.5], 9); // Centered in the Pyrenees
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Add markers for each peak
peaks.forEach((peak, index) => {
  const marker = L.marker([peak.lat, peak.lng], {
    icon: L.icon({
      iconUrl: peak.climbed ? 'green-marker-icon.png' : 'red-marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    }),
}).addTo(map);

// Add a popup to log ascent from the map
marker.bindPopup(`
  <strong>${peak.name}</strong><br>
  Height: ${peak.height}m<br>
  Climbed: ${peak.climbed ? 'Yes' : 'No'}<br>
  <input type="date" id="ascent-date-${index}" value="${peak.date || ''}">
  <br>
  <button onclick="logAscent(${index})">Log Ascent</button>
`);
});

// Function to log ascent directly from map popup
function logAscent(index) {
const dateInput = document.querySelector(`#ascent-date-${index}`).value;

if (dateInput) {
  peaks[index].climbed = true;
  peaks[index].date = dateInput;

  // Update localStorage
  localStorage.setItem("peaks", JSON.stringify(peaks));

  // Refresh the marker icon to green
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.setIcon(
        L.icon({
          iconUrl: peaks[index].climbed ? 'green-marker-icon.png' : 'red-marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      );
    }
  });
} else {
  alert("Please select a date.");
}
}
