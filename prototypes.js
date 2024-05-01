
String.prototype.sterilize = function () {
  return this
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("/", "&sol;")
}

String.prototype.multiline = function () {
  const lines = this.split("\n")
  return lines.join("<br>")
}
