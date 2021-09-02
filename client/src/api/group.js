import axios from '@/api/axios'

const getGroup = () => {
  return axios.get('/group');
}

const getMyGroups = () => {
  return axios.get('/group/my-groups');
}

const acceptInvite = (slug) => {
  return axios.get(`/group/my-groups/${slug}`);
}

const rejectInvite = (slug) => {
  return axios.delete(`/group/my-groups/${slug}`);
}

const createGroup = credentials => {
  return axios.post('/group', { group: credentials });
}

const updateGroup = (credentials) => {
  return axios.put('/group', { group: credentials });
}

const addUser = (slug, users) => {
  return axios.post(`/group/user/add/${slug}`, { users });
}

const getTestbank = (slug) => {
  return axios.get(`/group/testbank/${slug}`);
}

const addTestbank = (slug, testbanks) => {
  return axios.post(`/group/testbank/add/${slug}`, { testbanks });
}

const deleteUserGroup = (groupId, userId) => {
  return axios.delete(`/group/${groupId}/user/${userId}`);
}

const deleteTestbankGroup = (groupId, testbankId) => {
  return axios.delete(`/group/${groupId}/testbank/${testbankId}`);
}

const deleteGroup = slug => {
  return axios.delete(`/group/${slug}`)
}

export default {
  acceptInvite,
  rejectInvite,
  getMyGroups,
  getTestbank,
  getGroup,
  addUser,
  addTestbank,
  createGroup,
  updateGroup,
  deleteGroup,
  deleteUserGroup,
  deleteTestbankGroup,
}
