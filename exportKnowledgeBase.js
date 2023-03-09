function exportKnowledgeBase() {
  

  const platformClient = require('platformClient');
  const apiInstance = new platformClient.KnowledgeApi();
  const opts = {
    'knowledgeBaseId': knowledgeBaseId,
    'formatId': 'json'
  };
  apiInstance.postKnowledgeKnowledgebaseLanguageBulkexport(opts)
    .then((data) => {

    
    
    
function exportKnowledgeBase() {
  const platformClient = require('platformClient');
  const apiInstance = new platformClient.KnowledgeApi();

  // Crear el job de exportación
  const opts = {
    'body': {
      'fileType': 'json'
    }
  };
  apiInstance.postKnowledgeKnowledgebaseExportJobs(selectedKnowledgeBaseId, opts)
    .then((response) => {
      console.log(response);
      const jobId = response.id;

      // Esperar a que el job termine
      const intervalId = setInterval(() => {
        apiInstance.getKnowledgeKnowledgebaseExportJob(selectedKnowledgeBaseId, jobId)
          .then((job) => {
            console.log(job);
            if (job.status === 'COMPLETED') {
              clearInterval(intervalId);
              downloadJSON(job.outputUrl);
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


