import axios from "axios";

const api = axios.create({
    baseURL: "https://nowted-server.remotestate.com",
    headers: {
        "Content-Type": "application/json",
    },
})  

export default api;