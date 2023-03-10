function exportKnowledgeBase() {
  const platformClient = require('platformClient');
  const apiInstance = new platformClient.KnowledgeApi();
  
  const knowledgeBaseId = document.querySelector('input[name="knowledgeBaseRadio"]:checked').value;
  console.log("Exportando Knowledge Base con ID", knowledgeBaseId);

  // Obtener lista de documentos
  apiInstance.getKnowledgeKnowledgebaseDocuments(knowledgeBaseId)
    .then((documents) => {
      console.log("Documentos descargados:", documents);

      // Obtener variations para cada documento y construir array
      const documentIds = documents.map(doc => doc.id);
      const promises = documentIds.map(docId => apiInstance.getKnowledgeKnowledgebaseDocumentVariations(knowledgeBaseId, docId));
      Promise.all(promises)
        .then((variations) => {
          console.log("Variaciones descargadas:", variations);

          // Construir JSON resultado
          const result = {
            "knowledgeBase": {
              "id": knowledgeBaseId
            },
            "documents": variations.flat() // unificar todas las variaciones de todos los documentos
          };
          console.log("Resultado:", result);
        })
        .catch((error) => {
          console.error("Error al obtener las variaciones:", error);
        });
    })
    .catch((error) => {
      console.error("Error al obtener los documentos:", error);
    });
}

