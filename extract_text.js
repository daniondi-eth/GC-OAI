function extract_text(variations) {
        const text = variations
          .filter((variation) => variation.body && variation.body.blocks)
          .map((variation) =>
            variation.body.blocks
              .filter((block) => block.paragraph && block.paragraph.blocks)
              .map((block) =>
                block.paragraph.blocks
                  .filter((b) => b.text && b.text.text)
                  .map((b) => b.text.text)
                  .join(" ")
              )
              .join(" ")
          )
          .join(" ");
        return text;
}
module.exports = { extract_text, handleFileSelect, uploadJSONL, listFineTunes, fineTune };

