import { knownUser } from "./knownUser.js"

export const API = {
  personalKey: "",
  baseHost:    "https://webdev-hw-api.vercel.app",
  postsHost:   "",

  init() {
    // this.personalKey = "prod"       // "боевая" версия
    this.personalKey = "@august-ra" // персональная версия
    this.postsHost   = `${this.baseHost}/api/v1/${this.personalKey}/instapro`
  },

  getPosts(url = "") {
    if (!url)
      url = this.postsHost

    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: knownUser.getToken(),
      },
    })
      .then((response) => {
        if (response.status === 401)
          throw new Error("Нет авторизации")

        return response.json()
      })
      .then((data) => data.posts)
  },

  getUserPosts(userId) {
    return this.getPosts(`${this.postsHost}/user-posts/${userId}`)
  },

  // https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
  registerUser(login, password, name, imageUrl) {
    return fetch(this.baseHost + "/api/user", {
      method: "POST",
      body: JSON.stringify({
        login,
        password,
        name,
        imageUrl,
      }),
    }).then((response) => {
      if (response.status === 400)
        throw new Error("Такой пользователь уже существует")

      return response.json()
    })
  },

  loginUser(login, password) {
    return fetch(this.baseHost + "/api/user/login", {
      method: "POST",
      body: JSON.stringify({
        login,
        password,
      }),
    })
      .then((response) => {
        if (response.status === 400)
          throw new Error("Неверный логин или пароль")

        return response.json()
      })
  },

  // Загружает картинку в облако, возвращает url загруженной картинки
  uploadImage(file) {
    const data = new FormData()
    data.append("file", file)

    return fetch(this.baseHost + "/api/upload/image", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
  },

  // Отправляет пост на сервер, в ответ приходит result="ok" либо текст ошибки
  uploadPost(description, imageUrl) {
    return fetch(this.postsHost, {
      method: "POST",
      headers: {
        Authorization: knownUser.getToken(),
      },
      body: JSON.stringify({
        description: description,
        imageUrl:    imageUrl,
      }),
    })
      .then((response) => {
        if (response.status === 401)
          throw new Error("Нет авторизации")
        else
          return response.json()
      })
  },

  // Удаляем пост на сервере, в ответ приходит result="ok" либо текст ошибки
  deletePost(postId) {
    const url = `${this.postsHost}/${postId}`

    return fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: knownUser.getToken(),
      },
    })
      .then((response) => {
        if (response.status === 401)
          throw new Error("Нет авторизации")
        else
          return response.json()
      })
  },

  // Изменяет отметку "Нравится" на сервере, в ответ приходит обновление текущего поста
  toggleLike(postId, liked) {
    const url = `${this.postsHost}/${postId}/${liked ? "like" : "dislike"}`

    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: knownUser.getToken(),
      },
    })
      .then((response) => {
        if (response.status === 401)
          throw new Error("Нет авторизации")
        else
          return response.json()
      })
      .then((data) => data.post)
  },
}
