let peaks;
if (!peaks) {
    fetch('3000_peaks_pyrenees.json')
    .then(response => response.json())
    .then(data => {
        peaks = data;
        document.dispatchEvent(new Event('peaksLoaded'));
    })
    .catch(error => console.error('Error loading the file:', error));
}