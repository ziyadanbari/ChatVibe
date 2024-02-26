export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.error = message;
  }
  showError() {
    console.log(this.message);
  }
}
