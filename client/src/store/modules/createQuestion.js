import questionApi from '@/api/question'

const state = {
  isSubmitting: false,
  validationErrors: null
}

export const mutationTypes = {
  createQuestionStart: '[createQuestion] Create question start',
  createQuestionSuccess: '[createQuestion] Create question success',
  createQuestionFailure: '[createQuestion] Create question failure',

  onSubmitQuestion: '[createQuestion] Reset validation',
}

export const actionTypes = {
  createQuestion: '[createQuestion] create question',
  resetValidation: '[createQuestion] reset validation',
}

const mutations = {
  [mutationTypes.createQuestionStart](state) {
    state.isSubmitting = true
  },
  [mutationTypes.createQuestionSuccess](state) {
    state.isSubmitting = false
  },
  [mutationTypes.createQuestionFailure](state, payload) {
    state.isSubmitting = false
    state.validationErrors = payload
  },

  [mutationTypes.onSubmitQuestion](state) {
    state.validationErrors = null;
  },
}

const actions = {
  [actionTypes.createQuestion](context, { questionInput }) {
    return new Promise(resolve => {
      context.commit(mutationTypes.createQuestionStart)
      questionApi
        .createQuestion(questionInput)
        .then(response => {
          context.commit(mutationTypes.createQuestionSuccess, response.data.question);
          context.commit(mutationTypes.onSubmitQuestion);
          resolve(response.data.question)
        })
        .catch(result => {
          context.commit(
            mutationTypes.createQuestionFailure,
            result.response.data.errors
          )
        })
    })
  },
  [actionTypes.resetValidation](context) {
    return new Promise(resolve => {
      context.commit(mutationTypes.onSubmitQuestion);
      resolve();
    });
  }
}

export default {
  state,
  actions,
  mutations
}
