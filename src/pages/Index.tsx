import { useState } from 'react';
import { Tuner } from '@/components/Tuner';
import { URLInput } from '@/components/URLInput';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { ChordDisplay } from '@/components/ChordDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music2, Radio } from 'lucide-react';

// Mock chord data - will be replaced with actual API data
const mockChords = [
  { time: 0, chord: 'C', duration: 4 },
  { time: 4, chord: 'Am', duration: 4 },
  { time: 8, chord: 'F', duration: 4 },
  { time: 12, chord: 'G', duration: 4 },
  { time: 16, chord: 'C', duration: 4 },
  { time: 20, chord: 'Em', duration: 4 },
  { time: 24, chord: 'Am', duration: 4 },
  { time: 28, chord: 'G', duration: 4 },
];

const Index = () => {
  const [videoId, setVideoId] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [chords, setChords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleURLSubmit = async (id: string) => {
    setIsLoading(true);
    setVideoId(id);
    
    // Simulate API call - will be replaced with actual backend call
    setTimeout(() => {
      setChords(mockChords);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Music2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ChordSync
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="player" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="player" className="space-x-2">
              <Music2 className="h-4 w-4" />
              <span>Player</span>
            </TabsTrigger>
            <TabsTrigger value="tuner" className="space-x-2">
              <Radio className="h-4 w-4" />
              <span>Afinador</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="player" className="space-y-6 animate-fade-in">
            {!videoId ? (
              <div className="max-w-2xl mx-auto">
                <URLInput onSubmit={handleURLSubmit} isLoading={isLoading} />
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <YouTubePlayer
                    videoId={videoId}
                    onTimeUpdate={setCurrentTime}
                  />
                  <div className="flex justify-center">
                    <URLInput onSubmit={handleURLSubmit} isLoading={isLoading} />
                  </div>
                </div>
                <div>
                  <ChordDisplay chords={chords} currentTime={currentTime} />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tuner" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <Tuner />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          <p>ChordSync - Sua plataforma completa para músicos</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
