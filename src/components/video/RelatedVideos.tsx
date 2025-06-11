import { useRelatedVideos } from '@/hooks/useApi';
import VideoCard from './VideoCard';

interface RelatedVideosProps {
  videoId: string;
  limit?: number;
}

const RelatedVideos = ({ videoId, limit = 5 }: RelatedVideosProps) => {
  const { data: related, isLoading, isError } = useRelatedVideos(videoId, limit);

  if (isLoading) return <p>Loading related videos…</p>;
  if (isError || !related?.length) return <p>No related videos found.</p>;

  return (
    <div className="space-y-4">
      {related.map((item) => (
        <VideoCard
          key={item.videoId}
          id={item.videoId}
          title={item.title}
          creator={''}
          thumbnail={item.thumbnailUrl ?? ''}
          duration={''}
          views={item.score ?? 0}
          rating={0}
          tags={[]}
          uploadDate={''}
        />
      ))}
    </div>
  );
};

export default RelatedVideos; 