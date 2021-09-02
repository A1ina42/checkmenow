import Vue from 'vue'
import Vuex from 'vuex'

import auth from '@/store/modules/auth'
import category from '@/store/modules/category'
import createCategory from '@/store/modules/createCategory'
import updateCategory from '@/store/modules/updateCategory'
import group from '@/store/modules/group'
import createGroup from '@/store/modules/createGroup'
import updateGroup from '@/store/modules/updateGroup'
import createQuestion from '@/store/modules/createQuestion'
import updateQuestion from '@/store/modules/updateQuestion'
import createTestbank from '@/store/modules/createTestbank'
import updateTestbank from '@/store/modules/updateTestbank'
import question from '@/store/modules/question'
import testbank from '@/store/modules/testbank'
import passing from '@/store/modules/passing'
import statistics from '@/store/modules/statistics'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    category,
    createCategory,
    group,
    createGroup,
    updateGroup,
    createQuestion,
    createTestbank,
    updateCategory,
    updateQuestion,
    updateTestbank,
    question,
    testbank,
    passing,
    statistics
  }
})
