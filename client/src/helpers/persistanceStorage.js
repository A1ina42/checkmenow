export const getItem = key => {
  try {
    return localStorage.getItem(key)
  } catch (e) {
    console.error('Ошибка в получении данных из localStorage', e)
    return null
  }
}

export const setItem = (key, data) => {
  try {
    localStorage.setItem(key, data)
  } catch (e) {
    console.error('Ошибка в установке данных в localStorage', e)
  }
}
