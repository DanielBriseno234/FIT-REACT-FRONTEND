import { useEffect } from "react";
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from "react-hot-toast";

export const useAuthInit = () => {
    useEffect(() => {
        refreshTokenSilently();
    }, []);
};

const refreshTokenSilently = async () => {
    const { refreshToken, setToken } = useAuthStore.getState();

    try {

        if (refreshToken == null) {
            return;
        }

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
            refreshToken
        });

        setToken(response.data.token);
        useAuthStore.setState({ isAuthenticated: true });
    } catch (error) {
        toast.error(error.response.data.mensaje)
        useAuthStore.getState().limpiarInfoUsuario();
    }
};