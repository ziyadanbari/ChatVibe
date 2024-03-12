export function apiErrorHandler(c, error) {
  const [status, message] =
    error instanceof Array ? error : [500, "Internal server error"];
  !(error instanceof Array) && console.error(error);
  return c.json({ message }, status);
}
