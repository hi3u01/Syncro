import axios from "axios";

// Vytvoření instance axiosu se základní URL adresou tvého serveru
const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Tento "Interceptor" zachytí každý požadavek před jeho odesláním
API.interceptors.request.use((req) => {
  // Podíváme se do lokálního úložiště prohlížeče, jestli tam máme uložený profil uživatele (s tokenem)
  const userProfile = localStorage.getItem("profile");

  if (userProfile) {
    // Pokud ano, vezmeme token a automaticky ho přidáme do hlavičky požadavku
    const token = JSON.parse(userProfile).token;
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
