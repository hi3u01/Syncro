import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use((req) => {
  const userProfile = localStorage.getItem("profile");

  if (userProfile) {
    const token = JSON.parse(userProfile).token;
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
