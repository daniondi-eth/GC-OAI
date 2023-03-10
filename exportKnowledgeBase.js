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
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const jsonData = JSON.parse(xhr.responseText);
          console.log("JSON descargado:", jsonData);
          resolve(jsonData);
        } else {
          console.error("Error al descargar el JSON:", xhr.statusText);
          reject(xhr.statusText);
        }
      }
    };
    xhr.open("GET", url, true);
    xhr.send();
  });
}


