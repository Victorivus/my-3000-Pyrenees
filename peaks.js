let peaks;
// Load saved data from localStorage if available
peaks = JSON.parse(localStorage.getItem("peaks"));
if (!peaks) {
    fetch('3000_peaks_pyrenees.json')
    .then(response => response.json())
    .then(data => {
        peaks = data;
        peaks.forEach((peak, index) => {
            peak.climbed = 'No';
            peak.date = '';
          });
        document.dispatchEvent(new Event('peaksLoaded'));
    })
    .catch(error => console.error('Error loading the file:', error));
}