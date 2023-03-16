import Axios from 'axios';
// import PocketBase from 'pocketbase';

// const pb = new PocketBase(import.meta.env.VITE_PB_BASE_URL);

const axios = Axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

const setApiHeader = (key: string, value: string | undefined) => {
	axios.defaults.headers.common[key] = value;
};

const get = axios.get,
	post = axios.post,
	put = axios.put,
	patch = axios.patch,
	deleteApi = axios.delete;

export { post, get, put, patch, deleteApi, setApiHeader };
