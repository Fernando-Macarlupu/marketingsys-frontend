import axios from "axios"

const api = axios.create({
    baseURL: "http://3.14.204.128:8000/api/v1"
})

export default api