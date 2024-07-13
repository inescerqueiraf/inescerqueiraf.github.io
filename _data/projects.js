const client = require("../scripts/contentful").contentfulClient;

module.exports = async () => {
  const projects = await client.getEntries({
    content_type: "project",
  });
  return projects.items;
};
