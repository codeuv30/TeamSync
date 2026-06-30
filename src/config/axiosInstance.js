import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://api.team-sync.space/api",
    withCredentials: true
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },

    async(error) => {
        const originalRequest = error.response.config;

        if(error.response.status === 401 && !originalRequest._retry) {
            try {
                const response = await axiosInstance.get("/auth/get-accessToken");

                originalRequest._retry = true;

                return originalRequest;
            } catch (error) {
                return Promise.reject(error);
            }
        };
    }
)