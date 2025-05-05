
const API_BASE_URL = 'https://apimvp.back2.fan';


class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }


  getToken(): string | null {
    return this.token;
  }


  isAuthenticated(): boolean {
    return !!this.token;
  }


  getHeaders(includeContentType = true): HeadersInit {
    const headers: HeadersInit = {};
    
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }


  async fetchWithErrorHandling<T>(
    endpoint: string, 
    options: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          this.setToken(null);
          throw new Error('Unauthorized: Session expired');
        }
        
        throw new Error(
          errorData.error || 
          `API Error: ${response.status} ${response.statusText}`
        );
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('API Error:', error);
      throw error;
    }
  }


  async healthCheck(): Promise<{ success: boolean; message: string }> {
    return this.fetchWithErrorHandling('/api', {
      method: 'GET',
      headers: this.getHeaders()
    });
  }


  async checkUser(address: string): Promise<{ success: boolean; exists: boolean }> {
    return this.fetchWithErrorHandling('/api/check-user', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ address })
    });
  }


  async registerUserData(
    address: string,
    firstName: string,
    lastName: string,
    email: string,
    signature: string
  ): Promise<{ success: boolean; message: string }> {
    return this.fetchWithErrorHandling('/api/register-user-data', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        address,
        first_name: firstName,
        last_name: lastName,
        email,
        signature
      })
    });
  }


  async login(
    address: string,
    signature: string
  ): Promise<{ success: boolean; token: string }> {
    const response = await this.fetchWithErrorHandling<{ success: boolean; token: string }>('/api/login', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        address,
        signature
      })
    });
    
    if (response.success && response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }


  async getCurrentUser(): Promise<{ 
    success: boolean; 
    data: { 
      first_name: string; 
      last_name: string; 
      email: string;
      wallet: string;
      nativeBalance: string;
      tokens: Array<{
        contract: string;
        name: string;
        symbol: string;
        decimals: string;
        balance: string;
      }>;
      nfts: Array<{
        tokenId: string;
        contract: string;
        name: string;
        symbol: string;
        txHash: string;
      }>;
    } 
  }> {
    return this.fetchWithErrorHandling('/api/me', {
      method: 'GET',
      headers: this.getHeaders()
    });
  }


  async registerPurchase(
    user: string,
    storeId: number,
    amount: number
  ): Promise<{ success: boolean; txHash: string }> {
    return this.fetchWithErrorHandling('/api/register-purchase', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        user,
        store_id: storeId,
        amount
      })
    });
  }


  async mintNFT(
    user: string,
    purchaseId: number,
    metadataURI: string
  ): Promise<{ success: boolean; txHash: string }> {
    return this.fetchWithErrorHandling('/api/mint-nft', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        user,
        purchase_id: purchaseId,
        metadata_uri: metadataURI
      })
    });
  }


  async confirmPurchase(
    purchaseId: number
  ): Promise<{ success: boolean; txHash: string }> {
    return this.fetchWithErrorHandling('/api/confirm-purchase', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        purchase_id: purchaseId
      })
    });
  }


  async distributeCashback(
    user: string,
    amount: number
  ): Promise<{ success: boolean; txHash: string }> {
    return this.fetchWithErrorHandling('/api/distribute-cashback', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        user,
        amount
      })
    });
  }
}


export const apiClient = new ApiClient();
