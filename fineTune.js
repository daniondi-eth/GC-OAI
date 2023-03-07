function fineTune() {
  const API_KEY = document.getElementById("API_KEY").value;
  const fileId = document.getElementById("training-file").value;
  const model = document.getElementById("model").value;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://api.openai.com/v1/fine-tunes");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer " + API_KEY);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const result = JSON.parse(xhr.responseText);
      const resultTextarea = document.getElementById("fine-tune-result");
      resultTextarea.value = JSON.stringify(result, null, 2);
    }
  };
  console.log("fileId: " + fileId);
  const data = JSON.stringify({ model: model, training_file: fileId });
  xhr.send(data);
}

module.exports = { fineTune };
