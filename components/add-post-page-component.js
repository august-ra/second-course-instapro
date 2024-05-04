import { renderHeaderComponent } from "./header-component.js"
import { renderUploadImageComponent } from "./upload-image-component.js"


export function renderAddPostPageComponent(appEl, onAddPostClick) {
  let imageUrl = ""

  const renderForm = () => {
    appEl.innerHTML = `<div class="page-container">
      <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавление поста</h3>

          <div class="form-inputs">
            <div class="upload-image-container"></div>

            <textarea id="description" class="input textarea" placeholder="Текст сообщения" rows="4"></textarea>

            <div class="form-error"></div>

            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>`

    // Не вызываем обновление, чтобы не сбрасывалась заполненная форма
    // Точечно обновляем часть DOM-дерева
    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message
    }

    renderHeaderComponent(false)

    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl
      },
    })

    document.getElementById("add-button").addEventListener("click", () => {
      setError("")

      if (!imageUrl)
        return alert("Не выбрана фотография")

      const description = document.getElementById("description").value.sterilize()

      if (!description)
        return alert("Введите текст сообщения")

      onAddPostClick(description, imageUrl, setError)
    })
  }

  renderForm()
}
