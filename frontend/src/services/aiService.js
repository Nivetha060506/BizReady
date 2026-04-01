import api from './api';

const aiService = {
  getPredictions: () => api.get('/ai/predictions'),
  getRecommendations: () => api.get('/ai/recommendations')
};

export default aiService;
