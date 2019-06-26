import ApiService from './api.service'
import { hotelApiUrl } from '../config/config'

class RoomError extends Error {
    constructor(errorCode, message) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        this.errorCode = errorCode
    }
}

const RoomService = {
    getRooms: async function () {
        let url = hotelApiUrl + '/room'
        try {
            const response = await ApiService.get(url)
            return response.data;
        } catch (error) {
            throw new RoomError(error.response.status, error.response.data)
        }
    },
    createRoom: async function (room) {
        let url = hotelApiUrl + '/room'
        try {
            const response = await ApiService.post(url, room)
            return response.data;
        } catch (error) {
            throw new RoomError(error.response.status, error.response.data)
        }
    },
    updateRoom: async function (room) {
        let url = hotelApiUrl + '/room'
        try {
            const response = await ApiService.put(url, room)
            return response.data;
        } catch (error) {
            throw new RoomError(error.response.status, error.response.data)
        }
    },
    deleteRoom: async function (id) {
        let url = hotelApiUrl + '/room/' + id
        try {
            const response = await ApiService.delete(url)
            return response.status;
        } catch (error) {
            throw new RoomError(error.response.status, error.response.data)
        }
    },
}

export default RoomService

export { RoomService, RoomError }