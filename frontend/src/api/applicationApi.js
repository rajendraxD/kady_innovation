import api from './client';

export const applicationApi = {
  createApplication: (data) => api.post('/applications', data),
  parseResume: (formData) =>
    api.post('/applications/parse-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  parseResumeText: (data) => api.post('/applications/parse-resume', data),
  trackApplication: (ref) => api.get(`/applications/track/${ref}`),
  getApplications: (params) => api.get('/applications', { params }),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  updateStage: (id, stage) => api.patch(`/applications/${id}/stage`, { stage }),
  addNote: (id, note) => api.post(`/applications/${id}/notes`, { note }),
  submitScorecard: (id, scorecard) => api.post(`/applications/${id}/scorecard`, scorecard),
  moveToRecycleBin: (id) => api.delete(`/applications/${id}`)
};
