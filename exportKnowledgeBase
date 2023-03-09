function exportKnowledgeBase(knowledgeBaseId) {
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
      checkExportJobStatus(jobId);
    })
    .catch((err) => {
      console.log('There was a failure calling postKnowledgeKnowledgebaseLanguageBulkexport');
      console.error(err);
    });
}
