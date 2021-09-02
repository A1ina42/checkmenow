import groupApi from '@/api/group'

const state = {
    data: null,
    isLoading: false,
    errorDelete: null,
    error: null,
}

export const mutationTypes = {
    getGroupStart: '[group] Get group start',
    getGroupSuccess: '[group] Get group success',
    getGroupFailure: '[group] Get group failure',

    getMyGroupsStart: '[group] Get my groups start',
    getMyGroupsSuccess: '[group] Get my groups success',
    getMyGroupsFailure: '[group] Get my groups failure',

    deleteUserGroupStart: '[group] Delete user group start',
    deleteUserGroupSuccess: '[group] Delete user group success',
    deleteUserGroupFailure: '[group] Delete user group failure',

    deleteGroupStart: '[group] Delete group start',
    deleteGroupSuccess: '[group] Delete group success',
    deleteGroupFailure: '[group] Delete group failure',

    rejectInviteGroupStart: '[group] Reject invite group start',
    rejectInviteGroupSuccess: '[group] Reject invite group success',
    rejectInviteGroupFailure: '[group] Reject invite group failure',

    acceptInviteGroupStart: '[group] Accept invite group start',
    acceptInviteGroupSuccess: '[group] Accept invite group success',
    acceptInviteGroupFailure: '[group] Accept invite group failure'
}

export const actionTypes = {
    getGroup: '[group] Get group',
    getMyGroups: '[group] Get my groups',
    getUsersGroup: '[group] Get users group',
    deleteUserGroup: '[group] Delete user group',
    deleteGroup: '[group] Delete group',
    rejectInviteGroup: '[group] Reject invite group',
    acceptInviteGroup: '[group] Accept invite group',
}

const mutations = {
    [mutationTypes.getGroupStart](state) {
        state.isLoading = true;
        state.error = null;
        state.data = null;
    },
    [mutationTypes.getGroupSuccess](state, payload) {
        state.isLoading = false;
        state.data = payload;
    },
    [mutationTypes.getGroupFailure](state, payload) {
        state.isLoading = false;
        state.error = payload;
    },

    [mutationTypes.getMyGroupsStart](state) {
        state.isLoading = true;
        state.error = null;
        state.data = null;
    },
    [mutationTypes.getMyGroupsSuccess](state, payload) {
        state.isLoading = false;
        state.data = payload;
    },
    [mutationTypes.getMyGroupsFailure](state, payload) {
        state.isLoading = false;
        state.error = payload;
    },

    [mutationTypes.deleteUserGroupStart]() { },
    [mutationTypes.deleteUserGroupSuccess]() { },
    [mutationTypes.deleteUserGroupFailure](state, payload) {
        state.error = payload;
    },

    [mutationTypes.deleteGroupStart]() { },
    [mutationTypes.deleteGroupSuccess]() { },
    [mutationTypes.deleteGroupFailure](state, payload) {
        state.errorDelete = payload;
    },

    [mutationTypes.acceptInviteGroupStart]() { },
    [mutationTypes.acceptInviteGroupSuccess]() { },
    [mutationTypes.acceptInviteGroupFailure](state, payload) {
        state.error = payload;
    },

    [mutationTypes.rejectInviteGroupStart]() { },
    [mutationTypes.rejectInviteGroupSuccess]() { },
    [mutationTypes.rejectInviteGroupFailure](state, payload) {
        state.error = payload;
    }
}

const actions = {
    [actionTypes.getGroup](context) {
        return new Promise(resolve => {
            context.commit(mutationTypes.getGroupStart)
            groupApi
                .getGroup()
                .then(response => {
                    context.commit(mutationTypes.getGroupSuccess, response.data)
                    resolve(response.data)
                })
                .catch((result) => {
                    context.commit(mutationTypes.getGroupFailure, result.response.data.errors)
                })
        })
    },
    [actionTypes.getMyGroups](context) {
        return new Promise(resolve => {
            context.commit(mutationTypes.getGroupStart)
            groupApi
                .getMyGroups()
                .then(response => {
                    context.commit(mutationTypes.getGroupSuccess, response.data)
                    resolve(response.data)
                })
                .catch((result) => {
                    context.commit(mutationTypes.getGroupFailure, result.response.data.errors)
                })
        })
    },
    [actionTypes.acceptInviteGroup](context, { slug }) {
        return new Promise((resolve) => {
            context.commit(mutationTypes.acceptInviteGroupStart);
            groupApi
                .acceptInvite(slug)
                .then(response => {
                    context.commit(mutationTypes.acceptInviteGroupSuccess, response.data)
                    resolve(response)
                })
                .catch(result => {
                    context.commit(
                        mutationTypes.acceptInviteGroupFailure,
                        result.response.data.errors
                    );
                })
        })
    },
    [actionTypes.rejectInviteGroup](context, { slug }) {
        return new Promise(resolve => {
            context.commit(mutationTypes.rejectInviteGroupStart)
            groupApi
                .rejectInvite(slug)
                .then((response) => {
                    context.commit(mutationTypes.rejectInviteGroupSuccess)
                    resolve(response.data)
                })
                .catch((result) => {
                    context.commit(mutationTypes.rejectInviteGroupFailure, result.response.data.errors)
                })
        })
    },
    [actionTypes.deleteGroup](context, { slug }) {
        return new Promise(resolve => {
            context.commit(mutationTypes.deleteGroupStart)
            groupApi
                .deleteGroup(slug)
                .then((response) => {
                    context.commit(mutationTypes.deleteGroupSuccess)
                    resolve(response.data.group)
                })
                .catch((result) => {
                    context.commit(mutationTypes.deleteGroupFailure, result.response.data.errors)
                })
        })
    },
    [actionTypes.deleteUserGroup](context, { groupId, userId }) {
        return new Promise((resolve, reject) => {
            context.commit(mutationTypes.deleteUserGroupStart)
            groupApi
                .deleteUserGroup(groupId, userId)
                .then((response) => {
                    context.commit(mutationTypes.deleteUserGroupSuccess)
                    resolve(response.data.group)
                })
                .catch((result) => {
                    context.commit(mutationTypes.deleteUserGroupFailure, result.response.data.errors)
                })
        })
    },
}

export default {
    state,
    actions,
    mutations
}

