import axios from "axios"

const api = axios.create({
    //baseURL: "http://3.234.6.204:8000/api/v1"
    baseURL: "http://127.0.0.1:8000/api/v1"
})

export default api