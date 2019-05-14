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
    fetchAvailableRooms: async function (dateIn, dateOut, roomTypeCode) {
        let url = hotelApiUrl + '/booking/rooms?dateIn=' + dateIn + '&dateOut=' + dateOut + '&roomTypeCode=' + roomTypeCode
        try {
            const response = await ApiService.get(url)
            return response.data;
        } catch (error) {
            throw new BookingError(error.response.status, error.response.data.detail)
        }
    },
    fetchBookingsById: async function (id) {
        let url = '';
        if (id < 0)
            url = hotelApiUrl + '/booking';
        else
            url = hotelApiUrl + '/booking/guest/' + id;

        try {
            const response = await ApiService.get(url)
            return response.data;
        } catch (error) {
            throw new BookingError(error.response.status, error.response.data.detail)
        }
    },
    createBooking: async function (booking) {
        let url = hotelApiUrl + '/booking'
        try {
            const response = await ApiService.post(url, booking)
            return response.data;
        } catch (error) {
            throw new BookingError(error.response.status, error.response.data.detail)
        }
    },
}

export default BookingService

export { BookingService, BookingError }