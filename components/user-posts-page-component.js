import { knownUser } from "../knownUser.js"
import { renderHeaderComponent } from "./header-component.js"
import { renderLikeButtonComponent } from "./like-button-component.js"
import { renderDeleteButtonComponent } from "./delete-link-component.js"
import { posts } from "../index.js"


export function renderUserPostsPageComponent(appEl) {
  const printUserHeader = () => {
    const post = posts[0]

    return `<div class="post-header post-header-center" data-user-id="${post.user.id}">
        ${
          post.user.login === knownUser.login
            ? "Ваши публикации"
            : `<img class="post-header__user-image" src="${post.user.imageUrl}" alt="avatar">
              <p class="post-header__user-name">${post.user.name.formatText()}</p>
              <p>(все публикации пользователя)</p>`
        }
      </div>`
  }
  appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>

      ${printUserHeader()}

      <ul class="posts">
      ${posts.map((post) => {
        return `
        <li class="post" data-post-id="${post.id}">
          <div class="post-image-container" data-post-id="${post.id}">
            <img class="post-image" src="${post.imageUrl}" alt="example">
          </div>

          <div class="post-commands">
            <div class="post-likes" data-post-id="${post.id}"></div>
            <div class="post-deletion" data-post-id="${post.id}"></div>
          </div>

          <p class="post-text">
            <span class="user-name">${post.user.name.formatText()}</span>
            ${String(post.description).formatText()}
          </p>

          <p class="post-date">
            Вчера вечером
          </p>
        </li>`
      }).join("")}
      </ul>
    </div>`

  renderHeaderComponent()

  document.querySelectorAll(".post-likes").forEach((element) => {
    const filteredPosts = posts.filter((post) => post.id === element.dataset.postId)

    if (filteredPosts)
      renderLikeButtonComponent(element, filteredPosts[0])
  })

  document.querySelectorAll(".post-deletion").forEach((element) => {
    const filteredPosts = posts.filter((post) => post.id === element.dataset.postId)

    if (filteredPosts)
      renderDeleteButtonComponent(element, filteredPosts[0])
  })
}
