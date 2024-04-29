import { uploadImage } from "../api.js"

export function renderUploadImageComponent({ element, onImageUrlChange }) {
  let imageUrl = ""

  const render = () => {
    element.innerHTML = `
      <div class="upload=image">
        ${
          imageUrl
            ? `
            <div class="file-upload-image-container">
              <img class="file-upload-image" src="${imageUrl}" alt="preview">
              <button class="file-upload-remove-button button">Заменить фото</button>
            </div>
            `
            : `
            <label class="file-upload-label secondary-button">
              <input type="file" class="file-upload-input" style="display:none">
              Выберите фото
            </label>
        `
        }
      </div>`

    const fileInputElement = element.querySelector(".file-upload-input")

    fileInputElement?.addEventListener("change", () => {
      const file = fileInputElement.files[0]

      if (!file)
        return

      const labelEl = document.querySelector(".file-upload-label")
      labelEl.setAttribute("disabled", true)
      labelEl.textContent = "Загружаю файл..."

      uploadImage(file).then((data) => {
        onImageUrlChange(data.fileUrl)
        render()
      })
    })

    element
      .querySelector(".file-upload-remove-button")
      ?.addEventListener("click", () => {
        onImageUrlChange("")
        render()
      })
  }

  render()
}
