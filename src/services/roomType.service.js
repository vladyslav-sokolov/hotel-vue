import ApiService from './api.service'
import { hotelApiUrl } from '../config/config'

class RoomTypeError extends Error {
    constructor(errorCode, message) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        this.errorCode = errorCode
    }
}

const RoomTypeService = {
    getRoomTypes: async function () {
        let url = hotelApiUrl + '/room-type'
        try {
            const response = await ApiService.get(url)
            return response.data;
        } catch (error) {
            throw new RoomTypeError(error.response.status, error.response.data.detail)
        }
    },
    createRoomType: async function (roomType) {
        let url = hotelApiUrl + '/room-type'
        try {
            const response = await ApiService.post(url, roomType)
            return response.data;
        } catch (error) {
            throw new RoomTypeError(error.response.status, error.response.data.detail)
        }
    },
    updateRoomType: async function (roomType) {
        let url = hotelApiUrl + '/room-type'
        try {
            const response = await ApiService.put(url, roomType)
            return response.data;
        } catch (error) {
            throw new RoomTypeError(error.response.status, error.response.data.detail)
        }
    },
    deleteRoomType: async function (id) {
        let url = hotelApiUrl + '/room-type/' + id
        try {
            const response = await ApiService.delete(url)
            return response.status;
        } catch (error) {
            throw new RoomTypeError(error.response.status, error.response.data.detail)
        }
    },
    updateRoomTypeImage: async function (image, id) {
        let url = hotelApiUrl + '/room-type/' + id + '/image'
        let formData = new FormData()
        formData.append("file", image)
        try {
            const response = await ApiService.post(url, formData)
            return response.data;
        } catch (error) {
            throw new RoomTypeError(error.response.status, error.response.data.detail)
        }
    }
}

export default RoomTypeService

export { RoomTypeService, RoomTypeError }