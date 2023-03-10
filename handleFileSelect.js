function handleFileSelect(input) {

        if (!input || !input.files || input.files.length === 0) {
          return;
        }
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function () {
          const json = JSON.parse(reader.result);
          const documents = json.documents;
          const jsonl = documents.map((document) => {
            const title = document.published.title;
            const text = extractText(document.published.variations);
            return { prompt: title, completion: text };
          });
          const jsonlString = jsonl.map((line) => JSON.stringify(line)).join("\n");
          const preview = document.getElementById("jsonl-preview");
          preview.value = jsonlString.split("\n").slice(0, 50).join("\n");
        };
        const formattedJSON = reader.readAsText(file);
        console.log ("El json generado tras handleFileSelect es: " +formattedJSON);
}
