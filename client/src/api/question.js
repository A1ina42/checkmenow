import axios from '@/api/axios'

const getQuestion = () => {
  return axios.get('/question')
}

const getQuest = slug => {
  return axios.get(`/question/${slug}`).then(response => response.data.question)
}

const createQuestion = credentials => {
  return axios.post('/question', { question: credentials })
}

const updateQuestion = (slug, questionInput) => {
  return axios.put(`/question/${slug}`, { question: questionInput });
}

const deleteQuestion = slug => {
  return axios.delete(`/question/${slug}`)
}

export default {
  getQuest,
  getQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion
}
