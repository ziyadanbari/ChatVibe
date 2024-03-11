export function imageToBlob(file) {
  if (!file) return;
  return URL.createObjectURL(file);
}
