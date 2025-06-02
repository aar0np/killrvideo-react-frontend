
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Star, Eye, Clock, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import VideoCard from '@/components/video/VideoCard';

// Mock video data
const videoData = {
  id: '1',
  title: 'Building Scalable Microservices with Node.js',
  creator: 'TechExplorer',
  youtubeId: 'dQw4w9WgXcQ', // Rick Roll for demo
  duration: '15:30',
  views: 125000,
  rating: 4.8,
  userRating: 0,
  tags: ['Node.js', 'Microservices', 'Architecture', 'Backend'],
  uploadDate: '2024-01-15',
  description: 'Learn how to build scalable microservices architecture using Node.js. This comprehensive tutorial covers service discovery, load balancing, and inter-service communication patterns.',
  comments: [
    {
      id: 1,
      user: 'DevFan123',
      text: 'Excellent tutorial! Really helped me understand microservices better.',
      sentiment: 'positive',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      user: 'CodeNewbie',
      text: 'Great explanation but could use more practical examples.',
      sentiment: 'neutral',
      timestamp: '5 hours ago'
    }
  ]
};

const relatedVideos = [
  {
    id: '2',
    title: 'React Performance Optimization Techniques',
    creator: 'DevMaster',
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=225&fit=crop',
    duration: '22:45',
    views: 89000,
    rating: 4.6,
    tags: ['React', 'Performance'],
    uploadDate: '2024-01-10'
  },
  {
    id: '3',
    title: 'Database Design Patterns for Modern Apps',
    creator: 'DataGuru',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=225&fit=crop',
    duration: '18:20',
    views: 156000,
    rating: 4.9,
    tags: ['Database', 'Design Patterns'],
    uploadDate: '2024-01-08'
  }
];

const Watch = () => {
  const { id } = useParams();

  const formatViews = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="aspect-video mb-6 bg-black rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoData.youtubeId}`}
                title={videoData.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Video Info */}
            <div className="mb-6">
              <h1 className="font-sora text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {videoData.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between mb-4">
                <div className="flex items-center space-x-6 text-gray-600 font-noto">
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {formatViews(videoData.views)} views
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {videoData.duration}
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-accent text-accent" />
                    {videoData.rating.toFixed(1)} rating
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Flag className="w-4 h-4 mr-1" />
                    Report
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-b border-gray-200 py-4">
                <div>
                  <h3 className="font-sora font-semibold text-lg text-gray-900">
                    {videoData.creator}
                  </h3>
                  <p className="font-noto text-gray-600">
                    Uploaded on {new Date(videoData.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Star Rating */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-gray-300 hover:text-accent transition-colors"
                    >
                      <Star className={`w-5 h-5 ${star <= videoData.userRating ? 'fill-accent text-accent' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {videoData.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="bg-primary/10 text-primary hover:bg-primary/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="font-sora font-semibold text-lg text-gray-900 mb-2">
                  Description
                </h3>
                <p className="font-noto text-gray-700 leading-relaxed">
                  {videoData.description}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="font-sora font-semibold text-xl text-gray-900 mb-4">
                Comments ({videoData.comments.length})
              </h3>
              
              <div className="space-y-4">
                {videoData.comments.map((comment) => (
                  <Card key={comment.id} className="border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-noto font-semibold text-gray-900">
                            {comment.user}
                          </h4>
                          <Badge 
                            className={`text-xs ${getSentimentColor(comment.sentiment)}`}
                          >
                            {comment.sentiment}
                          </Badge>
                        </div>
                        <span className="font-noto text-sm text-gray-500">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="font-noto text-gray-700">
                        {comment.text}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <h3 className="font-sora font-semibold text-xl text-gray-900 mb-4">
              Related Videos
            </h3>
            
            <div className="space-y-4">
              {relatedVideos.map((video) => (
                <VideoCard key={video.id} {...video} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Watch;
