import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/v1",
});
=======
    baseURL: "http://52.204.231.97:8000/api/v1"
    //baseURL: "http://127.0.0.1:8000/api/v1"
})
>>>>>>> 5a29d8fbe2cd4366e43daab4f78e83d73f048e05

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("marketingSYSaccess_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("marketingSYSrefresh_token");
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${api.defaults.baseURL}/token/refresh`,
            { refresh: refreshToken }
          );
          localStorage.setItem("marketingSYSaccess_token", data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("marketingSYSaccess_token");
          localStorage.removeItem("marketingSYSrefresh_token");
          localStorage.removeItem("marketingSYSusuario");
          localStorage.setItem(
            "marketingSYSusuario_logueado",
            JSON.stringify(false)
          );
        }
      }
    }
    return Promise.reject(error);
  }
);

export const saveAuthSession = (datos, tokens) => {
  localStorage.setItem("marketingSYSusuario", JSON.stringify(datos));
  localStorage.setItem("marketingSYSusuario_logueado", JSON.stringify(true));
  if (tokens) {
    localStorage.setItem("marketingSYSaccess_token", tokens.access);
    localStorage.setItem("marketingSYSrefresh_token", tokens.refresh);
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem("marketingSYSusuario");
  localStorage.removeItem("marketingSYSaccess_token");
  localStorage.removeItem("marketingSYSrefresh_token");
  localStorage.setItem("marketingSYSusuario_logueado", JSON.stringify(false));
};

export default api;
