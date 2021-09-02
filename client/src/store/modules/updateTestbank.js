import testbankApi from '@/api/testbank'

const state = {
  isSubmitting: false,
  validationErrors: null,
  isLoading: false,
  testbank: null,
  isHideSidebar: true
}

export const mutationTypes = {
  updateTestbankStart: '[editTestbank] Update testbank start',
  updateTestbankSuccess: '[editTestbank] Update testbank success',
  updateTestbankFailure: '[editTestbank] Update testbank failure',

  getTestbankStart: '[editTestbank] Get testbank start',
  getTestbankSuccess: '[editTestbank] Get testbank success',
  getTestbankFailure: '[editTestbank] Get testbank failure',

  resetIsHideSidebar: '[editTestbank] Reset reset hide sidebar',
}

export const actionTypes = {
  updateTestbank: '[editTestbank] Create testbank',
  getTestbank: '[editTestbank] Get testbank',
  resetSidebar: '[editQuestion] reset hide sidebar',
}

const mutations = {
  [mutationTypes.updateTestbankStart](state) {
    state.validationErrors = null;
    state.isSubmitting = true;
  },
  [mutationTypes.updateTestbankSuccess](state) {
    state.validationErrors = null;
    state.isSubmitting = false;
  },
  [mutationTypes.updateTestbankFailure](state, payload) {
    state.isSubmitting = false;
    state.validationErrors = payload;
  },
  [mutationTypes.getTestbankStart](state) {
    state.testbank = null;
    state.isLoading = true;
  },
  [mutationTypes.getTestbankSuccess](state, payload) {
    state.isLoading = false;
    state.testbank = payload;
    state.isHideSidebar = false;
  },
  [mutationTypes.getTestbankFailure](state) {
    state.isLoading = false;
  },
  [mutationTypes.resetIsHideSidebar](state) {
    state.isHideSidebar = true;
  },
}

const actions = {
  [actionTypes.updateTestbank](context, { slug, testbankInput }) {
    return new Promise(resolve => {
      context.commit(mutationTypes.updateTestbankStart)
      testbankApi
        .updateTestbank(slug, testbankInput)
        .then(testbank => {
          context.commit(mutationTypes.updateTestbankSuccess, testbank)
          resolve(testbank)
        })
        .catch(result => {
          context.commit(
            mutationTypes.updateTestbankFailure,
            result.response.data.errors
          )
        })
    })
  },
  [actionTypes.getTestbank](context, { slug }) {
    return new Promise(resolve => {
      context.commit(mutationTypes.getTestbankStart)
      testbankApi
        .getTest(slug)
        .then(testbank => {
          context.commit(mutationTypes.getTestbankSuccess, testbank)
          resolve(testbank)
        })
        .catch(() => {
          context.commit(mutationTypes.getTestbankFailure)
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
