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
