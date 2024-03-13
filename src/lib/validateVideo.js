export function validateVideo(file) {
  const mimetype = file.type;
  const type = mimetype.split("/")[0];
  return type === "video";
}
