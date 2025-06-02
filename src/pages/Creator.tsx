
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Star, Upload, TrendingUp } from 'lucide-react';
import { useSubmitVideo, useProfile, useVideosByUser } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { Video, User } from '@/types/api';

const Creator = () => {
  const [uploadForm, setUploadForm] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    tags: ''
  });

  const { data: profile } = useProfile();
  const { data: userVideos, isLoading: videosLoading } = useVideosByUser((profile as User)?.id || '');
  const submitVideoMutation = useSubmitVideo();
  const { toast } = useToast();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const videoData = {
        title: uploadForm.title,
        description: uploadForm.description,
        youtubeUrl: uploadForm.youtubeUrl,
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      await submitVideoMutation.mutateAsync(videoData);
      
      toast({
        title: "Video uploaded successfully!",
        description: "Your video is being processed and will be available soon.",
      });

      // Reset form
      setUploadForm({
        title: '',
        youtubeUrl: '',
        description: '',
        tags: ''
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.detail || "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatViews = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const videos = (userVideos as Video[]) || [];

  const getTotalViews = () => {
    return videos.reduce((total: number, video: Video) => total + video.views, 0);
  };

  const getAverageRating = () => {
    if (!videos.length) return 0;
    const totalRating = videos.reduce((total: number, video: Video) => total + video.rating, 0);
    return (totalRating / videos.length).toFixed(1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-sora text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Creator Dashboard
          </h1>
          <p className="font-noto text-lg text-gray-600">
            Manage your videos and track performance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-sora flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload New Video
                </CardTitle>
                <CardDescription className="font-noto">
                  Add a new video to your collection by providing a YouTube URL
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="font-noto">Video Title</Label>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter video title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      required
                      className="font-noto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtubeUrl" className="font-noto">YouTube URL</Label>
                    <Input
                      id="youtubeUrl"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={uploadForm.youtubeUrl}
                      onChange={(e) => setUploadForm({ ...uploadForm, youtubeUrl: e.target.value })}
                      required
                      className="font-noto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="font-noto">Description</Label>
                    <Input
                      id="description"
                      type="text"
                      placeholder="Brief description of your video"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      className="font-noto"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags" className="font-noto">Tags</Label>
                    <Input
                      id="tags"
                      type="text"
                      placeholder="React, Node.js, TypeScript (comma separated)"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                      className="font-noto"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-purple-800 font-noto"
                    disabled={submitVideoMutation.isPending}
                  >
                    {submitVideoMutation.isPending ? 'Uploading...' : 'Upload Video'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Video Management */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sora">Your Videos</CardTitle>
                <CardDescription className="font-noto">
                  Manage and track your uploaded content
                </CardDescription>
              </CardHeader>
              <CardContent>
                {videosLoading ? (
                  <div className="text-center py-8 font-noto text-gray-600">
                    Loading your videos...
                  </div>
                ) : videos.length ? (
                  <div className="space-y-4">
                    {videos.map((video: Video) => (
                      <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-sora font-semibold text-gray-900 mb-1">
                            {video.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 font-noto">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {formatViews(video.views)} views
                            </span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1 fill-accent text-accent" />
                              {video.rating.toFixed(1)}
                            </span>
                            <span>
                              {new Date(video.uploadDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="secondary" 
                            className={
                              video.status === 'published' 
                                ? 'bg-green-100 text-green-800'
                                : video.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {video.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 font-noto text-gray-600">
                    No videos uploaded yet. Upload your first video above!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="font-sora flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-noto text-sm text-gray-600">Total Views</div>
                    <div className="font-sora text-2xl font-bold text-gray-900">
                      {formatViews(getTotalViews())}
                    </div>
                  </div>
                  <div>
                    <div className="font-noto text-sm text-gray-600">Average Rating</div>
                    <div className="font-sora text-2xl font-bold text-gray-900">
                      {getAverageRating()}
                    </div>
                  </div>
                  <div>
                    <div className="font-noto text-sm text-gray-600">Videos Published</div>
                    <div className="font-sora text-2xl font-bold text-gray-900">
                      {videos.filter((v: Video) => v.status === 'published').length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-sora">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start font-noto">
                  View Public Profile
                </Button>
                <Button variant="outline" className="w-full justify-start font-noto">
                  Analytics Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start font-noto">
                  Content Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Creator;
