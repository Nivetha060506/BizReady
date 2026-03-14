import { create } from 'zustand';
import api from '../services/api';

const useModuleStore = create((set) => ({
  enabledModules: {
    salesInvoicing: true,
    inventory: true,
    crm: true,
    tasks: true,
    analytics: false,
    vendorPurchases: false,
    hrTimekeeping: false
  },
  loading: false,

  fetchModules: async () => {
    try {
      set({ loading: true });
      const { data } = await api.get('/modules');
      set({ enabledModules: data, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  toggleModule: async (moduleName) => {
    try {
      const { enabledModules } = useModuleStore.getState();
      const currentStatus = !!enabledModules[moduleName];
      const newStatus = !currentStatus;
      
      await api.patch(`/modules/${moduleName}`, { enabled: newStatus });
      set((state) => ({
        enabledModules: {
          ...state.enabledModules,
          [moduleName]: newStatus
        }
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to toggle module' };
    }
  },

  updateAllModules: async (modules) => {
    try {
      const { data } = await api.put('/modules', modules);
      set({ enabledModules: data });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}));

export default useModuleStore;
