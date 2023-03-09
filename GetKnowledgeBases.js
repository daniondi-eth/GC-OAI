function GetKnowledgeBases() {
  
  const platformClient = require('platformClient');
  
  const knowledgeBaseTable = document.getElementById('knowledgeBaseTable');
  knowledgeBaseTable.innerHTML = '';

  // Llamada a la API "Get knowledge bases" usando el SDK de Genesys Cloud
  let apiInstance = new platformClient.KnowledgeApi();
  let opts = {};
  apiInstance.getKnowledgeKnowledgebases(opts)
    .then((knowledgeBases) =>  {
    // Crea una fila en la tabla para cada knowledge base
    knowledgeBases.entities.forEach((kb) => {
      const row = knowledgeBaseTable.insertRow();
      const radioCell = row.insertCell();
      const idCell = row.insertCell();
      const nameCell = row.insertCell();
      const descriptionCell = row.insertCell();
      const coreLanguageCell = row.insertCell();
      const articleCountCell = row.insertCell();

      // Crea un radio button para seleccionar la fila deseada
      const radioBtn = document.createElement('input');
      radioBtn.type = 'radio';
      radioBtn.name = 'knowledgeBaseRadio';
      radioBtn.value = kb.id;
      radioCell.appendChild(radioBtn);

      // Agrega los datos de cada knowledge base a la fila correspondiente en la tabla
      idCell.innerHTML = kb.id;
      nameCell.innerHTML = kb.name;
      descriptionCell.innerHTML = kb.description;
      coreLanguageCell.innerHTML = kb.coreLanguage;
      articleCountCell.innerHTML = kb.articleCount;
    });
  }).catch((error) => {
    console.error('Error al obtener las knowledge bases:', error);
  });
}
