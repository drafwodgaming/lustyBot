function embedSetup(
  color,
  title,
  url,
  author,
  description,
  thumbnail,
  fields,
  image,
  timestamp,
  footer
) {
  return {
    color: color,
    title: title,
    url: url,
    author: author,
    description: description,
    thumbnail: thumbnail,
    fields: fields,
    image: image,
    timestamp: timestamp,
    footer: footer,
  };
}
module.exports = { embedSetup };
