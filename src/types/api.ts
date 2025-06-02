
// Core data types based on OpenAPI spec
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  role?: 'user' | 'moderator' | 'admin';
}

export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeId: string;
  creatorId: string;
  creator: string;
  duration: string;
  views: number;
  rating: number;
  tags: string[];
  uploadDate: string;
  status: 'pending' | 'published' | 'rejected';
  thumbnail?: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  user: string;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
  createdAt: string;
}

export interface Rating {
  videoId: string;
  userId: string;
  rating: number;
  createdAt: string;
}

export interface Flag {
  id: string;
  videoId?: string;
  commentId?: string;
  userId: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface VideoSubmitRequest {
  title: string;
  description: string;
  youtubeUrl: string;
  tags: string[];
}

export interface CommentRequest {
  text: string;
}

export interface RatingRequest {
  rating: number;
}

export interface FlagRequest {
  reason: string;
  description: string;
}

export interface SearchParams {
  query?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
}
