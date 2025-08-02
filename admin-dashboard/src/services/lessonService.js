import api from "./api";

const getLessons = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/lessons`);
  return response.data.data;
};

const createLesson = async (courseId, lesson) => {
  const response = await api.post(`/courses/${courseId}/lessons`, lesson);
  return response.data.data;
};

const updateLesson = async (id, lesson) => {
  const response = await api.put(`/lessons/${id}`, lesson);
  return response.data.data;
};

const deleteLesson = async (id) => {
  await api.delete(`/lessons/${id}`);
};

export default {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
};
