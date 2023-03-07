function listFineTunes() {
  const API_KEY = document.getElementById("API_KEY").value;
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.openai.com/v1/fine-tunes");
  xhr.setRequestHeader("Authorization", "Bearer " + API_KEY);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const fineTunes = JSON.parse(xhr.responseText).data;
      const tableBody = document.querySelector("#fine-tunes-table tbody");
      tableBody.innerHTML = "";
      fineTunes.forEach((fineTune) => {
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        idCell.innerText = fineTune.id;
        const fineTunedModelCell = document.createElement("td");
        fineTunedModelCell.innerText = fineTune.fine_tuned_model;
        const statusCell = document.createElement("td");
        statusCell.innerText = fineTune.status;
        const fineTuneIdCell = document.createElement("td");
        fineTuneIdCell.innerText = fineTune.id;
        row.appendChild(idCell);
        row.appendChild(fineTunedModelCell);
        row.appendChild(statusCell);
        tableBody.appendChild(row);
        if (fineTune.model) {
          fineTune.model = fineTune.model.model_id;
        }
      });
    }
  };
  xhr.send();
}

module.exports = { listFineTunes };
