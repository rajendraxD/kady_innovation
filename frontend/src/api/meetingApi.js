import api from './client';

export const meetingApi = {
  getMeetings: (params) => api.get('/meetings', { params }),
  scheduleMeeting: (data) => api.post('/meetings', data),
  updateMeeting: (id, data) => api.put(`/meetings/${id}`, data),
  deleteMeeting: (id) => api.delete(`/meetings/${id}`),
  submitFeedback: (id, feedback) => api.post(`/meetings/${id}/feedback`, feedback)
};
