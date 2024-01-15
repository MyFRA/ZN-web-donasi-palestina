import axios from 'axios'

const baseURL = 'http://localhost:8000/api'

const Api = axios.create({
    baseURL: baseURL
})

export default Api;