const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

const TokenService = {
    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    },

    saveToken(accessToken) {
        localStorage.setItem(TOKEN_KEY, accessToken)
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY)
    },

    getRefreshToken() {
        return localStorage.getItem(REFRESH_TOKEN_KEY)
    },

    saveRefreshToken(refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    },

    removeRefreshToken() {
        localStorage.removeItem(REFRESH_TOKEN_KEY)
    }

}

const PATH_REDIRECT_AFTER_AUTH_SERVER = 'path_back'
const SAVED_STATE_TO_CONTINUE_BOOKING = 'selected_room_booking'

const CustomService = {
    getPathBack() {
        return localStorage.getItem(PATH_REDIRECT_AFTER_AUTH_SERVER)
    },

    savePathBack(path) {
        localStorage.setItem(PATH_REDIRECT_AFTER_AUTH_SERVER, path)
    },

    removePathBack() {
        localStorage.removeItem(PATH_REDIRECT_AFTER_AUTH_SERVER)
    },

    getStateToContinueBooking() {
        return JSON.parse(localStorage.getItem(SAVED_STATE_TO_CONTINUE_BOOKING))
    },

    saveStateToContinueBooking(room) {
        localStorage.setItem(SAVED_STATE_TO_CONTINUE_BOOKING, JSON.stringify(room))
    },

    removeStateToContinueBooking() {
        localStorage.removeItem(SAVED_STATE_TO_CONTINUE_BOOKING)
    }
}

export { TokenService, CustomService }