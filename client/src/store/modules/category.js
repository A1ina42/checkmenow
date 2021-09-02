import categoryApi from '@/api/category'

const state = {
    data: null,
    isLoading: false,
    error: null,
    errorDelete: null
}

export const mutationTypes = {
    getCategoryStart: '[category] Get category start',
    getCategorySuccess: '[category] Get category success',
    getCategoryFailure: '[category] Get category failure',

    deleteCategoryStart: '[category] Delete category start',
    deleteCategorySuccess: '[category] Delete category success',
    deleteCategoryFailure: '[category] Delete category failure'
}

export const actionTypes = {
    getCategory: '[category] Get category',
    deleteCategory: '[category] Delete category'
}

const mutations = {
    [mutationTypes.getCategoryStart](state) {
        state.isLoading = true;
        state.error = null;
        state.data = null;
    },
    [mutationTypes.getCategorySuccess](state, payload) {
        state.isLoading = false;
        state.data = payload;
    },
    [mutationTypes.getCategoryFailure](state, payload) {
        state.isLoading = false;
        state.error = payload;
    },

    [mutationTypes.deleteCategoryStart]() { },
    [mutationTypes.deleteCategorySuccess]() { },
    [mutationTypes.deleteCategoryFailure](state, payload) {
        state.errorDelete = payload;
    }
}

const actions = {
    [actionTypes.getCategory](context) {
        return new Promise(resolve => {
            context.commit(mutationTypes.getCategoryStart)
            categoryApi
                .getCategory()
                .then(response => {
                    context.commit(mutationTypes.getCategorySuccess, response.data)
                    resolve(response.data)
                })
                .catch((result) => {
                    context.commit(mutationTypes.getCategoryFailure, result.response.data.errors)
                })
        })
    },
    [actionTypes.deleteCategory](context, { slug }) {
        return new Promise((resolve, reject) => {
            context.commit(mutationTypes.deleteCategoryStart)
            categoryApi
                .deleteCategory(slug)
                .then((response) => {
                    context.commit(mutationTypes.deleteCategorySuccess)
                    resolve(response.data.category)
                })
                .catch((result) => {
                    context.commit(mutationTypes.deleteCategoryFailure, result.response.data.errors)
                    reject(result.response.data.errors);
                })
        })
    }
}

export default {
    state,
    actions,
    mutations
}

