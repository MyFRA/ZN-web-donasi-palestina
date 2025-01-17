import axios from "axios";

const baseURL = "https://panel.nusantaraforpalestine.com/api";

const Api = axios.create({
    baseURL: baseURL,
});

export default Api;
