
import api from "./api";

export const getCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

export const getCourse = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (course) => {
  const response = await api.post("/courses", course);
  return response.data;
};

export const updateCourse = async (id, course) => {
  const response = await api.put(`/courses/${id}`, course);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};
