import api from './client';

export const recycleBinApi = {
  getTrash: () => api.get('/recycle-bin'),
  // Candidate applications trash
  restoreApplication: (id) => api.post(`/recycle-bin/${id}/restore`),
  permanentDelete: (id) => api.delete(`/recycle-bin/${id}/permanent`),
  emptyTrash: () => api.delete('/recycle-bin/empty/all'),
  // Job openings trash
  restoreJob: (id) => api.post(`/recycle-bin/jobs/${id}/restore`),
  permanentDeleteJob: (id) => api.delete(`/recycle-bin/jobs/${id}/permanent`),
  emptyJobsTrash: () => api.delete('/recycle-bin/jobs/empty/all'),
  // Retention policy
  getRetentionSettings: () => api.get('/recycle-bin/settings/policy'),
  updateRetentionSettings: (retentionDays) =>
    api.put('/recycle-bin/settings/policy', { retentionDays })
};

