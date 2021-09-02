import axios from 'axios';
import { getItem } from '@/helpers/persistanceStorage';

axios.defaults.baseURL = 'https://checkmenow.ru:3000/api';

axios.interceptors.request.use(config => {
    const token = getItem('accessToken');
    const authorizationToken = token ? token : ''
    config.headers.authorization = authorizationToken;
    return config;
})


export default axios