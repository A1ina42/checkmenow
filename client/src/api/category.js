import axios from '@/api/axios'

const getCategory = () => {
  return axios.get('/category')
}

const createCategory = credentials => {
  return axios.post('/category', { category: credentials })
}

const updateCategory = (credentials) => {
  return axios.put('/category', { category: credentials });
}

const deleteCategory = slug => {
  return axios.delete(`/category/${slug}`)
}

export default {
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
}
