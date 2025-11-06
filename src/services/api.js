import axios from "axios";

const api = axios.create({
  baseURL: "http://3.111.175.246:7086/file-service",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchLegacyFiles = async () => {
  const response = await api.get(`/files/list-by-folder`);
  return response.data;
};

// export const downloadLegacyFile = async (fileId) => {
//   const response = await api.get(`/legacy-vessel-data/${fileId}/download`, {
//     responseType: "blob",
//   });
//   return response;
// };

export default api;
