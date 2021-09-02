import axios from '@/api/axios'

const getPassing = () => {
  return axios.get('/passing');
}

const getMyPassing = () => {
  return axios.get('/passing/my-passing');
}

const getTestbank = slug => {
  return axios.get(`/testbank/run/${slug}`)
}

const getCurrentResult = slug => {
  return axios.get(`/testbank/run/${slug}/current-result`)
}

const createPassing = credentials => {
  return axios.post('/passing', { data: credentials })
}

export default {
  getMyPassing,
  getTestbank,
  getPassing,
  getCurrentResult,
  createPassing
}
