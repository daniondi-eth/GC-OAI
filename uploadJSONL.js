function uploadJSONL(jsonl,API_KEY) {
        const endpoint = "https://api.openai.com/v1/files";
        const purpose = "fine-tune";
        const file = new Blob([jsonl], { type: "text/plain" });
        const formData = new FormData();
        formData.append("purpose", purpose);
        formData.append("file", file);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", endpoint);
        xhr.setRequestHeader("Authorization", "Bearer " + API_KEY);
        xhr.onload = function () {
          const result = JSON.parse(xhr.responseText);
          const resultTextarea = document.getElementById("upload-result");
          resultTextarea.value = JSON.stringify(result, null, 2);
        };
        xhr.send(formData);
}

