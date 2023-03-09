function GetKnowledgeBase(callback) {
  const platformClient = require('platformClient');
  let apiInstance = new platformClient.KnowledgeApi();
  let opts = {};
  // Get knowledge bases
  apiInstance.getKnowledgeKnowledgebases(opts)
    .then((knowledgeBases) => {
        console.log(`Found ${knowledgeBases.entities.length} knowledge bases.`);
        const knowledgeBaseTable = document.getElementById('knowledge-bases-table').getElementsByTagName('tbody')[0];
        knowledgeBases.entities.forEach((kb) => {
            const row = knowledgeBaseTable.insertRow();
            row.insertCell(0).appendChild(document.createTextNode(kb.id));
            row.insertCell(1).appendChild(document.createTextNode(kb.name));
            row.insertCell(2).appendChild(document.createTextNode(kb.description));
            row.insertCell(3).appendChild(document.createTextNode(kb.coreLanguage));
            row.insertCell(4).appendChild(document.createTextNode(kb.articleCount));
            row.insertCell(5).innerHTML = '<button onclick="exportKnowledgeBase(\'' + kb.id + '\')">Export Knowledge Base</button>';

        });
        if (callback) {
            callback();
        }
    })
    .catch((err) => {
        console.log('There was a failure calling getKnowledgeKnowledgebases');
        console.error(err);
    });
}
