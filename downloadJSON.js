
function downloadJSON(url) {
  return fetch(url)
    .then(response => response.json())
    .then(jsonData => {
      console.log("JSON descargado:", jsonData);
      return jsonData;
    })
    .catch(error => {
      console.error("Error al descargar el JSON:", error);
      throw error;
    });
}
