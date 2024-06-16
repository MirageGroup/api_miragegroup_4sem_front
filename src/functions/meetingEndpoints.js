import axios from "axios";

export async function getAllMeetings() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  try {
    const response = await axios.get(`${backendUrl}/meeting/get`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
    return [];
  }
}

export async function getMeetingsByUser(userId) {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
  try {
    const response = await axios.get(`${backendUrl}/meeting/fetch`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
    return [];
  }
}
