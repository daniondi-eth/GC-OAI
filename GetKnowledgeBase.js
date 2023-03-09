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
        const radioCell = document.createElement('td');

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
        row.appendChild(radioCell);
        tableBody.appendChild(row);
      });

      // Add button for KnowledgeExportJob
      const exportButton = document.querySelector('#export-knowledge-base-button') || document.createElement('button');
      exportButton.id = 'export-knowledge-base-button';
      exportButton.innerText = 'Export Knowledge Base';
      exportButton.disabled = true;
    
      exportButton.addEventListener('click', () => {
        const selectedId = document.querySelector('input[name="knowledgeBase"]:checked');
        if (selectedId) {
          KnowledgeExportJob(event, parseInt(selectedId.value));
        }
      });

      const exportButtonRow = document.createElement('tr');
      const exportButtonCell = document.createElement('td');
      exportButtonCell.colSpan = 6;
      exportButtonCell.style.textAlign = 'right';
      exportButtonCell.appendChild(exportButton);
      exportButtonRow.appendChild(exportButtonCell);
      tableBody.appendChild(exportButtonRow);

      // Enable export button when a knowledge base is selected
      const radioInputs = document.querySelectorAll('input[name="knowledgeBase"]');
      radioInputs.forEach((radioInput) => {
        radioInput.addEventListener('change', () => {
          exportButton.disabled = false;
        });
      });
    })
    .catch((err) => {
      console.log("There was a failure calling getKnowledgeKnowledgebases");
      console.error(err);
    });
}

function KnowledgeExportJob(event, knowledgeBaseId) {
  event.preventDefault(); // evita que la página se recargue

  const platformClient = require('platformClient');
  let apiInstance = new platformClient.KnowledgeApi();

  const apiComponent = {

    props: ['knowledgeBaseId'],

    data: function() {
      return {
        response: null,
        error: null,
        exportJobId: null,
        selectedKnowledgeBaseId: null
      }
    },

    methods: {
      createExportJob: function() {
        this.response = null;
        this.error = null;

        apiInstance.postKnowledgeKnowledgebaseExportJobs(this.knowledgeBaseId, {})
          .then((data) => {
            console.log(`postKnowledgeKnowledgebaseExportJobs success! data: ${JSON.stringify(data, null, 2)}`);
            this.exportJobId = data.id;
            this.response = data;
            this.waitForExportJob();
          })
          .catch((err) => {
            console.log("There was a failure calling postKnowledgeKnowledgebaseExportJobs");
            console.error(err);
            this.error = err;
          });
      },

      waitForExportJob: function() {
        const checkJobStatus = () => {
          apiInstance.getKnowledgeKnowledgebaseExportJobs(this.knowledgeBaseId, this.exportJobId)
            .then((data) => {
              console.log(`getKnowledgeKnowledgebaseExportJobs success! data: ${JSON.stringify(data, null, 2)}`);
              if (data.status === 'completed') {
                this.downloadExportFile(data.downloadUrl);
              } else if (data.status === 'failed') {
                this.error = new Error('Export job failed');
              } else {
                setTimeout(checkJobStatus, 5000);
              }
            })
            .catch((err) => {
              console.log("There was a failure calling getKnowledgeKnowledgebaseExportJobs");
              console.error(err);
              this.error = err;
            });
        };

        setTimeout(checkJobStatus, 5000);
      },

      downloadExportFile: function(downloadUrl) {
        axios.get(downloadUrl, {
          responseType: 'arraybuffer'
        })
        .then((response) => {
          console.log(`downloadExportFile success!`);

          const fileName = `knowledge-base-${this.knowledgeBaseId}-export.json`;
          const file = new Blob([response.data], { type: 'application/json' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(file);
          link.download = fileName;
          link.click();
          this.response = `Export file downloaded as ${fileName}`;
        })
        .catch((err) => {
          console.log("There was a failure downloading the export file");
          console.error(err);
          this.error = err;
        });
      }
    },

    template: '#api-component-template'
  };

  new Vue({
    el: '#app',

    components: {
      'api-component': apiComponent
    },

    data: {
      selectedKnowledgeBaseId: null
    },

    methods: {
      setSelectedKnowledgeBaseId: function(knowledgeBaseId) {
        this.selectedKnowledgeBaseId = knowledgeBaseId;
      }
    }
  });

  const instance = new Vue();

  instance.$on('knowledge-base-selected', (knowledgeBaseId) => {
    instance.setSelectedKnowledgeBaseId(knowledgeBaseId);
  });
}
