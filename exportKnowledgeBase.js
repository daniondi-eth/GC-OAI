function exportKnowledgeBase() {
  const platformClient = require('platformClient');
  const apiInstance = new platformClient.KnowledgeApi();
  
  const knowledgeBaseId = document.querySelector('input[name="knowledgeBaseRadio"]:checked').value;
  console.log("Exportando Knowledge Base con ID", knowledgeBaseId);

  // Crear el job de exportación
  const opts = {
    'exportFilter': {
        'documentsFilter': null, 
        'versionFilter': 'Latest'
    }, 
    'fileType': 'json'
  };
  apiInstance.postKnowledgeKnowledgebaseExportJobs(knowledgeBaseId, opts)
    .then((response) => {
      console.log(response);
      const jobId = response.id;

      // Esperar a que el job termine
      const intervalId = setInterval(() => {
        apiInstance.getKnowledgeKnowledgebaseExportJob(knowledgeBaseId, jobId)
          .then((job) => {
            console.log(job);
            console.log("El status del job es: "+job.status);
            if (job.status.toLowerCase() === 'completed') {
              clearInterval(intervalId);
              console.log("La URL de descarga es: "+job.downloadURL);
              downloadJSON(job.downloadURL);              
            }
          })
          .catch((error) => {
            console.error('Error al obtener el estado del job de exportación:', error);
          });
      }, 1000);
    })
    .catch((error) => {
      console.error('Error al crear el job de exportación:', error);
    });
}
    
function downloadJSON(url) {
  return fetch(url, {
    mode: 'no-cors'
  })
    .then(response => response.text())
    .then(textData => {
      console.log("JSON descargado:", textData);
      return JSON.parse(textData);
    })
    .catch(error => {
      console.error("Error al descargar el JSON:", error);
      throw error;
    });
}


