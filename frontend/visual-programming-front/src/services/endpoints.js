import axios from "axios";

// Creamos la base de las peticiones, con los datos necesarios
const apiClient = axios.create({
  baseURL: "http://localhost:10000",
  withCredentials: false,
  headers: {
    Accept: "applicacion/json",
    "Content-Type": "application/json",
  },
});

// Exportamos los métodos para las peticiones
export default {
  //getId
  getPrograms() {
    return apiClient.get("/posts");
  },
  createProgram() {
    return apiClient.post("/posts", data);
  },
  runProgram(data) { 
    return apiClient.post("/posts/run", data);
  }
};