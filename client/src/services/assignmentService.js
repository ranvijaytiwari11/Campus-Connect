import api from './api';

export const assignmentService = {
  createAssignment: async (assignmentData) => {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  },

  getAssignments: async (courseId = '') => {
    const url = courseId ? `/assignments?courseId=${courseId}` : '/assignments';
    const response = await api.get(url);
    return response.data;
  },

  submitAssignment: async (assignmentId, content) => {
    const response = await api.post(`/assignments/${assignmentId}/submit`, { content });
    return response.data;
  },

  getSubmissions: async (assignmentId) => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`);
    return response.data;
  },

  gradeSubmission: async (submissionId, gradeData) => {
    const response = await api.put(`/assignments/submissions/${submissionId}/grade`, gradeData);
    return response.data;
  },
};
