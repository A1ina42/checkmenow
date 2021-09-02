import groupApi from '@/api/group'

const state = {
  isSubmitting: false,
  validationErrors: null
}

export const mutationTypes = {
  createGroupStart: '[createGroup] Create group start',
  createGroupSuccess: '[createGroup] Create group success',
  createGroupFailure: '[createGroup] Create group failure',

  onSubmitGroup: '[createGroup] Reset validation',
}

export const actionTypes = {
  createGroup: '[createGroup] create group',
  resetValidation: '[createGroup] reset validation',
}

const mutations = {
  [mutationTypes.createGroupStart](state) {
    state.isSubmitting = true;
    state.validationErrors = null;
  },
  [mutationTypes.createGroupSuccess](state) {
    state.isSubmitting = false;
  },
  [mutationTypes.createGroupFailure](state, payload) {
    state.isSubmitting = false;
    state.validationErrors = payload;
  },

  [mutationTypes.onSubmitGroup](state) {
    state.validationErrors = null;
  },
}

const actions = {
  [actionTypes.createGroup](context, credentials) {
    return new Promise(resolve => {
      context.commit(mutationTypes.createGroupStart)
      groupApi
        .createGroup(credentials)
        .then(response => {
          context.commit(mutationTypes.createGroupSuccess, response.data.group);
          context.commit(mutationTypes.onSubmitGroup);
          resolve(response.data.group)
        })
        .catch(result => {
          context.commit(
            mutationTypes.createGroupFailure,
            result.response.data.errors
          )
        })
    })
  },
  [actionTypes.resetValidation](context) {
    return new Promise(resolve => {
      context.commit(mutationTypes.onSubmitGroup);
      resolve();
    });
  }
}

export default {
  state,
  actions,
  mutations
}
