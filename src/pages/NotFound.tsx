
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-800 to-purple-900 flex items-center justify-center p-4">
      {/* Animated background triangles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[40px] border-b-white/10 animate-triangle-float"></div>
        <div className="absolute top-40 right-32 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[25px] border-b-accent/20 animate-triangle-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[35px] border-b-white/5 animate-triangle-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative text-center text-white max-w-md mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8 group">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[12px] border-b-primary"></div>
          </div>
          <span className="font-sora text-2xl font-bold">
            KillrVideo
          </span>
        </Link>

        <div className="mb-8">
          <h1 className="font-sora text-6xl md:text-8xl font-bold mb-4 animate-fade-in">
            404
          </h1>
          <h2 className="font-sora text-2xl md:text-3xl font-semibold mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Page Not Found
          </h2>
          <p className="font-noto text-lg text-purple-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            The video or page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Link to="/">
            <Button size="lg" className="bg-accent text-black hover:bg-accent/90 font-noto">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-noto"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
