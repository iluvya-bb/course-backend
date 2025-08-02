import api from "./api";

const login = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
};

const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (token) {
    // In a real application, you would decode the token to get user info
    // For this example, we'll just return a mock user object
    return { name: "Admin" };
  }
  return null;
};

export default {
  login,
  logout,
  getCurrentUser,
};
