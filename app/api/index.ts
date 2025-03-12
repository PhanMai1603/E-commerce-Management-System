import axios from "axios";
import { toast } from 'react-toastify';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

const showToast = (message: string) => {
    toast.error(message);
}

api.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        const errorMessage = error.response.data.message
        // console.error(errorMessage)
        showToast(errorMessage)
        throw new Error(errorMessage)
    }
)

export default api;