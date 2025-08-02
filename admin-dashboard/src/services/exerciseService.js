import api from "./api";

const getExercises = async (lessonId) => {
  const response = await api.get(`/lessons/${lessonId}/exercises`);
  return response.data.data;
};

const createExercise = async (lessonId, exercise) => {
  const response = await api.post(`/lessons/${lessonId}/exercises`, exercise);
  return response.data.data;
};

const updateExercise = async (id, exercise) => {
  const response = await api.put(`/exercises/${id}`, exercise);
  return response.data.data;
};

const deleteExercise = async (id) => {
  await api.delete(`/exercises/${id}`);
};

export default {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
};
