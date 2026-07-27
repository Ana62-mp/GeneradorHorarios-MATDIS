import axiosClient from "../api/axiosClient";

export const generateSchedules = async (configuration) => {
  const response = await axiosClient.post(
    "/schedules/generate",
    configuration,
  );

  return response.data;
};

export const getScheduleGenerations = async () => {
  const response = await axiosClient.get("/schedules");
  return response.data;
};

export const getScheduleGenerationById = async (id) => {
  const response = await axiosClient.get(`/schedules/${id}`);
  return response.data;
};

export const deleteScheduleGeneration = async (id) => {
  const response = await axiosClient.delete(`/schedules/${id}`);
  return response.data;
};