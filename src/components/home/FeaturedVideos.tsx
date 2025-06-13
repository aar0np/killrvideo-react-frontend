import VideoCard from '@/components/video/VideoCard';
import { useLatestVideos } from '@/hooks/useApi';
import { VideoSummary } from '@/types/api';

const placeholderThumb = 'https://placehold.co/400x225?text=Video';

const FeaturedVideos = () => {
  const { data, isLoading, isError } = useLatestVideos(1, 9);
  const videos = (data?.data ?? []) as VideoSummary[];
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

        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load videos.</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-muted-foreground">No videos available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.videoId}
                id={video.videoId}
                title={video.title}
                creator={video.userId}
                thumbnail={video.thumbnailUrl || placeholderThumb}
                duration=""
                views={((video as any).views ?? (video as any).viewCount) as number}
                rating={video.averageRating ?? 0}
                tags={[]} // Tags not available in summary
                uploadDate={video.submittedAt}
              />
            ))}
          </div>
        )}

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
