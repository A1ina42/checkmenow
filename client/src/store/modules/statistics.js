import statisticsApi from '@/api/statistics'

const state = {
    isLoading: false,
    data: null,
    isHideSidebar: true
}

export const mutationTypes = {
    getStatisticsStart: '[statistics] Get statistics start',
    getStatisticsSuccess: '[statistics] Get statistics success',
    getStatisticsFailure: '[statistics] Get statistics failure',

    resetIsHideSidebar: '[statistics] Reset hide sidebar',
}

export const actionTypes = {
    getStatistics: '[editStatistics] Get statistics',
    resetSidebar: '[editStatistics] Reset hide sidebar',
}

const mutations = {
    [mutationTypes.getStatisticsStart](state) {
        state.data = null;
        state.isLoading = true;
    },
    [mutationTypes.getStatisticsSuccess](state, payload) {
        state.isLoading = false;
        state.data = payload;
        state.isHideSidebar = false;
    },
    [mutationTypes.getStatisticsFailure](state) {
        state.isLoading = false;
    },
    [mutationTypes.resetIsHideSidebar](state) {
        state.isHideSidebar = true;
    },

}

const actions = {
    [actionTypes.getStatistics](context, { slug }) {
        return new Promise(resolve => {
            context.commit(mutationTypes.getStatisticsStart)
            statisticsApi
                .getStatistics(slug)
                .then(response => {
                    console.log(response);
                    context.commit(mutationTypes.getStatisticsSuccess, response)
                    resolve(response)
                })
                .catch(() => {
                    context.commit(mutationTypes.getStatisticsFailure)
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
