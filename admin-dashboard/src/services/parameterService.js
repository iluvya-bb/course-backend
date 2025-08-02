import api from "./api";

const getParameters = async () => {
  const response = await api.get("/parameters");
  return response.data.data;
};

const createParameter = async (parameter) => {
  const response = await api.post("/parameters", parameter);
  return response.data.data;
};

const updateParameter = async (key, parameter) => {
  const response = await api.put(`/parameters/${key}`, parameter);
  return response.data.data;
};

const deleteParameter = async (key) => {
  await api.delete(`/parameters/${key}`);
};

export default {
  getParameters,
  createParameter,
  updateParameter,
  deleteParameter,
};
