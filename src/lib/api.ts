
import { ApiError } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw error;
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(username: string, email: string, password: string) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async getProfile() {
    return this.request('/users/me');
  }

  async updateProfile(data: any) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Video endpoints
  async submitVideo(data: any) {
    return this.request('/videos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getVideo(videoId: string) {
    return this.request(`/videos/${videoId}`);
  }

  async getVideoStatus(videoId: string) {
    return this.request(`/videos/${videoId}/status`);
  }

  async updateVideo(videoId: string, data: any) {
    return this.request(`/videos/${videoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async recordView(videoId: string) {
    return this.request(`/videos/${videoId}/view`, {
      method: 'POST',
    });
  }

  async getLatestVideos() {
    return this.request('/videos/latest');
  }

  async getVideosByTag(tag: string) {
    return this.request(`/videos/by-tag/${tag}`);
  }

  async getVideosByUser(userId: string) {
    return this.request(`/users/${userId}/videos`);
  }

  // Comment endpoints
  async addComment(videoId: string, text: string) {
    return this.request(`/videos/${videoId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async getComments(videoId: string) {
    return this.request(`/videos/${videoId}/comments`);
  }

  async getCommentsByUser(userId: string) {
    return this.request(`/users/${userId}/comments`);
  }

  // Rating endpoints
  async rateVideo(videoId: string, rating: number) {
    return this.request(`/videos/${videoId}/ratings`, {
      method: 'POST',
      body: JSON.stringify({ rating }),
    });
  }

  async getRatings(videoId: string) {
    return this.request(`/videos/${videoId}/ratings`);
  }

  // Search endpoints
  async searchVideos(params: any) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/search/videos?${queryString}`);
  }

  async getTagSuggestions() {
    return this.request('/tags/suggest');
  }

  // Recommendation endpoints
  async getRelatedVideos(videoId: string) {
    return this.request(`/videos/${videoId}/related`);
  }

  async getPersonalizedRecommendations() {
    return this.request('/recommendations/foryou');
  }

  // Moderation endpoints
  async flagVideo(videoId: string, reason: string, description: string) {
    return this.request(`/videos/${videoId}/flags`, {
      method: 'POST',
      body: JSON.stringify({ reason, description }),
    });
  }

  async getFlags(videoId: string) {
    return this.request(`/videos/${videoId}/flags`);
  }

  async getModerationFlags() {
    return this.request('/moderation/flags');
  }

  async getFlagDetails(flagId: string) {
    return this.request(`/moderation/flags/${flagId}`);
  }

  async actionFlag(flagId: string, action: string) {
    return this.request(`/moderation/flags/${flagId}/action`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
