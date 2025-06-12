
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VideoCardProps {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  duration: string;
  views: number;
  rating: number;
  tags: string[];
  uploadDate: string;
}

const VideoCard = ({ 
  id, 
  title, 
  creator, 
  thumbnail, 
  duration, 
  views, 
  rating, 
  tags, 
  uploadDate 
}: VideoCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatViews = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const uploadTime = new Date(date);
    const diffTime = Math.abs(now.getTime() - uploadTime.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white border-gray-200 hover:border-primary/20">
      <Link to={`/watch/${id}`}>
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <img
            src={thumbnail}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-noto">
            <Clock className="w-3 h-3 inline mr-1" />
            {duration}
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link to={`/watch/${id}`}>
          <h3 className="font-sora font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 font-noto mb-3">{creator}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3 font-noto">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {formatViews(views)}
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1 fill-accent text-accent" />
              {rating.toFixed(1)}
            </span>
          </div>
          <span>{getTimeAgo(uploadDate)}</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
