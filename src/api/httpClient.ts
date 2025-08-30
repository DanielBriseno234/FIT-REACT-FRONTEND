import axios from 'axios';
// import { refreshToken } from './auth';
// import { useAuthStore } from '../store/authStore';

const httpClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// httpClient.interceptors.request.use((config) => {
//     const { token } = useAuthStore.getState();

//     // Si la URL no es la de login y hay token, añade el header
//     if (!config.url?.includes('/login') && !config.url?.includes('/configuracion-inicial') && token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
// });

// httpClient.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         console.log("mensaje desde receptor")
//         console.log(error)

//         const originalRequest = error.config;
//         const { refreshToken: currentRefreshToken, setToken, logout } = useAuthStore.getState();
//         const isLoginRequest = originalRequest.url.includes("/login");

//         if (error.response?.status === 401 && !originalRequest._retry && currentRefreshToken && !isLoginRequest) {
//             originalRequest._retry = true;

//             try {
//                 const respuesta = await refreshToken(currentRefreshToken);

//                 const { data } = respuesta;

//                 setToken(data.token);
//                 originalRequest.headers.Authorization = `Bearer ${data.token}`;
//                 return httpClient(originalRequest);
//             } catch (refreshError) {
//                 logout();
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default httpClient;