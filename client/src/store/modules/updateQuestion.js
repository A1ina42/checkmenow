import questionApi from '@/api/question'

const state = {
  isSubmitting: false,
  validationErrors: null,
  isLoading: false,
  question: null,
  isHideSidebar: true
}

export const mutationTypes = {
  updateQuestionStart: '[editQuestion] Update question start',
  updateQuestionSuccess: '[editQuestion] Update question success',
  updateQuestionFailure: '[editQuestion] Update question failure',

  getQuestionStart: '[editQuestion] Get question start',
  getQuestionSuccess: '[editQuestion] Get question success',
  getQuestionFailure: '[editQuestion] Get question failure',

  resetIsHideSidebar: '[editQuestion] Reset reset hide sidebar',
}

export const actionTypes = {
  updateQuestion: '[editQuestion] Create question',
  getQuestion: '[editQuestion] Get question',
  resetSidebar: '[editQuestion] reset hide sidebar',
}

const mutations = {
  [mutationTypes.updateQuestionStart](state) {
    state.isSubmitting = true;
  },
  [mutationTypes.updateQuestionSuccess](state) {
    state.isSubmitting = false;
  },
  [mutationTypes.updateQuestionFailure](state, payload) {
    state.isSubmitting = false;
    state.validationErrors = payload;
  },
  [mutationTypes.getQuestionStart](state) {
    state.question = null;
    state.isLoading = true;
  },
  [mutationTypes.getQuestionSuccess](state, payload) {
    state.isLoading = false;
    state.question = payload;
    state.isHideSidebar = false;
  },
  [mutationTypes.getQuestionFailure](state) {
    state.isLoading = false;
  },
  [mutationTypes.resetIsHideSidebar](state) {
    state.isHideSidebar = true;
  },

}

const actions = {
  [actionTypes.updateQuestion](context, { slug, questionInput }) {
    return new Promise(resolve => {
      context.commit(mutationTypes.updateQuestionStart)
      questionApi
        .updateQuestion(slug, questionInput)
        .then(question => {
          context.commit(mutationTypes.updateQuestionSuccess, question)
          resolve(question)
        })
        .catch(result => {
          context.commit(
            mutationTypes.updateQuestionFailure,
            result.response.data.errors
          )
        })
    })
  },
  [actionTypes.getQuestion](context, { slug }) {
    return new Promise(resolve => {
      context.commit(mutationTypes.getQuestionStart)
      questionApi
        .getQuest(slug)
        .then(question => {
          context.commit(mutationTypes.getQuestionSuccess, question)
          resolve(question)
        })
        .catch(() => {
          context.commit(mutationTypes.getQuestionFailure)
        })
    })
  },
  [actionTypes.resetSidebar](context) {
    return new Promise(resolve => {
      context.commit(mutationTypes.resetIsHideSidebar);
      resolve();
    });
  },
}

export default {
  state,
  actions,
  mutations
}
