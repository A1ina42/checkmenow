import groupApi from '@/api/group'

const state = {
  isSubmitting: false,
  validationErrors: null,
  errorsExist: null,
  data: null,
  isLoading: false
}

export const mutationTypes = {
  updateGroupStart: '[editGroup] Update group start',
  updateGroupSuccess: '[editGroup] Update group success',
  updateGroupFailure: '[editGroup] Update group failure',

  getTestbankStart: '[editGroup] Get testbank start',
  getTestbankSuccess: '[editGroup] Get testbank success',
  getTestbankFailure: '[editGroup] Get testbank failure',

  addUserStart: '[editGroup] Add user start',
  addUserSuccess: '[editGroup] Add user success',
  addUserFailure: '[editGroup] Add user failure',

  addTestbankStart: '[editGroup] Add testbank start',
  addTestbankSuccess: '[editGroup] Add testbank success',
  addTestbankFailure: '[editGroup] Add testbank failure',


  onCloseModal: '[editGroup] Reset errors exist',
  onSubmitGroup: '[editGroup] Reset validation',
}

export const actionTypes = {
  getTestbank: '[editGroup] Get testbank',
  updateGroup: '[editGroup] Create group',
  addUser: '[editGroup] Add user',
  addTestbank: '[editGroup] Add testbank',
  resetValidation: '[editGroup] reset validation',
  resetErrorsExist: '[editGroup] reset errors exist',
}

const mutations = {
  [mutationTypes.updateGroupStart](state) {
    state.isSubmitting = true;
    state.validationErrors = null;
  },
  [mutationTypes.updateGroupSuccess](state) {
    state.isSubmitting = false;
    state.validationErrors = null;
  },
  [mutationTypes.updateGroupFailure](state, payload) {
    state.isSubmitting = false;
    state.validationErrors = payload;
  },

  [mutationTypes.addUserStart](state) {
    state.isSubmitting = true;
    state.errorsExist = null;
  },

  [mutationTypes.addUserSuccess](state) {
    state.isSubmitting = false;
    state.errorsExist = null;
  },
  [mutationTypes.addUserFailure](state, payload) {
    state.isSubmitting = false;
    state.errorsExist = payload;
  },

  [mutationTypes.addTestbankStart](state) {
    state.isSubmitting = true;
  },

  [mutationTypes.addTestbankSuccess](state) {
    state.isSubmitting = false;
  },
  [mutationTypes.addTestbankFailure](state, payload) {
    state.isSubmitting = false;
  },

  [mutationTypes.onSubmitGroup](state) {
    state.validationErrors = null;
  },

  [mutationTypes.onCloseModal](state) {
    state.errorsExist = null;
  },


  [mutationTypes.getTestbankStart](state) {
    state.errorsExist = null;
    state.isLoading = true;
    state.data = null;
  },
  [mutationTypes.getTestbankSuccess](state, payload) {
    state.isLoading = false;
    state.data = payload;
  },
  [mutationTypes.getTestbankFailure](state, payload) {
    state.errorsExist = payload;
    state.isLoading = false;
    state.data = null;
  },
}

const actions = {
  [actionTypes.updateGroup](context, credentials) {
    return new Promise((resolve, reject) => {
      context.commit(mutationTypes.updateGroupStart);
      groupApi
        .updateGroup(credentials)
        .then(group => {
          context.commit(mutationTypes.updateGroupSuccess, group)
          resolve(group)
        })
        .catch(result => {
          context.commit(
            mutationTypes.updateGroupFailure,
            result.response.data.errors
          );
          reject(result.response.data.errors)
        })
    })
  },
  [actionTypes.getTestbank](context, { slug }) {
    return new Promise(resolve => {
      context.commit(mutationTypes.getTestbankStart)
      groupApi
        .getTestbank(slug)
        .then(response => {
          context.commit(mutationTypes.getTestbankSuccess, response.data)
          resolve(response)
        })
        .catch((result) => {
          context.commit(mutationTypes.getTestbankFailure, result.response.data.errors)
        })
    })
  },
  [actionTypes.addUser](context, { slug, users }) {
    return new Promise((resolve) => {
      context.commit(mutationTypes.addUserStart);
      groupApi
        .addUser(slug, users)
        .then(response => {
          context.commit(mutationTypes.addUserSuccess, response.data.newAddUsers)
          context.commit(mutationTypes.addUserFailure, response.data.notExist)
          resolve(response)
        })
        .catch(result => {
          context.commit(
            mutationTypes.addUserFailure,
            result.response.data.errors
          );
        })
    })
  },
  [actionTypes.addTestbank](context, { slug, testbanks }) {
    return new Promise((resolve) => {
      context.commit(mutationTypes.addTestbankStart);
      groupApi
        .addTestbank(slug, testbanks)
        .then(response => {
          context.commit(mutationTypes.addTestbankSuccess, response.data.testbanks)
          resolve(response)
        })
        .catch(result => {
          context.commit(
            mutationTypes.addTestbankFailure,
            result.response.data.errors
          );
        })
    })
  },
  [actionTypes.resetValidation](context) {
    return new Promise(resolve => {
      context.commit(mutationTypes.onSubmitGroup);
      resolve();
    });
  },
  [actionTypes.resetErrorsExist](context) {
    return new Promise(resolve => {
      context.commit(mutationTypes.onCloseModal);
      resolve();
    });
  }
}

export default {
  state,
  actions,
  mutations
}
