function GetKnowledgeBase() {

  const platformClient = require("purecloud-platform-client-v2");
  client.setEnvironment(platformClient.PureCloudRegionHosts.eu-west-1); // Genesys Cloud region

  const client = platformClient.ApiClient.instance;
  client.loginImplicitGrant(clientId, redirectUri, { state: state })
    .then((data) => {
      console.log(data);
      ListBases();
      KnowledgeExportJob();
    })
    .catch((err) => {
      // Handle failure response
      console.log("error authenticating through Implicit grant: "+ err);
    });
  
  function ListBases() {
    let apiInstance = new platformClient.KnowledgeApi();

    let opts = {};

    // Get knowledge bases
    apiInstance.getKnowledgeKnowledgebases(opts)
      .then((data) => {
        console.log(`getKnowledgeKnowledgebases success! data: ${JSON.stringify(data, null, 2)}`);
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
}
module.exports = {GetKnowledgeBase};
