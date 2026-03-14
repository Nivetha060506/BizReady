import api from './api';

const inventoryService = {
  getItems: (params) => api.get('/inventory', { params }),
  createItem: (data) => api.post('/inventory', data),
  updateItem: (id, data) => api.put(`/inventory/${id}`, data),
  deleteItem: (id) => api.delete(`/inventory/${id}`),
  importCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/inventory/import-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default inventoryService;
