import { routes } from "../routes.js"
import { knownUser } from "../knownUser.js"
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

  const printDeleteLink = (postId) => {
    return `<a href="#" class="post-delete" data-post-id="${postId}">Удалить</a>`
  }

  const printDeleteLoader = () => {
    return `<div class="loader-small"><div></div><div></div><div></div></div>`
  }

  appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>

      <ul class="posts">
      ${posts.map((post) => {
        return `
        <li class="post" data-post-id="${post.id}">
          <div class="post-header" data-user-id="${post.user.id}">
            <img class="post-header__user-image" src="${post.user.imageUrl}" alt="avatar">
            <p class="post-header__user-name">${post.user.name}</p>
          </div>

          <div class="post-image-container" data-post-id="${post.id}">
            <img class="post-image" src="${post.imageUrl}" alt="example">
          </div>

          <div class="post-commands">
            <div class="post-likes">
              ${printLikesLine(post)}
            </div>

            <div class="right-side">
              ${printDeleteLink(post.id)}
            </div>
          </div>

          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description.formatText()}
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
      if (!knownUser.name)
        return

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

  // Удаление поста с простой анимацией
  document.querySelectorAll(".post-delete").forEach((element) => {
    element.addEventListener("click", () => {
      if (!knownUser.name)
        return

      const parent = element.parentElement
      parent.innerHTML = printDeleteLoader()

      API.deletePost(element.dataset.postId)
        // .then
        .then((data) => {
          let error

          if (data.result === "ok" || data.error === (error = "Удалять посты с prod нельзя")) {
            if (error) {
              console.log(error)
              console.log("Удаление поста на сервере не произошло, но для тестов показано, как будет выглядеть реальное удаление")
            }

            const selectorSpec = `data-post-id="${element.dataset.postId}"`
            const listItem = document.querySelector(`li.post[${selectorSpec}]`)

            document.querySelector(`div.post-image-container[${selectorSpec}]`).style.height = "0px"

            return new Promise((resolve) => {
              setTimeout(() => {
                resolve(listItem)
              }, 500)
            })
          }
          else
            throw new Error(data.error)
        })
        .then((listItem) => {
        //   const listItem = document.querySelector(`li.post[${selectorSpec}]`)
          listItem.innerHTML = `<div class="post-deleted">..!ПОСТ УДАЛЁН!..</div>`
          listItem.style.height = "130px";

          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(listItem)
            }, 3300)
          })
        })
        .then((listItem) => {
          listItem.style.height = "0";

          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(listItem)
            }, 250)
          })
        })
        .then((listItem) => {
          listItem.remove()
        })
        .catch((error) => {
          parent.innerHTML = printDeleteLink(element.dataset.postId)
          alert(error.message)
        })
    })
  })
}
