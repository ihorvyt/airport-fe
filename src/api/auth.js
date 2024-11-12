import axiosInstance from './axios';

export const login = async (email, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', {
            email,
            password,
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

export const registerUser = async (email, password) => {
    try {
        const response = await axiosInstance.post('/auth/register', { email, password });
        return response.data; // The response should include token, userId, and email
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};
