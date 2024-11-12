import axiosInstance from './axios';

export const fetchFlights = async () => {
    try {
        const response = await axiosInstance.get('/flights');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
