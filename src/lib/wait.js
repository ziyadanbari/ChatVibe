export function wait(delay) {
  return new Promise((res) => setTimeout(res, delay));
}
