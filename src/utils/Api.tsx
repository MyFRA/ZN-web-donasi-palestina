import axios from "axios";

const baseURL = "https://api.indonesiaforpalestine.com/api";

const Api = axios.create({
    baseURL: baseURL,
});

export default Api;
