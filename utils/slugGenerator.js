const slugify = require("slugify");

const generateSlug = async (collection, name, options = {}) => {
  const slugOptions = { lower: true, strict: true, ...options.slugifyOptions };

  let baseSlug = slugify(name, slugOptions);
  let slug = baseSlug;

  const result = await collection?.exists({ slug });

  try {
    if (result) {
      slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
    } else {
      slug = baseSlug;
    }

    console.log(slug)
  } catch (error) {
    console.log(error);
  }

  return slug;
};

module.exports = generateSlug;
