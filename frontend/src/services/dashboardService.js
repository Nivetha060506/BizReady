import api from './api';

const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRevenueChart: () => api.get('/dashboard/revenue-chart'),
  getTopProducts: () => api.get('/dashboard/top-products'),
  getRecentActivity: () => api.get('/dashboard/activity'),
};

export default dashboardService;
