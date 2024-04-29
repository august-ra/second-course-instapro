import { goToPage, logout, user } from "../index.js";
import { routes } from "../routes.js";

export function renderHeaderComponent({ element }) {
  element.innerHTML = `<div class="page-header">
      <h1 class="logo">instapro</h1>
      <button class="header-button add-or-login-button">
      ${
        user
          ? `<div title="Добавить пост" class="add-post-sign"></div>`
          : "Войти"
      }
      </button>
      ${
        user
          ? `<button title="${user.name}" class="header-button logout-button">Выйти</button>`
          : ""
      }  
    </div>`;

  element
    .querySelector(".add-or-login-button")
    .addEventListener("click", () => {
      if (user) {
        goToPage(routes.ADD_POSTS_PAGE);
      } else {
        goToPage(routes.AUTH_PAGE);
      }
    });

  element.querySelector(".logo").addEventListener("click", () => {
    goToPage(routes.POSTS_PAGE);
  });

  element.querySelector(".logout-button")?.addEventListener("click", logout);

  return element;
}
