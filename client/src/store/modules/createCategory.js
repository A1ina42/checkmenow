import categoryApi from '@/api/category'

const state = {
  isSubmitting: false,
  validationErrors: null
}

export const mutationTypes = {
  createCategoryStart: '[createCategory] Create category start',
  createCategorySuccess: '[createCategory] Create category success',
  createCategoryFailure: '[createCategory] Create category failure',

  onSubmitCategory: '[createCategory] Reset validation',
}

export const actionTypes = {
  createCategory: '[createCategory] create category',
  resetValidation: '[createCategory] reset validation',
}

const mutations = {
  [mutationTypes.createCategoryStart](state) {
    state.isSubmitting = true;
    state.validationErrors = null;
  },
  [mutationTypes.createCategorySuccess](state) {
    state.isSubmitting = false;
  },
  [mutationTypes.createCategoryFailure](state, payload) {
    state.isSubmitting = false;
    state.validationErrors = payload;
  },

  [mutationTypes.onSubmitCategory](state) {
    state.validationErrors = null;
  },
}

const actions = {
  [actionTypes.createCategory](context, credentials) {
    return new Promise(resolve => {
      context.commit(mutationTypes.createCategoryStart)
      categoryApi
        .createCategory(credentials)
        .then(response => {
          context.commit(mutationTypes.createCategorySuccess, response.data.category);
          context.commit(mutationTypes.onSubmitCategory);
          resolve(response.data.category)
        })
        .catch(result => {
          context.commit(
            mutationTypes.createCategoryFailure,
            result.response.data.errors
          )
        })
    })
  },
  [actionTypes.resetValidation](context) {
    return new Promise(resolve => {
      context.commit(mutationTypes.onSubmitCategory);
      resolve();
    });
  }
}

export default {
  state,
  actions,
  mutations
}
