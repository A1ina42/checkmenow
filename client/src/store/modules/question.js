import questionApi from '@/api/question'

const state = {
    data: null,
    isLoading: false,
    errorDelete: null,
    error: null
}

export const mutationTypes = {
    getQuestionStart: '[question] Get question start',
    getQuestionSuccess: '[question] Get question success',
    getQuestionFailure: '[question] Get question failure',

    deleteQuestionStart: '[question] Delete question start',
    deleteQuestionSuccess: '[question] Delete question success',
    deleteQuestionFailure: '[question] Delete question failure'
}

export const actionTypes = {
    getQuestion: '[question] Get question',
    deleteQuestion: '[question] Delete question'
}

const mutations = {
    [mutationTypes.getQuestionStart](state) {
        state.isLoading = true
        state.data = null
    },
    [mutationTypes.getQuestionSuccess](state, payload) {
        state.isLoading = false
        state.data = payload
    },
    [mutationTypes.getQuestionFailure](state) {
        state.isLoading = false
        state.data = null;
    },

    [mutationTypes.deleteQuestionStart]() { },
    [mutationTypes.deleteQuestionSuccess]() { },
    [mutationTypes.deleteQuestionFailure](state, payload) {
        state.errorDelete = payload;
    }
}

const actions = {
    [actionTypes.getQuestion](context) {
        return new Promise(resolve => {
            context.commit(mutationTypes.getQuestionStart)
            questionApi
                .getQuestion()
                .then(response => {
                    context.commit(mutationTypes.getQuestionSuccess, response.data)
                    resolve(response.data)
                })
                .catch(() => {
                    context.commit(mutationTypes.getQuestionFailure)
                })
        })
    },
    [actionTypes.deleteQuestion](context, { slug }) {
        return new Promise((resolve, reject) => {
            context.commit(mutationTypes.deleteQuestionStart)
            questionApi
                .deleteQuestion(slug)
                .then((response) => {
                    context.commit(mutationTypes.deleteQuestionSuccess)
                    resolve(response.data.question)
                })
                .catch((result) => {
                    context.commit(mutationTypes.deleteQuestionFailure, result.response.data.errors);
                    reject(result);
                })
        })
    }
}

export default {
    state,
    actions,
    mutations
}

