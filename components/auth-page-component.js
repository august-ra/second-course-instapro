import { API } from "../api.js"
import { renderHeaderComponent } from "./header-component.js"
import { renderUploadImageComponent } from "./upload-image-component.js"

export function renderAuthPageComponent(appEl, setUser) {
  let isLoginMode = true
  let imageUrl = ""

  const renderForm = () => {
    appEl.innerHTML = `<div class="page-container">
      <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">
            ${
              isLoginMode
                ? "Вход в&nbsp;Instapro"
                : "Регистрация в&nbsp;Instapro"
            }
          </h3>

          <div class="form-inputs">
            ${
              isLoginMode
                ? ""
                : `
                <div class="upload-image-container"></div>
                <input type="text" id="name-input" class="input" placeholder="Имя">
                `
            }

            <input type="text" id="login-input" class="input" placeholder="Логин">
            <input type="password" id="password-input" class="input" placeholder="Пароль">

            <div class="form-error"></div>

            <button class="button" id="login-button">${
              isLoginMode ? "Войти" : "Зарегистрироваться"
            }</button>
          </div>

          <div class="form-footer">
            <p class="form-footer-title">
              ${isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}
              <button class="link-button" id="toggle-button">
                ${isLoginMode ? "Зарегистрироваться." : "Войти."}
              </button>
            </p>
          </div>
        </div>
      </div>`

    // Не вызываем обновление, чтобы не сбрасывалась заполненная форма
    // Точечно обновляем часть DOM-дерева
    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message
    }

    renderHeaderComponent(false, false)

    const uploadImageContainer = appEl.querySelector(".upload-image-container")

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl
        },
      })
    }

    document.getElementById("login-button").addEventListener("click", () => {
      setError("")

      if (isLoginMode) {
        const login = document.getElementById("login-input").value
        const password = document.getElementById("password-input").value

        if (!login)
          return alert("Введите логин")

        if (!password)
          return alert("Введите пароль")

        API.loginUser(login, password)
          .then((data) => {
            setUser(data.user)
          })
          .catch((error) => {
            console.warn(error)
            setError(error.message)
          })
      } else {
        const login    = document.getElementById("login-input").value
        const name     = document.getElementById("name-input").value
        const password = document.getElementById("password-input").value

        if (!name)
          return alert("Введите имя")

        if (!login)
          return alert("Введите логин")

        if (!password)
          return alert("Введите пароль")

        if (!imageUrl)
          return alert("Не выбрана фотография")

        API.registerUser(login, password, name, imageUrl)
          .then((data) => {
            setUser(data.user)
          })
          .catch((error) => {
            console.warn(error)
            setError(error.message)
          })
      }
    })

    document.getElementById("toggle-button").addEventListener("click", () => {
      isLoginMode = !isLoginMode
      renderForm()
    })
  }

  renderForm()
}
