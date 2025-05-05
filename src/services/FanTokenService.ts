
import { apiClient } from './ApiClient';

export interface FanToken {
  id: number;
  name: string;
  slug: string;
  image: string;
}

interface FanTokensResponse {
  success: boolean;
  data: FanToken[];
}

interface FanTokenActionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const FanTokenService = {

  async getFanTokens(): Promise<FanToken[]> {
    try {
      const response = await apiClient.fetchWithErrorHandling<FanTokensResponse>('/api/fan-tokens', {
        method: 'GET',
        headers: apiClient.getHeaders()
      });
      
      if (response && response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching fan tokens:", error);
      return [];
    }
  },

  async createOrUpdateFanToken(fanTokenData: { 
    id?: number;
    name: string;
    slug: string;
    image: string;
  }): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await apiClient.fetchWithErrorHandling<FanTokenActionResponse>('/api/admin/fan-token', {
        method: 'POST',
        headers: apiClient.getHeaders(),
        body: JSON.stringify(fanTokenData)
      });
      
      return response;
    } catch (error: any) {
      console.error("Error creating/updating fan token:", error);
      return { 
        success: false, 
        error: error.message || "Failed to create/update fan token" 
      };
    }
  },


  async deleteFanToken(id: number): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await apiClient.fetchWithErrorHandling<FanTokenActionResponse>(`/api/admin/fan-token/${id}`, {
        method: 'DELETE',
        headers: apiClient.getHeaders()
      });
      
      return response;
    } catch (error: any) {
      console.error("Error deleting fan token:", error);
      return { 
        success: false, 
        error: error.message || "Failed to delete fan token" 
      };
    }
  }
};
