import Axios from 'axios';


const axios = Axios.create({
	baseURL: 'http://localhost:4000/',
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
