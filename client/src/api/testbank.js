import axios from '@/api/axios'

const getTestbank = () => {
  return axios.get('/testbank')
}

const getTest = slug => {
  return axios.get(`/testbank/${slug}`).then(response => response.data.testbank)
}

const createTestbank = credentials => {
  return axios.post('/testbank', { testbank: credentials })
}

const updateTestbank = (slug, testbankInput) => {
  return axios.put(`/testbank/${slug}`, { testbank: testbankInput });
}

const deleteTestbank = slug => {
  return axios.delete(`/testbank/${slug}`)
}

export default {
  getTest,
  getTestbank,
  createTestbank,
  updateTestbank,
  deleteTestbank
}
