// Coordinates for the Pyrenees peaks
const peaks = [
    { name: "Aneto", lat: 42.6369, lng: 0.657, height: 3404 },
    { name: "Posets", lat: 42.656, lng: 0.4014, height: 3369 },
    { name: "Monte Perdido", lat: 42.6822, lng: 0.0544, height: 3355 },
    { name: "Pico Maldito", lat: 42.6344, lng: 0.6567, height: 3350 },
    { name: "Pico Espadas", lat: 42.6537, lng: 0.4064, height: 3328 },
    { name: "Pico de la Maladeta", lat: 42.6406, lng: 0.6506, height: 3308 },
    { name: "Punta d'Astorg", lat: 42.6411, lng: 0.6606, height: 3355 },
    { name: "Pico de Tempestades", lat: 42.6375, lng: 0.6606, height: 3290 },
    { name: "Pico Russell", lat: 42.6389, lng: 0.6611, height: 3205 },
    { name: "Pico del Medio", lat: 42.6422, lng: 0.6550, height: 3346 },
    { name: "Pico de Coronas", lat: 42.6364, lng: 0.6633, height: 3293 },
    // Test, to be completed
];

// Initialize the map
const map = L.map('map').setView([42.5, 0.5], 8);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to get the climb status from localStorage
function getClimbStatus(peakName) {
    return localStorage.getItem(peakName) === 'climbed';
}

// Function to set the climb status in localStorage
function setClimbStatus(peakName, climbed) {
    localStorage.setItem(peakName, climbed ? 'climbed' : 'not climbed');
}

// Function to update marker color based on climb status
function getMarkerColor(peakName) {
    return getClimbStatus(peakName) ? 'green' : 'red';
}

// Add a marker for each peak
peaks.forEach(peak => {
    const marker = L.circleMarker([peak.lat, peak.lng], {
        color: getMarkerColor(peak.name),
        radius: 8,
    }).addTo(map);

    marker.bindPopup(`
        <b>${peak.name} (${peak.height}m)</b><br>
        <button onclick="logAscent('${peak.name}')">Log Ascent</button>
    `);

    // Save the marker reference for later updates
    peak.marker = marker;
});

// Function to log the ascent of a peak
window.logAscent = function(peakName) {
    const climbed = getClimbStatus(peakName);
    const newClimbedStatus = !climbed; // Toggle status
    setClimbStatus(peakName, newClimbedStatus);

    // Find the peak and update the marker color
    const peak = peaks.find(p => p.name === peakName);
    if (peak) {
        peak.marker.setStyle({ color: getMarkerColor(peak.name) });
    }
};
