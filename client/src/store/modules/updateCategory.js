import categoryApi from '@/api/category'

const state = {
  isSubmitting: false,
  validationErrors: null,
  isLoading: false
}

export const mutationTypes = {
  updateCategoryStart: '[editCategory] Update category start',
  updateCategorySuccess: '[editCategory] Update category success',
  updateCategoryFailure: '[editCategory] Update category failure',

  onSubmitCategory: '[editCategory] Reset validation',
}

export const actionTypes = {
  updateCategory: '[editCategory] сreate category',
  resetValidation: '[editCategory] reset validation',
}

const mutations = {
  [mutationTypes.updateCategoryStart](state) {
    state.validationErrors = null;
    state.isSubmitting = true;
  },
  [mutationTypes.updateCategorySuccess](state) {
    state.validationErrors = null;
    state.isSubmitting = false;
  },
  [mutationTypes.updateCategoryFailure](state, payload) {
    state.isSubmitting = false;
    state.validationErrors = payload;
  },

  [mutationTypes.onSubmitCategory](state) {
    state.validationErrors = null;
  },
}

const actions = {
  [actionTypes.updateCategory](context, credentials) {
    return new Promise((resolve, reject) => {
      context.commit(mutationTypes.updateCategoryStart);
      categoryApi
        .updateCategory(credentials)
        .then(category => {
          context.commit(mutationTypes.updateCategorySuccess, category)
          resolve(category)
        })
        .catch(result => {
          context.commit(
            mutationTypes.updateCategoryFailure,
            result.response.data.errors
          )
          reject(result.response.data.errors)
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
