
export const knownUser = {
  getUserFromLocalStorage(user) {
    try {
      return JSON.parse(window.localStorage.getItem("user"));
    } catch (error) {
      return null;
    }
  },

  saveUserToLocalStorage(user) {
    window.localStorage.setItem("user", JSON.stringify(user));
  },

  removeUserFromLocalStorage(user) {
    window.localStorage.removeItem("user");
  },
}
