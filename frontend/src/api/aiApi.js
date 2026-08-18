import api from './client';

export const aiApi = {
  resumeBuddyChat: (prompt) => api.post('/ai/resume-buddy/chat', { prompt }),
  candidateMatch: (candidateId, jobId) => api.post('/ai/candidate-match', { candidateId, jobId })
};

export const analyticsApi = {
  getDashboardStats: () => api.get('/analytics/dashboard')
};

export const notificationApi = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`)
};
