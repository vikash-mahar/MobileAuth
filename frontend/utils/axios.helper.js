import axios from "axios";
import { toast } from "react-toastify";
import { parseErrorMessage } from "./parseErrorMsg.js";

const axiosInstance = axios.create({
    // baseURL:'http://localhost:4000/api/v1',
    baseURL:'https://mobileauth1.onrender.com/api/v1',
    withCredentials: true,
});


axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const errorMsg = parseErrorMessage(error.response.data);
        const originalRequest = error.config;
        if (
            error.response.status === 401 &&
            errorMsg === "TokenExpiredError" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post(
                    "/api/v1/users/refresh-token",
                    {},
                    { withCredentials: true }
                );
                localStorage.setItem("accessToken", data.data.accessToken);
                axiosInstance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error("Failed to refresh token", err);
                localStorage.removeItem("accessToken");
                window.location.reload();
                toast.error("Session expired. Please login again!");
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;