function exportKnowledgeBase(event,knowledgeBaseId) {
  
  //para evitar que se recargue la página al seleccionar la Knowledge Base que queremos exportar)
  if (event) {
    event.preventDefault();
  }
  
  const platformClient = require('platformClient');
  const apiInstance = new platformClient.KnowledgeApi();
  const opts = {
    'knowledgeBaseId': knowledgeBaseId,
    'formatId': 'json'
  };
  apiInstance.postKnowledgeKnowledgebaseLanguageBulkexport(opts)
    .then((data) => {
      console.log(data);
      const jobId = data.jobId;
      const statusParagraph = document.createElement('p');
      statusParagraph.textContent = `Export job with ID ${jobId} created. Status: ${data.status}`;
      const responseDiv = document.getElementById('app');
      responseDiv.appendChild(statusParagraph);
      checkExportJobStatus(jobId)
        .then((jobData) => {
          // Download the JSON file
          const downloadLink = document.createElement('a');
          downloadLink.href = jobData.resultsUri;
          downloadLink.download = `${knowledgeBaseId}.json`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          // Read the contents of the JSON file
          const fileReader = new FileReader();
          fileReader.onload = () => {
            const json = fileReader.result;
            console.log(json);
            return (json);
          };
          fileReader.readAsText(jobData.resultsUri);
        })
        .catch((err) => {
          console.log('There was a failure checking the export job status');
          console.error(err);
        });
    })
    .catch((err) => {
      console.log('There was a failure calling postKnowledgeKnowledgebaseLanguageBulkexport');
      console.error(err);
    });
    selectedKnowledgeBaseId = knowledgeBaseId; // Establece el valor de la variable global
}
