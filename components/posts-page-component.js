import { routes } from "../routes.js"
import { API } from "../api.js"
import { renderHeaderComponent } from "./header-component.js"
import { posts, goToPage } from "../index.js"

import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"


export function renderPostsPageComponent(appEl) {
  // Функция выводит часть вёрстки на случай обновления страницы как целиком, так и частично
  const printLikesLine = (post) => {
    const likeImg = post.isLiked ? "like-active" : "like-not-active"
    const likeParts = []

    let likesCount = post.likes.length

    if (likesCount === 0)
      likeParts.push("<i>никто не отметил фотографию, Вы можете быть первым</i>")
    else {
      if (post.isLiked) {
        --likesCount

        likeParts.push("<strong>Вам</strong>")

        if (likesCount)
          likeParts.push(" и ещё ")
      }

      if (likesCount) {
        likeParts.push("<strong>")
        likeParts.push(`${likesCount} ${likesCount.withUnitsInGrammaticalCase("пользователей", "пользователю", "пользователям")}`)
        likeParts.push("</strong>")
      }
    }

    return `
      <button data-post-id="${post.id}" data-post-like="${Number(post.isLiked)}" class="like-button">
        <img src="../assets/images/${likeImg}.svg" alt="heart"/>
      </button>
      <p class="post-likes-text">
        Нравится: ${likeParts.join("")}
      </p>`
  }

  appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>

      <ul class="posts">
      ${posts.map((post) => {
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
            ${printLikesLine(post)}
          </div>

          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description.multiline()}
          </p>

          <p class="post-date">
            ${formatDistanceToNow(new Date(post.createdAt), {addSuffix: true, locale: ru})}
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

  document.querySelectorAll(".like-button").forEach((element) => {
    const listener = (event) => {
      const element = event.currentTarget

      API.toggleLike(element.dataset.postId, element.dataset.postLike !== "1")
        .then((post) => {
          const parent = element.parentElement
          parent.innerHTML = printLikesLine(post)

          parent.querySelector(".like-button")?.addEventListener("click", listener)
        })
    }

    element.addEventListener("click", listener)
  })
}
