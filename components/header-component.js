import { goToPage, logout } from "../index.js"
import { routes } from "../routes.js"
import { knownUser } from "../knownUser.js";

export function renderHeaderComponent() {
  const element = document.querySelector(".header-container")
  element.innerHTML = `<div class="page-header">
      <h1 class="logo">instapro</h1>
      ${
        knownUser.name
          ? `<button class="header-button add-post-button">
            <div title="Добавить пост" class="add-post-sign"></div>
          </button>`
          : ""
      }
      <button title="${knownUser.name}" class="header-button login-logout-button">
      ${
        knownUser.name
          ? `Выйти`
          : `Войти`
      }
      </button>
    </div>`

  element.querySelector(".add-post-button")?.addEventListener("click", () => {
      goToPage(routes.ADD_POSTS_PAGE)
    })

  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(routes.POSTS_PAGE)
  })

  element.querySelector(".login-logout-button").addEventListener("click", () => {
    if (knownUser.name)
      logout()
    else
      goToPage(routes.AUTH_PAGE)
  })

  return element
}
