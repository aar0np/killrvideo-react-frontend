
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Video, Comment, User } from '@/types/api';

// Video hooks
export const useLatestVideos = () => {
  return useQuery({
    queryKey: ['videos', 'latest'],
    queryFn: () => apiClient.getLatestVideos(),
  });
};

export const useVideo = (videoId: string) => {
  return useQuery({
    queryKey: ['videos', videoId],
    queryFn: () => apiClient.getVideo(videoId),
    enabled: !!videoId,
  });
};

export const useVideosByUser = (userId: string) => {
  return useQuery({
    queryKey: ['videos', 'user', userId],
    queryFn: () => apiClient.getVideosByUser(userId),
    enabled: !!userId,
  });
};

export const useSubmitVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiClient.submitVideo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};

export const useRecordView = () => {
  return useMutation({
    mutationFn: (videoId: string) => apiClient.recordView(videoId),
  });
};

// Comment hooks
export const useComments = (videoId: string) => {
  return useQuery({
    queryKey: ['comments', videoId],
    queryFn: () => apiClient.getComments(videoId),
    enabled: !!videoId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ videoId, text }: { videoId: string; text: string }) =>
      apiClient.addComment(videoId, text),
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', videoId] });
    },
  });
};

// Rating hooks
export const useRatings = (videoId: string) => {
  return useQuery({
    queryKey: ['ratings', videoId],
    queryFn: () => apiClient.getRatings(videoId),
    enabled: !!videoId,
  });
};

export const useRateVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ videoId, rating }: { videoId: string; rating: number }) =>
      apiClient.rateVideo(videoId, rating),
    onSuccess: (_, { videoId }) => {
      queryClient.invalidateQueries({ queryKey: ['ratings', videoId] });
      queryClient.invalidateQueries({ queryKey: ['videos', videoId] });
    },
  });
};

// Search hooks
export const useSearchVideos = (params: any) => {
  return useQuery({
    queryKey: ['search', 'videos', params],
    queryFn: () => apiClient.searchVideos(params),
    enabled: !!params.query || !!params.tags?.length,
  });
};

export const useTagSuggestions = () => {
  return useQuery({
    queryKey: ['tags', 'suggestions'],
    queryFn: () => apiClient.getTagSuggestions(),
  });
};

// Recommendation hooks
export const useRelatedVideos = (videoId: string) => {
  return useQuery({
    queryKey: ['recommendations', 'related', videoId],
    queryFn: () => apiClient.getRelatedVideos(videoId),
    enabled: !!videoId,
  });
};

export const usePersonalizedRecommendations = () => {
  return useQuery({
    queryKey: ['recommendations', 'foryou'],
    queryFn: () => apiClient.getPersonalizedRecommendations(),
  });
};

// Auth hooks
export const useProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => apiClient.getProfile(),
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      apiClient.login(email, password),
    onSuccess: (data: any) => {
      if (data.token) {
        apiClient.setToken(data.token);
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: ({ username, email, password }: { username: string; email: string; password: string }) =>
      apiClient.register(username, email, password),
    onSuccess: (data: any) => {
      if (data.token) {
        apiClient.setToken(data.token);
      }
    },
  });
};
