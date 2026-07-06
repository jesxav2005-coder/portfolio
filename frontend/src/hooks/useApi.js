import api from '../services/api';

export const useApi = () => {
  return {
    // Public Portfolio Endpoints
    getProfile: () => api.get('/api/portfolio/profile'),
    getSkills: () => api.get('/api/portfolio/skills'),
    getProjects: () => api.get('/api/portfolio/projects'),
    getProjectById: (id) => api.get(`/api/portfolio/projects/${id}`),
    getExperiences: () => api.get('/api/portfolio/experiences'),
    getCertificates: () => api.get('/api/portfolio/certificates'),
    getAchievements: () => api.get('/api/portfolio/achievements'),
    postContact: (data) => api.post('/api/portfolio/contact', data),
    postChatbotMessage: (message, sessionId, history) => 
      api.post('/api/chatbot/message', { message, session_id: sessionId, history }),
    trackVisit: (page, referrer) => api.post('/api/analytics/track', { page, referrer }),

    // Admin CRUD Endpoints (JWT attached automatically)
    adminGetProfile: () => api.get('/api/admin/profile'),
    adminUpdateProfile: (data) => api.put('/api/admin/profile', data),
    adminUploadPhoto: (formData) => api.post('/api/admin/profile/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    adminUploadVideo: (formData) => api.post('/api/admin/profile/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    adminUploadResume: (formData) => api.post('/api/admin/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

    adminGetSkills: () => api.get('/api/admin/skills'),
    adminCreateSkill: (data) => api.post('/api/admin/skills', data),
    adminUpdateSkill: (id, data) => api.put(`/api/admin/skills/${id}`, data),
    adminDeleteSkill: (id) => api.delete(`/api/admin/skills/${id}`),

    adminGetProjects: () => api.get('/api/admin/projects'),
    adminCreateProject: (formData) => api.post('/api/admin/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    adminUpdateProject: (id, formData) => api.put(`/api/admin/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    adminDeleteProject: (id) => api.delete(`/api/admin/projects/${id}`),

    adminGetExperiences: () => api.get('/api/admin/experiences'),
    adminCreateExperience: (data) => api.post('/api/admin/experiences', data),
    adminUpdateExperience: (id, data) => api.put(`/api/admin/experiences/${id}`, data),
    adminDeleteExperience: (id) => api.delete(`/api/admin/experiences/${id}`),

    adminGetCertificates: () => api.get('/api/admin/certificates'),
    adminCreateCertificate: (formData) => api.post('/api/admin/certificates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    adminUpdateCertificate: (id, formData) => api.put(`/api/admin/certificates/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    adminDeleteCertificate: (id) => api.delete(`/api/admin/certificates/${id}`),

    adminGetAchievements: () => api.get('/api/admin/achievements'),
    adminCreateAchievement: (data) => api.post('/api/admin/achievements', data),
    adminUpdateAchievement: (id, data) => api.put(`/api/admin/achievements/${id}`, data),
    adminDeleteAchievement: (id) => api.delete(`/api/admin/achievements/${id}`),

    adminGetMessages: (page, perPage) => api.get('/api/admin/messages', { params: { page, per_page: perPage } }),
    adminMarkMessageRead: (id) => api.put(`/api/admin/messages/${id}/read`),
    adminDeleteMessage: (id) => api.delete(`/api/admin/messages/${id}`),
    adminBulkDeleteMessages: (ids) => api.delete('/api/admin/messages', { data: { ids } }),

    adminGetDashboard: () => api.get('/api/admin/dashboard'),
    adminGetAnalytics: (days) => api.get('/api/admin/analytics', { params: { days } }),
  };
};
export default useApi;
