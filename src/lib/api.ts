
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
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

  async register(firstName: string, lastName: string, email: string, password: string) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password }),
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
    return this.request(`/videos/id/${videoId}`);
  }

  async getVideoStatus(videoId: string) {
    return this.request(`/videos/id/${videoId}/status`);
  }

  async updateVideo(videoId: string, data: any) {
    return this.request(`/videos/id/${videoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async recordView(videoId: string) {
    return this.request(`/videos/id/${videoId}/view`, {
      method: 'POST',
    });
  }

  async getLatestVideos(page: number = 1, pageSize: number = 10) {
    return this.request(`/videos/latest?page=${page}&pageSize=${pageSize}`);
  }

  async getVideosByTag(tag: string, page: number = 1, pageSize: number = 10) {
    return this.request(`/videos/by-tag/${tag}?page=${page}&pageSize=${pageSize}`);
  }

  async getVideosByUser(userId: string, page: number = 1, pageSize: number = 10) {
    return this.request(`/videos/by-uploader/${userId}?page=${page}&pageSize=${pageSize}`);
  }

  // Comment endpoints
  async addComment(videoId: string, text: string) {
    return this.request(`/videos/${videoId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async getComments(videoId: string, page: number = 1, pageSize: number = 10) {
    return this.request(`/videos/${videoId}/comments?page=${page}&pageSize=${pageSize}`);
  }

  async getCommentsByUser(userId: string, page: number = 1, pageSize: number = 10) {
    return this.request(`/users/${userId}/comments?page=${page}&pageSize=${pageSize}`);
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

  async getVideoRating(videoId: string) {
    return this.request(`/videos/id/${videoId}/rating`);
  }

  // Search endpoints
  async searchVideos(params: any) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/search/videos?${queryString}`);
  }

  async getTagSuggestions(query: string, limit: number = 10) {
    return this.request(`/search/tags/suggest?query=${query}&limit=${limit}`);
  }

  // Recommendation endpoints
  async getRelatedVideos(videoId: string, limit: number = 5) {
    return this.request(`/videos/id/${videoId}/related?limit=${limit}`);
  }

  async getPersonalizedRecommendations(page: number = 1, pageSize: number = 10) {
    return this.request(`/recommendations/foryou?page=${page}&pageSize=${pageSize}`);
  }

  // Moderation endpoints
  async flagContent(data: any) {
    return this.request('/flags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getModerationFlags(status?: string, page: number = 1, pageSize: number = 10) {
    const params = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
    if (status) params.append('status', status);
    return this.request(`/moderation/flags?${params.toString()}`);
  }

  async getFlagDetails(flagId: string) {
    return this.request(`/moderation/flags/${flagId}`);
  }

  async actionFlag(flagId: string, status: string, moderatorNotes?: string) {
    return this.request(`/moderation/flags/${flagId}/action`, {
      method: 'POST',
      body: JSON.stringify({ status, moderatorNotes }),
    });
  }

  async searchUsers(query?: string) {
    const params = query ? `?q=${encodeURIComponent(query)}` : '';
    return this.request(`/moderation/users${params}`);
  }

  async assignModerator(userId: string) {
    return this.request(`/moderation/users/${userId}/assign-moderator`, {
      method: 'POST',
    });
  }

  async revokeModerator(userId: string) {
    return this.request(`/moderation/users/${userId}/revoke-moderator`, {
      method: 'POST',
    });
  }

  async restoreVideo(videoId: string) {
    return this.request(`/moderation/videos/${videoId}/restore`, {
      method: 'POST',
    });
  }

  async restoreComment(commentId: string) {
    return this.request(`/moderation/comments/${commentId}/restore`, {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
