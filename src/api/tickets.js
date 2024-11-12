import axiosInstance from './axios';

export const fetchBookedTickets = async () => {
    try {
        const response = await axiosInstance.get('/tickets');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const buyTicket = async ({ flightId, seatId, userId, passengerName }) => {
    try {
        const response = await axiosInstance.post('/tickets', {
            flightId,
            seatId,
            userId,
            passengerName,
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const fetchMyTickets = async (userId) => {
    try {
        const response = await axiosInstance.get(`/tickets?userId=${userId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
