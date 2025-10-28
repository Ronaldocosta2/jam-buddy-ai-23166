import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';

interface YouTubePlayerProps {
  videoId: string;
  onTimeUpdate?: (currentTime: number) => void;
}

export const YouTubePlayer = ({ videoId, onTimeUpdate }: YouTubePlayerProps) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      setIsReady(true);
    };

    if ((window as any).YT && (window as any).YT.Player) {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady || !videoId) return;

    playerRef.current = new (window as any).YT.Player('youtube-player', {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 1,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          // Start time update interval
          const interval = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
              const currentTime = playerRef.current.getCurrentTime();
              onTimeUpdate?.(currentTime);
            }
          }, 100);

          return () => clearInterval(interval);
        },
      },
    });

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [isReady, videoId, onTimeUpdate]);

  return (
    <Card className="overflow-hidden bg-card border-border shadow-lg">
      <div ref={containerRef} className="relative w-full pt-[56.25%]">
        <div 
          id="youtube-player"
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </Card>
  );
};
