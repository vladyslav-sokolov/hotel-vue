import ApiService from './api.service'
import { hotelApiUrl } from '../config/config'

class BookingError extends Error {
    constructor(errorCode, message) {
        super(message)
        this.name = this.constructor.name
        this.message = message
        this.errorCode = errorCode
    }
}
const BookingService = {
    fetchAvailableRooms: async function (query) {
        let url = hotelApiUrl + '/room/available?in=' + query.in + '&out=' + query.out + '&code=' + query.code
        try {
            const response = await ApiService.get(url)
            return response.data;
        } catch (error) {
            throw new BookingError(error.response.status, error.response.data)
        }
    },
    fetchBookings: async function (isAdmin) {
        let url = '';
        if (isAdmin)
            url = hotelApiUrl + '/booking';
        else
            url = hotelApiUrl + '/booking/guest';

        try {
            const response = await ApiService.get(url)
            return response.data;
        } catch (error) {
            throw new BookingError(error.response.status, error.response.data)
        }
    },
    createBooking: async function (booking) {
        let url = hotelApiUrl + '/booking'
        try {
            const response = await ApiService.post(url, booking)
            return response.data;
        } catch (error) {
            throw new BookingError(error.response.status, error.response.data)
        }
    },
}

export default BookingService

export { BookingService, BookingError }