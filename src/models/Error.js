export default class Error {
  constructor (message, icon, title) {
    this.message = message
    this.icon = icon
    this.title = title ?? "There was an error"
  }
}
