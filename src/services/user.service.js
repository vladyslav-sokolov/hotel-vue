import ApiService from './api.service'
import { TokenService } from './storage.service'
import { tokenEndpoint, hotelApiId, hotelApiSecret, hotelApiUrl } from '../config/config'

class AuthenticationError extends Error {
    constructor(errorCode, message) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        this.errorCode = errorCode
    }
}

const UserService = {
    login: async function (code) {
        const requestData = {
            method: 'post',
            url: tokenEndpoint,
            params: {
                grant_type: 'authorization_code',
                code: code
            },
            auth: {
                username: hotelApiId,
                password: hotelApiSecret
            }
        }

        try {
            const response = await ApiService.customRequest(requestData)

            TokenService.saveToken(response.data.access_token)
            TokenService.saveRefreshToken(response.data.refresh_token)
            ApiService.setHeader()

            ApiService.mount401Interceptor();

            return response.data.access_token
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.detail)
        }
    },

    refreshToken: async function () {
        const refreshToken = TokenService.getRefreshToken()

        const requestData = {
            method: 'post',
            url: tokenEndpoint,
            params: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            },
            auth: {
                username: hotelApiId,
                password: hotelApiSecret
            }
        }

        try {
            const response = await ApiService.customRequest(requestData)

            TokenService.saveToken(response.data.access_token)
            TokenService.saveRefreshToken(response.data.refresh_token)
            // Update the header in ApiService
            ApiService.setHeader()

            return response.data.access_token
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.detail)
        }

    },

    logout() {
        // Remove the token and remove Authorization header from Api Service as well 
        TokenService.removeToken()
        TokenService.removeRefreshToken()
        ApiService.removeHeader()

        ApiService.unmount401Interceptor()
    },

    fetchUserDetails: async function () {
        const response = await ApiService.get(hotelApiUrl + '/me')
        return response.data
    },

    updateUserImage: async function (image, id) {
        let url = hotelApiUrl + '/user/' + id + '/image'
        let formData = new FormData()
        formData.append("file", image)
        try {
            const response = await ApiService.post(url, formData)
            return response.data;
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.detail)
        }
    },

    updateUser: async function (user) {
        let url = hotelApiUrl + '/user'
        try {
            const response = await ApiService.put(url, user)
            return response.data;
        } catch (error) {
            throw new AuthenticationError(error.response.status, error.response.data.detail)
        }
    },
}

export default UserService

export { UserService, AuthenticationError }