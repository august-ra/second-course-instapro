import { routes } from "../routes.js"
import { renderHeaderComponent } from "./header-component.js"
import { renderLikeButtonComponent } from "./like-button-component.js"
import { renderDeleteButtonComponent } from "./delete-link-component.js"
import { posts, goToPage } from "../index.js"

import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"


export function renderPostsPageComponent(appEl) {
  appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>

      <ul class="posts">
      ${posts.map((post) => {
        return `
        <li class="post" data-post-id="${post.id}">
          <div class="post-header" data-user-id="${post.user.id}">
            <img class="post-header__user-image" src="${post.user.imageUrl}" alt="avatar">
            <p class="post-header__user-name">${post.user.name.formatText()}</p>
          </div>

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
            ${formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })}
          </p>
        </li>`
      }).join("")}
      </ul>
    </div>`

  renderHeaderComponent()

  document.querySelectorAll(".post-header").forEach((element) => {
    element.addEventListener("click", () => {
      goToPage(routes.USER_POSTS_PAGE, {
        userId: element.dataset.userId,
      })
    })
  })

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
