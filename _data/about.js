const client = require("../scripts/contentful").contentfulClient;

module.exports = async () => {
  const aboutEntries = await client.getEntries({
    content_type: "about",
  });
  return aboutEntries.items.at(0);
};
