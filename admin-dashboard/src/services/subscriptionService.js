import api from "./api";

const getSubscriptions = async () => {
  const response = await api.get("/subscriptions/all");
  return response.data.data;
};

export default {
  getSubscriptions,
};
