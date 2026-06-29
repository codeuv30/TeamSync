import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://api.team-sync.space/api",
    withCredentials: true
});