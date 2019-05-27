import axios from 'axios'

const baseURL = process.env.REACT_APP_BASEURL || "http://localhost:4000"

export default axios.create({
  baseURL: baseURL
})
