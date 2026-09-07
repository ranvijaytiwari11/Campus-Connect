import api from './api';

export const resultService = {
  enterResult: async (resultData) => {
    const response = await api.post('/results', resultData);
    return response.data;
  },

  getMyResults: async () => {
    const response = await api.get('/results/my-results');
    return response.data;
  },

  getCourseResults: async (courseId) => {
    const response = await api.get(`/results/course/${courseId}`);
    return response.data;
  },
};
