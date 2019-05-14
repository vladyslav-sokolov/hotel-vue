import { RoomTypeService, RoomTypeError } from '../services/roomType.service'

const state = {
    getting: false,
    creating: false,
    updating: false,
    deleting: false,
    updatingImage: false,
    roomTypes: null,
    errorMessage: '',
    errorCode: 0,
}

const getters = {
    updatingImage: (state) => {
        return state.updatingImage ? true : false
    },
    getting: (state) => {
        return state.getting ? true : false
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
    roomTypes: (state) => {
        return state.roomTypes
    },
    errorMessage: (state) => {
        return state.errorMessage
    },
    errorCode: (state) => {
        return state.errorCode
    },
}

const actions = {
    async fetchRoomTypes({ commit }) {
        commit('roomTypesFetch')
        try {
            const roomTypes = await RoomTypeService.getRoomTypes()
            commit('roomTypesFetched', roomTypes)
            return true
        } catch (e) {
            if (e instanceof RoomTypeError) {
                commit('roomTypeFetchError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
        return false
    },
    async createRoomType({ commit }, roomType) {
        commit('roomTypeCreate')
        try {
            roomType = await RoomTypeService.createRoomType(roomType)
            commit('roomTypeCreated', roomType)
            return true
        } catch (e) {
            if (e instanceof RoomTypeError) {
                commit('roomTypeCreateError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
        return false
    },
    async updateRoomType({ commit }, roomType) {
        commit('roomTypeUpdate')
        try {
            roomType = await RoomTypeService.updateRoomType(roomType)
            commit('roomTypeUpdated', roomType)
            return true
        } catch (e) {
            if (e instanceof RoomTypeError) {
                commit('roomTypeUpdateError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
        return false
    },
    async deleteRoomType({ commit }, id) {
        commit('roomTypeDelete')
        try {
            await RoomTypeService.deleteRoomType(id)
            commit('roomTypeDeleted', id)
            return true
        } catch (e) {
            if (e instanceof RoomTypeError) {
                commit('roomTypeDeleteError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
        return false
    },
    async updateRoomTypeImage({ commit }, imageId) {
        commit('roomTypeImageUpdate')
        try {
            var url = await RoomTypeService.updateRoomTypeImage(imageId.image, imageId.id)
            commit('roomTypeImageUpdated', { url: url, id: imageId.id })
            return true
        } catch (e) {
            if (e instanceof RoomTypeError) {
                commit('roomTypeDeleteError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
        return false
    },
}

const mutations = {
    roomTypeImageUpdate(state) {
        state.updatingImage = true
        state.errorCode = 0
        state.errorMessage = ''
    },
    roomTypeImageUpdated(state, urlId) {
        state.updatingImage = false
        let i = state.roomTypes.map(item => item.id).indexOf(urlId.id)
        state.roomTypes[i].image = urlId.url
    },
    roomTypesFetch(state) {
        state.getting = true
        state.errorCode = 0
        state.errorMessage = ''
    },
    roomTypesFetched(state, roomTypes) {
        state.getting = false
        state.roomTypes = roomTypes
    },
    roomTypeCreate(state) {
        state.creating = true
        state.errorCode = 0
        state.errorMessage = ''
    },
    roomTypeCreated(state, roomType) {
        state.creating = false
        state.roomTypes.push(roomType)
    },
    roomTypeUpdate(state) {
        state.updating = true
        state.errorCode = 0
        state.errorMessage = ''
    },
    roomTypeUpdated(state, roomType) {
        state.updating = false
        let i = state.roomTypes.map(item => item.id).indexOf(roomType.id)
        Object.assign(state.roomTypes[i], roomType)
    },
    roomTypeDelete(state) {
        state.deleting = true
        state.errorCode = 0
        state.errorMessage = ''
    },
    roomTypeDeleted(state, id) {
        state.deleting = false
        let i = state.roomTypes.map(item => item.id).indexOf(id)
        state.roomTypes.splice(i, 1);
    },
    roomTypeFetchError(state, { errorCode, errorMessage }) {
        state.getting = false
        state.errorCode = errorCode
        state.errorMessage = errorMessage
    },
    roomTypeCreateError(state, { errorCode, errorMessage }) {
        state.creating = false
        state.errorCode = errorCode
        state.errorMessage = errorMessage
    },
    roomTypeUpdateError(state, { errorCode, errorMessage }) {
        state.updating = false
        state.errorCode = errorCode
        state.errorMessage = errorMessage
    },
    roomTypeDeleteError(state, { errorCode, errorMessage }) {
        state.deleting = false
        state.errorCode = errorCode
        state.errorMessage = errorMessage
    },
}

export const roomType = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}