import {} from "./prototypes.js"
import { routes } from "./routes.js"
import { knownUser } from "./knownUser.js"
import { API } from "./api.js"
import { renderAddPostPageComponent } from "./components/add-post-page-component.js"
import { renderAuthPageComponent } from "./components/auth-page-component.js"
import { renderPostsPageComponent } from "./components/posts-page-component.js"
import { renderLoadingPageComponent } from "./components/loading-page-component.js"

API.init()
knownUser.getUserFromLocalStorage()
export let page = null
export let posts = []

export const logout = () => {
  knownUser.logoutUser()
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

    return API.getPosts()
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
    page = routes.LOADING_PAGE
    renderApp()

    return API.getUserPosts(data.userId)
      .then((newPosts) => {
        page = routes.USER_POSTS_PAGE
        posts = newPosts
        renderApp()
      })
      .catch((error) => {
        console.error(error)
        goToPage(routes.USER_POSTS_PAGE)
      })
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
      knownUser.loginUser(newUser.name, newUser.login, newUser.token)

      goToPage(routes.POSTS_PAGE)
    }

    return renderAuthPageComponent(appEl, setUser)
  }

  if (page === routes.ADD_POSTS_PAGE) {
    const onAddPostClick = (description, imageUrl, setError) => {
      API.uploadPost(description, imageUrl)
        .then((data) => {
          if (data.result === "ok")
            goToPage(routes.POSTS_PAGE)
          else
            setError(data.error)
        })
        .catch((error) => {
          setError(error.message)
        })
    }

    return renderAddPostPageComponent(appEl, onAddPostClick)
  }

  if (page === routes.POSTS_PAGE) {
    return renderPostsPageComponent(appEl)
  }

  if (page === routes.USER_POSTS_PAGE) {
    return renderPostsPageComponent(appEl)
  }
}

goToPage(routes.POSTS_PAGE)
