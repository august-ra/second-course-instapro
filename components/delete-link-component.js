import { knownUser } from "../knownUser.js"
import { API } from "../api.js"


export function renderDeleteButtonComponent(element, post) {
  const render = () => {
    element.innerHTML = `<a href="#" class="post-delete" data-post-id="${post.id}">Удалить</a>`

    element.querySelector(".post-delete")?.addEventListener("click", () => {
      if (!knownUser.name)
        return

      element.innerHTML = `<div class="loader-small"><div></div><div></div><div></div></div>`

      // Удаление поста с простой анимацией
      API.deletePost(element.dataset.postId)
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
          } else
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
          render()
          alert(error.message)
        })
    })
  }

  render()
}
