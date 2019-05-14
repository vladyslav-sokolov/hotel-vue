import { RoomService, RoomError } from '../services/room.service'

const state = {
    fetching: false,
    creating: false,
    updating: false,
    deleting: false,
    errorMessage: '',
    errorCode: 0,
    rooms: {},
}

const getters = {
    rooms: (state) => {
        return state.rooms
    },
    fetching: (state) => {
        return state.fetching ? true : false
    },
    creating: (state) => {
        return state.creating ? true : false
    },
    updating: (state) => {
        return state.updating ? true : false
    },
    deleting: (state) => {
        return state.deleting ? true : false
    },
    errorMessage: (state) => {
        return state.errorMessage
    },
    errorCode: (state) => {
        return state.errorCode
    },
}

const actions = {
    async fetchRooms({ commit }) {
        commit('roomsFetch')
        try {
            const rooms = await RoomService.getRooms()
            commit('roomsFetched', rooms)
        } catch (e) {
            if (e instanceof RoomError) {
                commit('roomsFetchError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
    },
    async createRoom({ commit }, room) {
        commit('roomCreate')
        try {
            room = await RoomService.createRoom(room)
            commit('roomCreated', room)
        } catch (e) {
            if (e instanceof RoomError) {
                commit('roomCreateError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
    },
    async updateRoom({ commit }, room) {
        commit('roomUpdate')
        try {
            room = await RoomService.updateRoom(room)
            commit('roomUpdated', room)
        } catch (e) {
            if (e instanceof RoomError) {
                commit('roomUpdateError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
    },
    async deleteRoom({ commit }, id) {
        commit('roomDelete')
        try {
            await RoomService.deleteRoom(id)
            commit('roomDeleted', id)
        } catch (e) {
            if (e instanceof RoomError) {
                commit('roomDeleteError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
    },
}

const mutations = {
    roomsFetch(state) {
        state.fetching = true
        state.errorCode = 0
        state.errorMessage = ''
    },
    roomsFetched(state, rooms) {
        state.fetching = false
        state.rooms = rooms
    },
    roomsFetchError(state, { errorCode, errorMessage }) {
        state.fetching = false
        state.errorCode = errorCode
        state.errorMessage = errorMessage
    },
    roomCreate(state) {
        state.creating = true
        state.errorCode = 0
        state.errorMessage = ''
    },
    roomCreated(state, room) {
        state.creating = false
        state.rooms.push(room)
    },
    roomCreateError(state, { errorCode, errorMessage }) {
        state.creating = false
        state.errorCode = errorCode
        state.errorMessage = errorMessage
    },
    roomUpdate(state) {
        state.updating = true
        state.errorCode = 0
        state.errorMessage = ''
    },
    roomUpdated(state, room) {
        state.updating = false
        let i = state.rooms.map(item => item.id).indexOf(room.id)
        Object.assign(state.rooms[i], room)
    },
    roomUpdateError(state, { errorCode, errorMessage }) {
        state.updating = false
        state.errorCode = errorCode
        state.errorMessage = errorMessage
    },
    roomDelete(state) {
        state.deleting = true
        state.errorCode = 0
        state.errorMessage = ''
    },
    roomDeleted(state, id) {
        state.deleting = false
        let i = state.rooms.map(item => item.id).indexOf(id)
        state.rooms.splice(i, 1);
    },
    roomDeleteError(state, { errorCode, errorMessage }) {
        state.deleting = false
        state.errorCode = errorCode
        state.errorMessage = errorMessage
    },
}

export const room = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}