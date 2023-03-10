function exportKnowledgeBase() {
  const platformClient = require('platformClient');
  const apiInstance = new platformClient.KnowledgeApi();

  const knowledgeBaseId = document.querySelector('input[name="knowledgeBaseRadio"]:checked').value;
  console.log("Exportando Knowledge Base con ID", knowledgeBaseId);

  // Obtener documentos de la knowledge base
  apiInstance.getKnowledgeKnowledgebaseDocuments(knowledgeBaseId)
    .then((response) => {
      const documents = Array.isArray(response) ? response : [response]; // Aseguramos que response sea un array
      const documentIds = documents.map(document => document.id);
      console.log("IDs de documentos:", documentIds);

      // Obtener variaciones para cada documento
      const documentPromises = documentIds.map(documentId =>
        apiInstance.getKnowledgeKnowledgebaseDocumentVariations(knowledgeBaseId, documentId)
      );
      Promise.all(documentPromises)
        .then((variationsResponses) => {
          const documents = variationsResponses.map((variationsResponse, index) => {
            return {
              id: documentIds[index],
              variations: variationsResponse
            };
          });
          const knowledgeBase = {
            id: knowledgeBaseId
          };
          const json = JSON.stringify({
            knowledgeBase: knowledgeBase,
            documents: documents
          });
          console.log("JSON descargado:", json);
          return json;
        })
        .catch((error) => {
          console.error('Error al obtener las variaciones de documentos:', error);
          throw error;
        });
    })
    .catch((error) => {
      console.error('Error al obtener los documentos:', error);
      throw error;
    });
}
