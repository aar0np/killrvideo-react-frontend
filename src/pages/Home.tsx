
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedVideos from '@/components/home/FeaturedVideos';
import StatsSection from '@/components/home/StatsSection';

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedVideos />
      <StatsSection />
    </Layout>
  );
};

export default Home;
