import axios from 'axios';
import { supabase } from '../lib/supabase';

const api = axios.create({
    baseURL: 'https://finsights-u0m9.onrender.com/api'
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
