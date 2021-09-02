import passingApi from '@/api/passing'

const state = {
    data: null,
    testbank: null,
    myPassing: null,
    currentResult: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
}

export const mutationTypes = {
    getPassingStart: '[passing] Get passing start',
    getPassingSuccess: '[passing] Get passing success',
    getPassingFailure: '[passing] Get passing failure',

    getMyPassingStart: '[passing] Get my passing start',
    getMyPassingSuccess: '[passing] Get my passing success',
    getMyPassingFailure: '[passing] Get my passing failure',

    getTestbankStart: '[passing] Get testbank start',
    getTestbankSuccess: '[passing] Get testbank success',
    getTestbankFailure: '[passing] Get testbank failure',

    getCurrentResultStart: '[passing] Get current result start',
    getCurrentResultSuccess: '[passing] Get current result success',
    getCurrentResultFailure: '[passing] Get current result failure',

    createPassingStart: '[passing] Create passing start',
    createPassingSuccess: '[passing] Create passing success',
    createPassingFailure: '[passing] Create passing failure',
}

export const actionTypes = {
    getMyPassing: '[passing] Get my passing',
    getPassingTest: '[passing] Get passingTest',
    getPassingUser: '[passing] Get passingUser',
    getCurrentResult: '[passing] Get current result',
    getTestbank: '[passing] Get testbank',
    createPassing: '[passing] create passing',
}

const mutations = {
    [mutationTypes.getPassingStart](state) {
        state.isLoading = true;
        state.error = null;
        state.data = null;
    },
    [mutationTypes.getPassingSuccess](state, payload) {
        state.isLoading = false;
        state.data = payload;
        state.error = null;
    },
    [mutationTypes.getPassingFailure](state, payload) {
        state.isLoading = false;
        state.error = payload;
    },

    [mutationTypes.getTestbankStart](state) {
        state.isLoading = true;
        state.error = null;
        state.testbank = null;
    },
    [mutationTypes.getTestbankSuccess](state, payload) {
        state.isLoading = false;
        state.testbank = payload;
        state.error = null;
    },
    [mutationTypes.getTestbankFailure](state, payload) {
        state.isLoading = false;
        state.error = payload;
    },

    [mutationTypes.getMyPassingStart](state) {
        state.isLoading = true;
        state.error = null;
        state.myPassing = null;
    },
    [mutationTypes.getMyPassingSuccess](state, payload) {
        state.isLoading = false;
        state.myPassing = payload;
        state.error = null;
    },
    [mutationTypes.getMyPassingFailure](state, payload) {
        state.isLoading = false;
        state.error = payload;
    },


    [mutationTypes.getCurrentResultStart](state) {
        state.isLoading = true;
        state.error = null;
        state.currentResult = null;
    },
    [mutationTypes.getCurrentResultSuccess](state, payload) {
        state.isLoading = false;
        state.currentResult = payload;
        state.error = null;
    },
    [mutationTypes.getCurrentResultFailure](state, payload) {
        state.isLoading = false;
        state.error = payload;
    },

    [mutationTypes.createPassingStart](state) {
        state.isSubmitting = true;
        state.error = null;
    },
    [mutationTypes.createPassingSuccess](state) {
        state.isSubmitting = false;
        state.error = null;
    },
    [mutationTypes.createPassingFailure](state, payload) {
        state.isSubmitting = false;
        state.error = payload;
    },
}

const actions = {
    [actionTypes.getPassingTest](context) {
        return new Promise(resolve => {
            context.commit(mutationTypes.getPassingStart)
            passingApi
                .getPassing()
                .then(response => {
                    context.commit(mutationTypes.getPassingSuccess, response.data.passingTest)
                    resolve(response.data.passingTest)
                })
                .catch((passing) => {
                    context.commit(mutationTypes.getPassingFailure, passing.response.data.errors)
                })
        })
    },
    [actionTypes.getPassingUser](context) {
        return new Promise(resolve => {
            context.commit(mutationTypes.getPassingStart)
            passingApi
                .getPassing()
                .then(response => {
                    context.commit(mutationTypes.getPassingSuccess, response.data.passingUser)
                    resolve(response.data.passingUser)
                })
                .catch((passing) => {
                    context.commit(mutationTypes.getPassingFailure, passing.response.data.errors)
                })
        })
    },
    [actionTypes.getMyPassing](context) {
        return new Promise(resolve => {
            context.commit(mutationTypes.getMyPassingStart)
            passingApi
                .getMyPassing()
                .then(response => {
                    context.commit(mutationTypes.getMyPassingSuccess, response.data.myPassing)
                    resolve(response.data)
                })
                .catch((passing) => {
                    context.commit(mutationTypes.getMyPassingFailure, passing.response.data.errors)
                })
        })
    },
    [actionTypes.getTestbank](context, { slug }) {
        return new Promise(resolve => {
            context.commit(mutationTypes.getTestbankStart)
            passingApi
                .getTestbank(slug)
                .then((response) => {
                    context.commit(mutationTypes.getTestbankSuccess, response.data.testbank);
                    context.commit(mutationTypes.getPassingSuccess, response.data.passing);
                    resolve(response.data.testbank)
                })
                .catch((passing) => {
                    context.commit(mutationTypes.getTestbankFailure, passing.response.data.errors);
                })
        })
    },
    [actionTypes.getCurrentResult](context, { slug }) {
        return new Promise(resolve => {
            context.commit(mutationTypes.getCurrentResultStart)
            passingApi
                .getCurrentResult(slug)
                .then(response => {
                    context.commit(mutationTypes.getCurrentResultSuccess, response.data);
                    resolve(response)
                })
                .catch((passing) => {
                    context.commit(mutationTypes.getCurrentResultFailure, passing.response.data.errors)
                })
        })
    },
    [actionTypes.createPassing](context, credentials) {
        return new Promise(resolve => {
            context.commit(mutationTypes.createPassingStart)
            passingApi
                .createPassing(credentials)
                .then(response => {
                    context.commit(mutationTypes.createPassingSuccess, response.qna);
                    resolve(response.qna)
                })
                .catch(result => {
                    context.commit(
                        mutationTypes.createPassingFailure,
                        result.response.data.errors
                    )
                })
        })
    },
}

export default {
    state,
    actions,
    mutations
}

