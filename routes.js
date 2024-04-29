
// Список страниц приложения
export const routes = {
  POSTS_PAGE:      "posts",
  USER_POSTS_PAGE: "user-posts",
  AUTH_PAGE:       "auth",
  ADD_POSTS_PAGE:  "add-post",
  LOADING_PAGE:    "loading",

  includes(page) {
    const pages = [
      this.POSTS_PAGE,
      this.AUTH_PAGE,
      this.ADD_POSTS_PAGE,
      this.USER_POSTS_PAGE,
      this.LOADING_PAGE
    ]

    return pages.includes(page)
  },
}
