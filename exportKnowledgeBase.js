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
  const headers = {
    'Origin': 'https://daniondi-eth.github.io/GC-OAI/' // para evitar error CORS
  };
  apiInstance.postKnowledgeKnowledgebaseExportJobs(knowledgeBaseId, opts, headers)
    .then((response) => {
      console.log(response);
      const jobId = response.id;

      // Esperar a que el job termine
      const intervalId = setInterval(() => {
        apiInstance.getKnowledgeKnowledgebaseExportJob(knowledgeBaseId, jobId, headers)
          .then((job) => {
            console.log(job);
            console.log("El status del job es: "+job.status);
            if (job.status.toLowerCase() === 'completed') {
              clearInterval(intervalId);
              console.log("La URL de descarga es: "+job.downloadURL);
              fetch(job.downloadURL, {
                headers: headers // Agregar headers a la solicitud de descarga
              })
                .then(response => response.json())
                .then(jsonData => {
                  console.log("JSON descargado:", jsonData);
                  // Aquí puedes hacer algo con el JSON descargado
                })
                .catch(error => {
                  console.error("Error al descargar el JSON:", error);
                  throw error;
                });              
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
