import testbankApi from '@/api/testbank'

const state = {
    data: null,
    isLoading: false,
    errorDelete: null,
    error: null
}

export const mutationTypes = {
    getTestbankStart: '[testbank] Get testbank start',
    getTestbankSuccess: '[testbank] Get testbank success',
    getTestbankFailure: '[testbank] Get testbank failure',

    deleteTestbankStart: '[testbank] Delete testbank start',
    deleteTestbankSuccess: '[testbank] Delete testbank success',
    deleteTestbankFailure: '[testbank] Delete testbank failure'
}

export const actionTypes = {
    getTestbank: '[testbank] Get testbank',
    deleteTestbank: '[testbank] Delete testbank'
}

const mutations = {
    [mutationTypes.getTestbankStart](state) {
        state.error = null;
        state.isLoading = true;
        state.data = null;
    },
    [mutationTypes.getTestbankSuccess](state, payload) {
        state.isLoading = false;
        state.data = payload;
    },
    [mutationTypes.getTestbankFailure](state, payload) {
        state.error = payload;
        state.isLoading = false;
        state.data = null;
    },

    [mutationTypes.deleteTestbankStart]() { },
    [mutationTypes.deleteTestbankSuccess]() { },
    [mutationTypes.deleteTestbankFailure](state, payload) {
        state.errorDelete = payload;
    }
}

const actions = {
    [actionTypes.getTestbank](context) {
        return new Promise(resolve => {
            context.commit(mutationTypes.getTestbankStart)
            testbankApi
                .getTestbank()
                .then(response => {
                    context.commit(mutationTypes.getTestbankSuccess, response.data)
                    resolve(response.data)
                })
                .catch(() => {
                    context.commit(mutationTypes.getTestbankFailure, result.response.data.errors)
                })
        })
    },
    [actionTypes.deleteTestbank](context, { slug }) {
        return new Promise((resolve, reject) => {
            context.commit(mutationTypes.deleteTestbankStart)
            testbankApi
                .deleteTestbank(slug)
                .then((response) => {
                    context.commit(mutationTypes.deleteTestbankSuccess)
                    resolve(response.data.testbank)
                })
                .catch((result) => {
                    context.commit(mutationTypes.deleteTestbankFailure, result.response.data.errors);
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

