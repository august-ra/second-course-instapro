import { knownUser } from "../knownUser.js"
import { API } from "../api.js"


export function renderLikeButtonComponent(element, post) {
  const render = (post) => {
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

    element.innerHTML = `
      <button data-post-id="${post.id}" data-post-like="${Number(post.isLiked)}" class="like-button">
        <img src="./assets/images/${likeImg}.svg" alt="heart"/>
      </button>
      <p class="post-likes-text">
        Нравится: ${likeParts.join("")}
      </p>`

    const likeButton = element.querySelector(".like-button")

    likeButton?.addEventListener("click", () => {
      if (!knownUser.name)
        return

      API.toggleLike(likeButton.dataset.postId, likeButton.dataset.postLike !== "1")
        .then((post) => {
          render(post)
        })
    })
  }

  render(post)
}
