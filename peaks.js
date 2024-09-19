let peaks;

fetch('3000_peaks_pyrenees.json')
  .then(response => response.json())
  .then(data => {
    peaks = data;
  })
  .catch(error => console.error('Error loading the file:', error));
