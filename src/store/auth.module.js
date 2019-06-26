import { UserService, AuthenticationError } from '../services/user.service'
import { TokenService } from '../services/storage.service'
import store from './index';

const state = {
    loginning: false,
    authenticating: false,
    updatingImage: false,
    fetchingUser: false,
    updating: false,
    accessToken: TokenService.getToken(),
    errorCode: 0,
    error: '',
    refreshTokenPromise: null,
    user: {},
}

const getters = {
    userLoaded: (state) => {
        return function () { return store.getters['error/networkError'] || !state.fetchingUser }
    },
    authenticated: (state) => {
        return state.accessToken
    },
    loggedIn: (state) => {
        return !state.loginning && state.accessToken && state.errorCode === 0
    },
    isAdmin: (state) => {
        return state.user.userType === 'Manager'
    },
    loginning: (state) => {
        return state.loginning
    },
    errorCode: (state) => {
        return state.errorCode
    },
    error: (state) => {
        return state.error
    },
    authenticating: (state) => {
        return state.authenticating
    },
    updatingImage: (state) => {
        return state.updatingImage
    },
    fetchingUser: (state) => {
        return state.fetchingUser
    },
    updating: (state) => {
        return state.updating
    },
    user: (state) => {
        return state.user
    },
}

const actions = {
    async login({ commit }, code) {
        commit("loginRequest")
        try {
            commit('tokenRequest')
            try {
                const token = await UserService.login(code)
                commit('tokenRequested', token)
            } catch (e) {
                if (e instanceof AuthenticationError) {
                    commit('tokenRequestError', { errorCode: e.errorCode, errorMessage: e.message })
                    throw e
                }
            }
            commit('userDetailsFetch')
            try {
                const user = await UserService.fetchUserDetails()
                commit('userDetailsFetched', user)
            } catch (e) {
                if (e instanceof AuthenticationError) {
                    commit('userDetailsFetchError', { errorCode: e.errorCode, errorMessage: e.message })
                    throw e
                }
            }
        } catch (e) {
            commit("loginRequestError")
        }
        commit("loginRequested")
    },

    async fetchUserDetails({ commit }) {
        commit('userDetailsFetch')
        try {
            const user = await UserService.fetchUserDetails()
            commit('userDetailsFetched', user)
        } catch (e) {
            if (e instanceof AuthenticationError) {
                commit('userDetailsFetchError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
    },

    async updateUserImage({ commit }, image) {
        commit('userImageUpdate')
        try {
            var url = await UserService.updateUserImage(image)
            commit('userImageUpdated', url)
        } catch (e) {
            if (e instanceof AuthenticationError) {
                commit('userImageUpdateError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
    },

    async updateUser({ commit }, user) {
        commit('userUpdate')
        try {
            user = await UserService.updateUser(user)
            commit('userUpdated', user)
        } catch (e) {
            if (e instanceof AuthenticationError) {
                commit('userUpdateError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
    },

    logout({ commit }) {
        UserService.logout()
        commit('logoutSuccess')
    },

    refreshToken({ commit, state }) {
        if (!state.refreshTokenPromise) {
            const p = UserService.refreshToken()
            commit('refreshTokenPromise', p)

            p.then(
                response => {
                    commit('refreshTokenPromise', null)
                    commit('tokenRequested', response)
                },
                error => {
                    commit('refreshTokenPromise', null)
                    console.log(error)
                }
            )
        }

        return state.refreshTokenPromise
    }
}

const mutations = {
    loginRequest(state) {
        state.loginning = true;
        state.error = '';
        state.errorCode = 0;
    },
    loginRequested(state) {
        state.loginning = false;
    },
    loginRequestError(state, { errorCode, errorMessage }) {
        state.loginning = false;
        state.errorCode = errorCode;
        state.error = errorMessage;
    },
    tokenRequest(state) {
        state.authenticating = true;
        state.error = '';
        state.errorCode = 0;
    },
    tokenRequested(state, accessToken) {
        state.authenticating = false;
        state.accessToken = accessToken;
    },
    tokenRequestError(state, { errorCode, errorMessage }) {
        state.authenticating = false;
        state.errorCode = errorCode;
        state.error = errorMessage;
    },
    logoutSuccess(state) {
        state.accessToken = '';
        state.user = {};
        state.error = '';
        state.errorCode = 0;
    },
    refreshTokenPromise(state, promise) {
        state.refreshTokenPromise = promise
    },
    userDetailsFetch(state) {
        state.fetchingUser = true
        state.error = '';
        state.errorCode = 0;
    },
    userDetailsFetched(state, user) {
        state.user = user
        state.fetchingUser = false
    },
    userDetailsFetchError(state, { errorCode, errorMessage }) {
        state.updating = false;
        state.errorCode = errorCode;
        state.error = errorMessage;
    },
    userImageUpdate(state) {
        state.updatingImage = true
        state.error = '';
        state.errorCode = 0;
    },
    userImageUpdated(state, url) {
        state.user.image = url
        state.updatingImage = false
    },
    userImageUpdateError(state, { errorCode, errorMessage }) {
        state.updatingImage = false;
        state.errorCode = errorCode;
        state.error = errorMessage;
    },
    userUpdate(state) {
        state.updating = true
        state.error = '';
        state.errorCode = 0;
    },
    userUpdated(state, user) {
        state.user = user
        state.updating = false
    },
    userUpdateError(state, { errorCode, errorMessage }) {
        state.updating = false;
        state.errorCode = errorCode;
        state.error = errorMessage;
    },
}

export const auth = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}