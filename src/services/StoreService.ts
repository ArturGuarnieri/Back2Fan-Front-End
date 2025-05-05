
import { apiClient } from './ApiClient';

export interface Store {
  id: string;
  name: string;
  logo?: string;
  category?: string;
  description?: string;
  country: string;
  max_cashback?: string;
  club?: string;
  cashback_min?: number;
  cashback_max?: number;
  featured?: boolean;
  affiliateLink?: string;
  cashback?: string;
}

export interface Cashback {
  id: number;
  category: string;
  cashback_percent: string;
}


interface StoresResponse {
  success: boolean;
  stores: Store[];
}

interface StoreResponse {
  success: boolean;
  store: Store;
  cashbacks?: Cashback[];
}

interface IsAdminResponse {
  success: boolean;
  isAdmin: boolean;
}

interface StoreActionResponse {
  success: boolean;
  message: string;
  store_id?: string;
}

interface CashbackActionResponse {
  success: boolean;
  message: string;
  cashback_id?: number;
}

export const StoreService = {

  async getStores(): Promise<Store[]> {
    try {

      const response = await apiClient.fetchWithErrorHandling<StoresResponse>('/api/stores', {
        method: 'GET',
        headers: apiClient.getHeaders()
      });
      
      if (response && response.success && response.stores) {
        const storeList = response.stores;
        return storeList;
      }
      
      return [];
    } catch (error) {
      console.error("Error in getStores:", error);
      return [];
    }
  },
  

  async getStoreById(id: string): Promise<Store | null> {
    try {

      const response = await apiClient.fetchWithErrorHandling<StoreResponse>(`/api/stores/${id}`, {
        method: 'GET',
        headers: apiClient.getHeaders()
      });
      
      if (response && response.success && response.store) {
        const store = response.store;
        

        if (store.cashback_min === undefined) store.cashback_min = 0;
        if (store.cashback_max === undefined) store.cashback_max = 0;
        

        if (response.cashbacks && response.cashbacks.length > 0) {
          const cashbackValues = response.cashbacks.map(cb => parseFloat(cb.cashback_percent));
          const min = Math.min(...cashbackValues);
          const max = Math.max(...cashbackValues);
          
          store.cashback_min = min;
          store.cashback_max = max;
          store.cashback = min === max ? `${min}%` : `${min}% - ${max}%`;
        } else {
          store.cashback = "0%";
        }
        
        return store;
      }
      
      return null;
    } catch (error) {
      console.error("Error in getStoreById:", error);
      return null;
    }
  },
  

  async getFeaturedStores(): Promise<Store[]> {
    try {
      const stores = await this.getStores();
      return stores.filter(s => s.featured).slice(0, 4);
    } catch (error) {
      console.error("Error in getFeaturedStores:", error);
      return [];
    }
  },
  

  async isUserAdmin(): Promise<boolean> {
    try {
      const response = await apiClient.fetchWithErrorHandling<IsAdminResponse>('/api/is-admin', {
        method: 'GET',
        headers: apiClient.getHeaders()
      });
      
      console.log("isUserAdmin response:", response);
      return response && response.success && response.isAdmin;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  },
  

  async createStore(storeData: { name: string; country: string; club?: string; category?: string; description?: string; }): Promise<{ success: boolean; message: string; store_id?: string }> {
    try {
      const response = await apiClient.fetchWithErrorHandling<StoreActionResponse>('/api/store', {
        method: 'POST',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(storeData)
      });
      
      return response;
    } catch (error: any) {
      console.error("Error creating store:", error);
      return { success: false, message: error.message || "Failed to create store" };
    }
  },
  

  async updateStore(id: string, storeData: { name?: string; country?: string; club?: string; category?: string; description?: string; featured?: boolean }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.fetchWithErrorHandling<StoreActionResponse>(`/api/store/${id}`, {
        method: 'PUT',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(storeData)
      });
      
      return response;
    } catch (error: any) {
      console.error("Error updating store:", error);
      return { success: false, message: error.message || "Failed to update store" };
    }
  },
  

  async deleteStore(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.fetchWithErrorHandling<StoreActionResponse>(`/api/store/${id}`, {
        method: 'DELETE',
        headers: apiClient.getHeaders()
      });
      
      return response;
    } catch (error: any) {
      console.error("Error deleting store:", error);
      return { success: false, message: error.message || "Failed to delete store" };
    }
  },


  async getStoreCashbacks(storeId: string): Promise<Cashback[]> {
    try {
      const response = await apiClient.fetchWithErrorHandling<StoreResponse>(`/api/stores/${storeId}`, {
        method: 'GET',
        headers: apiClient.getHeaders()
      });
      
      if (response && response.success && response.cashbacks) {
        return response.cashbacks;
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching store cashbacks:", error);
      return [];
    }
  },
  

  async addCashback(storeId: string, cashbackData: { category: string; cashback_percent: string }): Promise<{ success: boolean; message: string; cashback_id?: number }> {
    try {
      const response = await apiClient.fetchWithErrorHandling<CashbackActionResponse>(`/api/store/${storeId}/cashback`, {
        method: 'POST',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(cashbackData)
      });
      
      return response;
    } catch (error: any) {
      console.error("Error adding cashback:", error);
      return { success: false, message: error.message || "Failed to add cashback" };
    }
  },
  

  async updateCashback(storeId: string, cashbackId: number, cashbackData: { category?: string; cashback_percent?: string }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.fetchWithErrorHandling<CashbackActionResponse>(`/api/store/${storeId}/cashback/${cashbackId}`, {
        method: 'PUT',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(cashbackData)
      });
      
      return response;
    } catch (error: any) {
      console.error("Error updating cashback:", error);
      return { success: false, message: error.message || "Failed to update cashback" };
    }
  },
  

  async deleteCashback(storeId: string, cashbackId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.fetchWithErrorHandling<CashbackActionResponse>(`/api/store/${storeId}/cashback/${cashbackId}`, {
        method: 'DELETE',
        headers: apiClient.getHeaders()
      });
      
      return response;
    } catch (error: any) {
      console.error("Error deleting cashback:", error);
      return { success: false, message: error.message || "Failed to delete cashback" };
    }
  }
};
