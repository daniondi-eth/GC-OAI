function exportKnowledgeBase() {
  const platformClient = require('platformClient');
  const apiInstance = new platformClient.KnowledgeApi();

  const knowledgeBaseId = document.querySelector('input[name="knowledgeBaseRadio"]:checked').value;
  console.log("Exportando Knowledge Base con ID", knowledgeBaseId);

  let opts = {};

  // Obtener documentos de la knowledge base
  apiInstance.getKnowledgeKnowledgebaseDocuments(knowledgeBaseId, opts)
    .then((response) => {
      const entities = Array.isArray(response.entities) ? response.entities : [response.entities]; // Aseguramos que entities sea un array
      const documentIds = entities.map(entity => entity.id);
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
          handleFileSelect(json);
        })
        .catch((error) => {
          console.error('Error al obtener las variaciones de documentos:', error);
          throw error;
        });
    })
    .catch((error) => {
      console.error('Fallo al obtener los documentos:', error);
      throw error;
    });
}
