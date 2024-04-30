import { routes } from "../routes.js"
import { renderHeaderComponent } from "./header-component.js"
import { posts, goToPage } from "../index.js"

import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";


export function renderPostsPageComponent(appEl) {
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>

      <ul class="posts">
      ${posts.map((post) => {
        const likeImg = post.isLiked ? "like-active" : "like-not-active"
        console.log(post.description)
        
        return `
        <li class="post">
          <div class="post-header" data-user-id="${post.user.id}">
            <img class="post-header__user-image" src="${post.user.imageUrl}" alt="avatar">
            <p class="post-header__user-name">${post.user.name}</p>
          </div>

          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}" alt="example">
          </div>

          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
              <img src="../assets/images/${likeImg}.svg" alt="heart"/>
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${post.likes.length}</strong>
            </p>
          </div>

          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description}
          </p>

          <p class="post-date">
            ${formatDistanceToNow(new Date(post.createdAt), {addSuffix: true, locale: ru})}
          </p>
        </li>`
      }).join("")}
      </ul>
    </div>`

  appEl.innerHTML = appHtml

  renderHeaderComponent()

  for (let element of document.querySelectorAll(".post-header")) {
    element.addEventListener("click", () => {
      goToPage(routes.USER_POSTS_PAGE, {
        userId: element.dataset.userId,
      })
    })
  }
}
