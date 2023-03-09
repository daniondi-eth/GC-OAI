function GetKnowledgeBase(exportCallback) {

  const platformClient = require('platformClient');
  let apiInstance = new platformClient.KnowledgeApi();
  let opts = {};
  // Get knowledge bases
  apiInstance.getKnowledgeKnowledgebases(opts)
    .then((data) => {
        console.log(`Found ${knowledgeBases.entities.length} knowledge bases.`);
        const knowledgeBaseTable = document.getElementById('knowledge-bases-table').getElementsByTagName('tbody')[0];
        knowledgeBases.entities.forEach((kb) => {
            const row = knowledgeBaseTable.insertRow();
            row.insertCell(0).appendChild(document.createTextNode(kb.id));
            row.insertCell(1).appendChild(document.createTextNode(kb.name));
            row.insertCell(2).appendChild(document.createTextNode(kb.description));
            row.insertCell(3).appendChild(document.createTextNode(kb.coreLanguage));
            row.insertCell(4).appendChild(document.createTextNode(kb.articleCount));
            row.insertCell(5).innerHTML = '<button onclick="exportKnowledgeBase(\'' + kb.id + '\')">Export</button>';
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
