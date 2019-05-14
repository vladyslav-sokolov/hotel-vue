import axios from 'axios'
import { TokenService } from '../services/storage.service'
import store from '../store'
import { tokenEndpoint } from '../config/config'

const ApiService = {

    _401interceptor: null,
    _networkInterceptor: null,

    mount401Interceptor() {
        this._401interceptor = axios.interceptors.response.use(
            (response) => {
                return response
            },
            async (error) => {
                if (error.request.status == 401) {
                    if (error.config.url.includes(tokenEndpoint)) {
                        // Refresh token has failed. Logout the user
                        store.dispatch('auth/logout')
                        throw error
                    } else {
                        try {
                            await store.dispatch('auth/refreshToken')
                            return this.customRequest({
                                method: error.config.method,
                                url: error.config.url,
                                data: error.config.data,
                                headers: { 'Content-Type': 'application/json; charset=utf-8' }
                            })
                        } catch (e) {
                            throw error
                        }
                    }
                }
                throw error
            }
        )
    },

    mountnetworkInterceptor() {
        this._networkInterceptor = axios.interceptors.response.use(
            (response) => {
                return response
            },
            async (error) => {
                // network error
                if (!error.status) {
                    store.dispatch('error/networkErrorHandled')
                }
                throw error
            }
        );
        this._networkInterceptor = axios.interceptors.request.use(
            (request) => {
                store.dispatch('error/noNetworkErrorHandled')
                return request
            }
        )
    },

    unmount401Interceptor() {
        axios.interceptors.response.eject(this._401interceptor)
    },

    init(baseURL) {
        axios.defaults.baseURL = baseURL;
    },

    setHeader() {
        axios.defaults.headers.common["Authorization"] = `Bearer ${TokenService.getToken()}`
    },

    removeHeader() {
        axios.defaults.headers.common = {}
    },

    get(resource) {
        return axios.get(resource)
    },

    post(resource, data) {
        return axios.post(resource, data)
    },

    put(resource, data) {
        return axios.put(resource, data)
    },

    delete(resource) {
        return axios.delete(resource)
    },

    customRequest(data) {
        return axios(data)
    }
}

export default ApiService