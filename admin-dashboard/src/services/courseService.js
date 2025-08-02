import api from "./api";

const getCourses = async () => {
  const response = await api.get("/courses");
  return response.data.data;
};

const createCourse = async (course) => {
  const response = await api.post("/courses", course);
  return response.data.data;
};

const updateCourse = async (id, course) => {
  const response = await api.put(`/courses/${id}`, course);
  return response.data.data;
};

const deleteCourse = async (id) => {
  await api.delete(`/courses/${id}`);
};

export default {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
