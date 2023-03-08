function GetKnowledgeBase() {

  const platformClient = require('platformClient');
  let apiInstance = new platformClient.KnowledgeApi();
  let opts = {};

  // Get knowledge bases
  apiInstance.getKnowledgeKnowledgebases(opts)
    .then((data) => {
      console.log(`getKnowledgeKnowledgebases success! data: ${JSON.stringify(data, null, 2)}`);

      const tableBody = document.querySelector('#knowledge-bases-table tbody');
      data.entities.forEach((knowledgeBase) => {
        const row = document.createElement('tr');
        const idCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const descriptionCell = document.createElement('td');
        const coreLanguageCell = document.createElement('td');
        const articleCountCell = document.createElement('td');

        idCell.innerText = knowledgeBase.id;
        nameCell.innerText = knowledgeBase.name;
        descriptionCell.innerText = knowledgeBase.description;
        coreLanguageCell.innerText = knowledgeBase.coreLanguage;
        articleCountCell.innerText = knowledgeBase.articleCount;
        
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = 'knowledgeBase';
        radioInput.value = knowledgeBase.id;
        radioCell.appendChild(radioInput);

        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(descriptionCell);
        row.appendChild(coreLanguageCell);
        row.appendChild(articleCountCell);
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.log("There was a failure calling getKnowledgeKnowledgebases");
      console.error(err);
    });    
}


  function KnowledgeExportJob() {
    let apiInstance = new platformClient.KnowledgeApi();

    const apiComponent = {
      data: function() {
        return {
          response: null,
          error: null,
          knowledgeBaseId: "",
        }
      },

      methods: {
        createExportJob: function() {
          this.response = null;
          this.error = null;

          apiInstance.postKnowledgeKnowledgebaseExportJobs(this.knowledgeBaseId, {})
            .then((data) => {
              console.log(`postKnowledgeKnowledgebaseExportJobs success! data: ${JSON.stringify(data, null, 2)}`);
              this.response = data;
            })
            .catch((err) => {
              console.log("There was a failure calling postKnowledgeKnowledgebaseExportJobs");
              console.error(err);
              this.error = err;
            });
        }
      },

      template: `
        <div>
          <form @submit.prevent="createExportJob">
            <label>Knowledge Base ID:</label>
            <input type="text" v-model="knowledgeBaseId">
            <button type="submit">Create Export Job</button>
          </form>

          <div v-if="response">
            <h2>Export Job Created Successfully:</h2>
            <pre>{{ response }}</pre>
          </div>

          <div v-if="error">
            <h2>Error Creating Export Job:</h2>
            <pre>{{ error }}</pre>
          </div>
        </div>
      `
    };

    new Vue({
      el: '#app',

      components: {
        'api-component': apiComponent
      }
    }); 
}
