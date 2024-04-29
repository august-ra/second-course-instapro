
export const knownUser = {
  name:  "",
  token: "",

  getUserFromLocalStorage() {
    try {
      const data = JSON.parse(window.localStorage.getItem("user"))
      this.name  = data.name
      this.token = data.token
    } catch (error) {
      this.name  = ""
      this.token = ""
    }
  },

  saveUserToLocalStorage() {
    window.localStorage.setItem("user", JSON.stringify({
      name: this.name, token: this.token
    }))
  },

  removeUserFromLocalStorage() {
    window.localStorage.removeItem("user")
  },

  getToken() {
    return knownUser.token ? `Bearer ${knownUser.token}` : undefined
  },

  login(name, token) {
    this.name  = name
    this.token = token

    this.saveUserToLocalStorage()
  },

  logout() {
    this.name  = ""
    this.token = ""

    this.removeUserFromLocalStorage()
  },
}
