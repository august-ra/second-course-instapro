import { getPosts } from "./api.js"
import { renderAddPostPageComponent } from "./components/add-post-page-component.js"
import { renderAuthPageComponent } from "./components/auth-page-component.js"
import { routes } from "./routes.js"
import { renderPostsPageComponent } from "./components/posts-page-component.js"
import { renderLoadingPageComponent } from "./components/loading-page-component.js"
import { knownUser } from "./knownUser.js"

knownUser.getUserFromLocalStorage()
export let page = null
export let posts = []

export const logout = () => {
  knownUser.logout()
  goToPage(routes.POSTS_PAGE)
}

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if (!routes.includes(newPage))
    throw new Error("страницы не существует")

  if (newPage === routes.ADD_POSTS_PAGE) {
    // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
    page = knownUser.name ? routes.ADD_POSTS_PAGE : routes.AUTH_PAGE
    return renderApp()
  }

  if (newPage === routes.POSTS_PAGE) {
    page = routes.LOADING_PAGE
    renderApp()

    return getPosts()
      .then((newPosts) => {
        page = routes.POSTS_PAGE
        posts = newPosts
        renderApp()
      })
      .catch((error) => {
        console.error(error)
        goToPage(routes.POSTS_PAGE)
      })
  }

  if (newPage === routes.USER_POSTS_PAGE) {
    // TODO: реализовать получение постов юзера из API
    console.log("Открываю страницу пользователя: ", data.userId)
    page = routes.USER_POSTS_PAGE
    posts = []
    return renderApp()
  }

  page = newPage
  renderApp()
}

const renderApp = () => {
  const appEl = document.getElementById("app")

  if (page === routes.LOADING_PAGE) {
    return renderLoadingPageComponent(appEl)
  }

  if (page === routes.AUTH_PAGE) {
    const setUser = (newUser) => {
      knownUser.login(newUser.name, newUser.token)

      goToPage(routes.POSTS_PAGE)
    }

    return renderAuthPageComponent(appEl, setUser)
  }

  if (page === routes.ADD_POSTS_PAGE) {
    const onAddPostClick = (description, imageUrl) => {
      // TODO: реализовать добавление поста в API
      console.log("Добавляю пост...", { description, imageUrl })
      goToPage(routes.POSTS_PAGE)
    }

    return renderAddPostPageComponent(appEl, onAddPostClick)
  }

  if (page === routes.POSTS_PAGE) {
    return renderPostsPageComponent(appEl)
  }

  if (page === routes.USER_POSTS_PAGE) {
    // TODO: реализовать страницу фотографию пользвателя
    appEl.innerHTML = "Здесь будет страница фотографий пользователя"
    return
  }
}

goToPage(routes.POSTS_PAGE)
