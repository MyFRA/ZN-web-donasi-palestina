import axios from "axios";

const baseURL = "https://panel.indonesiaforpalestine.com/api";

const Api = axios.create({
    baseURL: baseURL,
});

export default Api;
