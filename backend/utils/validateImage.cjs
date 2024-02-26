const imageExtensions = require("image-extensions");
const { validateBufferMIMEType } = require("validate-image-type");
module.exports.validateImage = async function (file) {
  const mimetype = file.mimetype;
  const allowMimeTypes = imageExtensions.map((mimetype) => `image/${mimetype}`);
  const { ok: isValid } = await validateBufferMIMEType(
    await file.arrayBuffer(),
    {
      allowMimeTypes,
    }
  );
  return isValid;
};
