const state = {
    networkError: false
}

const getters = {
    networkError: (state) => {
        return state.networkError
    },
}

const actions = {
    networkErrorHandled({ commit }) {
        commit('networkErrorHandledOn')
    },
    noNetworkErrorHandled({ commit }) {
        commit('networkErrorHandledOff')
    },
}

const mutations = {
    networkErrorHandledOn(state) {
        state.networkError = true
    },
    networkErrorHandledOff(state) {
        state.networkError = false
    }
}

export const error = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}