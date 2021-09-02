import axios from '@/api/axios'

const getStatistics = slug => {
    return axios.get(`/statistics/${slug}`).then(response => response.data)
}

export default {
    getStatistics
}
