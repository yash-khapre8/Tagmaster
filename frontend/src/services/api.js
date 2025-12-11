import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If unauthorized and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/auth/refresh`, {
                        refreshToken
                    });

                    const { token, refreshToken: newRefreshToken } = response.data.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getMe: () => api.get('/auth/me'),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken })
};

// Assets API
export const assetsAPI = {
    getAssets: (params) => api.get('/assets', { params }),
    getQueue: (params) => api.get('/assets/queue', { params }),
    getAsset: (id) => api.get(`/assets/${id}`),
    claimAsset: (id) => api.patch(`/assets/${id}/claim`),
    releaseAsset: (id) => api.patch(`/assets/${id}/release`),
    completeAsset: (id) => api.patch(`/assets/${id}/complete`),
    createAsset: (data) => api.post('/assets', data)
};

// Annotations API
export const annotationsAPI = {
    create: (data) => api.post('/annotations', data),
    getByAsset: (assetId, includeDeleted = false) =>
        api.get(`/annotations/asset/${assetId}`, { params: { includeDeleted } }),
    getById: (id) => api.get(`/annotations/${id}`),
    update: (id, data) => api.put(`/annotations/${id}`, data),
    delete: (id) => api.delete(`/annotations/${id}`),
    getMyAnnotations: (params) => api.get('/annotations/user/me', { params })
};

// Metrics API
export const metricsAPI = {
    getMyMetrics: () => api.get('/metrics/me'),
    getUserMetrics: (userId) => api.get(`/metrics/user/${userId}`),
    getDashboard: () => api.get('/metrics/dashboard'),
    getProjectMetrics: (projectName) => api.get(`/metrics/project/${projectName}`)
};

export default api;
