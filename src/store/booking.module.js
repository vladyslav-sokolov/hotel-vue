import { BookingService, BookingError } from '../services/booking.service'

const state = {
    fetching: false,
    creating: false,
    errorMessage: '',
    errorCode: 0,
    rooms: {},
    booking: {},
    fetchingBookings: false,
    bookings: null
}

const getters = {
    rooms: (state) => {
        return state.rooms
    },
    fetching: (state) => {
        return state.fetching
    },
    creating: (state) => {
        return state.creating
    },
    errorMessage: (state) => {
        return state.errorMessage
    },
    errorCode: (state) => {
        return state.errorCode
    },
    booking: (state) => {
        return state.booking
    },
    bookings: (state) => {
        return state.bookings
    },
    fetchingBookings:(state)=>{
        return state.fetchingBookings
    }
}

const actions = {
    async fetchAvailableRooms({ commit }, query) {
        commit('availableRoomsFetch')
        try {
            const rooms = await BookingService.fetchAvailableRooms(query)
            commit('availableRoomsFetched', rooms)
        } catch (e) {
            if (e instanceof BookingError) {
                commit('availableRoomsFetchError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
    },
    async createBooking({ commit }, booking) {
        commit("bookingCreate")
        try {
            booking = await BookingService.createBooking(booking)
            commit('bookingCreated', booking)
        } catch (e) {
            if (e instanceof BookingError) {
                commit('bookingCreateError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
    },
    async fetchBookings({ commit }, isAdmin) {
        commit("bookingsFetch")
        try {
            let bookings = await BookingService.fetchBookings(isAdmin)
            commit('bookingsFetched', bookings)
        } catch (e) {
            if (e instanceof BookingError) {
                commit('bookingsFetchError', { errorCode: e.errorCode, errorMessage: e.message })
            }
        }
    },

}

const mutations = {
    bookingsFetch(state) {
        state.fetchingBookings = true
        state.errorCode = 0
        state.errorMessage = ''
    },
    bookingsFetched(state, bookings) {
        state.fetchingBookings = false
        state.bookings = bookings
    },
    bookingsFetchError(state, { errorCode, errorMessage }) {
        state.fetchingBookings = false
        state.errorCode = errorCode
        state.errorMessage = errorMessage
    },
    availableRoomsFetch(state) {
        state.fetching = true
        state.errorCode = 0
        state.errorMessage = ''
    },
    availableRoomsFetched(state, rooms) {
        state.fetching = false
        state.rooms = rooms
    },
    availableRoomsFetchError(state, { errorCode, errorMessage }) {
        state.fetching = false
        state.errorCode = errorCode
        state.errorMessage = errorMessage
    },
    bookingCreate(state) {
        state.creating = true
        state.errorCode = 0
        state.errorMessage = ''
    },
    bookingCreated(state, booking) {
        state.creating = false
        state.booking = booking
    },
    bookingCreateError(state, { errorCode, errorMessage }) {
        state.creating = false
        state.errorCode = errorCode
        state.errorMessage = errorMessage
    },
}

export const booking = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}