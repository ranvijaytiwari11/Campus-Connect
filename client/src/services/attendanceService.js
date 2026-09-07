import api from './api';

export const attendanceService = {
  markAttendance: async (payload) => {
    const response = await api.post('/attendance', payload);
    return response.data;
  },

  getCourseAttendance: async (courseId, date = '') => {
    const url = date
      ? `/attendance/course/${courseId}?date=${date}`
      : `/attendance/course/${courseId}`;
    const response = await api.get(url);
    return response.data;
  },

  getMyAttendance: async () => {
    const response = await api.get('/attendance/my-attendance');
    return response.data;
  },
};
