
export const knownUser = {
  name:  "",
  login: "",
  token: "",

  getUserFromLocalStorage() {
    try {
      const data = JSON.parse(window.localStorage.getItem("user"))
      this.name  = data.name
      this.login = data.login
      this.token = data.token
    } catch (error) {
      this.name  = ""
      this.login = ""
      this.token = ""
    }
  },

  saveUserToLocalStorage() {
    window.localStorage.setItem("user", JSON.stringify({
      name:  this.name,
      login: this.login,
      token: this.token,
    }))
  },

  removeUserFromLocalStorage() {
    window.localStorage.removeItem("user")
  },

  getToken() {
    return knownUser.token ? `Bearer ${knownUser.token}` : undefined
  },

  loginUser(name, login, token) {
    this.name  = name
    this.login = login
    this.token = token

    this.saveUserToLocalStorage()
  },

  logoutUser() {
    this.name  = ""
    this.login = ""
    this.token = ""

    this.removeUserFromLocalStorage()
  },
}
