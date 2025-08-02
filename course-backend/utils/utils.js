exports.isNumeric = (value) => {
  return /^-?\d+$/.test(value);
};

exports.titleToSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${baseSlug}-${Date.now()}`;
};
