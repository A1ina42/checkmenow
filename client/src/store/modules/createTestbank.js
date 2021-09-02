import testbankApi from '@/api/testbank'

const state = {
  isSubmitting: false,
  validationErrors: null
}

export const mutationTypes = {
  createTestbankStart: '[createTestbank] Create testbank start',
  createTestbankSuccess: '[createTestbank] Create testbank success',
  createTestbankFailure: '[createTestbank] Create testbank failure',

  onSubmitTestbank: '[createTestbank] Reset validation',
}

export const actionTypes = {
  createTestbank: '[createTestbank] create testbank',
  resetValidation: '[createTestbank] reset validation',
}

const mutations = {
  [mutationTypes.createTestbankStart](state) {
    state.isSubmitting = true
  },
  [mutationTypes.createTestbankSuccess](state) {
    state.isSubmitting = false
  },
  [mutationTypes.createTestbankFailure](state, payload) {
    state.isSubmitting = false
    state.validationErrors = payload
  },

  [mutationTypes.onSubmitTestbank](state) {
    state.validationErrors = null;
  },
}

const actions = {
  [actionTypes.createTestbank](context, { testbankInput }) {
    return new Promise(resolve => {
      context.commit(mutationTypes.createTestbankStart)
      testbankApi
        .createTestbank(testbankInput)
        .then(response => {
          context.commit(mutationTypes.createTestbankSuccess, response.data.testbank);
          context.commit(mutationTypes.onSubmitTestbank);
          resolve(response.data.testbank)
        })
        .catch(result => {
          context.commit(
            mutationTypes.createTestbankFailure,
            result.response.data.errors
          )
        })
    })
  },
  [actionTypes.resetValidation](context) {
    return new Promise(resolve => {
      context.commit(mutationTypes.onSubmitTestbank);
      resolve();
    });
  }
}

export default {
  state,
  actions,
  mutations
}
