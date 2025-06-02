
import VideoCard from '@/components/video/VideoCard';

// Mock data for featured videos
const featuredVideos = [
  {
    id: '1',
    title: 'Building Scalable Microservices with Node.js',
    creator: 'TechExplorer',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=225&fit=crop',
    duration: '15:30',
    views: 125000,
    rating: 4.8,
    tags: ['Node.js', 'Microservices', 'Architecture'],
    uploadDate: '2024-01-15'
  },
  {
    id: '2',
    title: 'React Performance Optimization Techniques',
    creator: 'DevMaster',
    thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=225&fit=crop',
    duration: '22:45',
    views: 89000,
    rating: 4.6,
    tags: ['React', 'Performance', 'JavaScript'],
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
    tags: ['Database', 'Design Patterns', 'SQL'],
    uploadDate: '2024-01-08'
  },
  {
    id: '4',
    title: 'Container Orchestration with Kubernetes',
    creator: 'CloudNinja',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop',
    duration: '28:15',
    views: 203000,
    rating: 4.7,
    tags: ['Kubernetes', 'DevOps', 'Containers'],
    uploadDate: '2024-01-05'
  },
  {
    id: '5',
    title: 'AI-Powered Video Analytics',
    creator: 'MLExperte',
    thumbnail: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=225&fit=crop',
    duration: '25:10',
    views: 178000,
    rating: 4.5,
    tags: ['AI', 'Machine Learning', 'Analytics'],
    uploadDate: '2024-01-03'
  },
  {
    id: '6',
    title: 'Distributed Systems Architecture',
    creator: 'SystemDesigner',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=225&fit=crop',
    duration: '32:40',
    views: 245000,
    rating: 4.8,
    tags: ['Distributed Systems', 'Architecture', 'Scalability'],
    uploadDate: '2024-01-01'
  }
];

const FeaturedVideos = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-sora text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Videos
          </h2>
          <p className="font-noto text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest and most popular content from our community of developers and creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="font-noto text-primary hover:text-purple-800 font-semibold text-lg transition-colors">
            View All Videos →
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVideos;
