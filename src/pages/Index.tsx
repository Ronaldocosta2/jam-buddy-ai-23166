import { useState } from 'react';
import { Tuner } from '@/components/Tuner';
import { URLInput } from '@/components/URLInput';
import { YouTubePlayer } from '@/components/YouTubePlayer';
import { ChordDisplay } from '@/components/ChordDisplay';
import { Lyrics } from '@/components/Lyrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music2, Radio } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [videoId, setVideoId] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [chords, setChords] = useState<any[]>([]);
  const [lyrics, setLyrics] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleURLSubmit = async (id: string) => {
    setIsLoading(true);
    setVideoId(id);
    setChords([]);
    
    try {
      console.log('Extracting chords for video:', id);
      
      const { data, error } = await supabase.functions.invoke('extract-chords', {
        body: { videoId: id }
      });

      if (error) {
        console.error('Error extracting chords:', error);
        toast({
          title: 'Erro ao extrair cifras',
          description: error.message || 'Não foi possível processar o vídeo',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      console.log('Data extracted:', data);
      
      if (data?.chords) {
        setChords(data.chords);
      }
      
      if (data?.lyrics) {
        setLyrics(data.lyrics);
      }
      
      toast({
        title: 'Conteúdo extraído!',
        description: `${data.chords?.length || 0} acordes e letra identificados`,
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: 'Erro inesperado',
        description: 'Ocorreu um erro ao processar o vídeo',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
              <div className="space-y-4">
                <div className="grid lg:grid-cols-[400px_1fr] gap-6">
                  {/* Video player - pequeno */}
                  <div className="space-y-4">
                    <YouTubePlayer
                      videoId={videoId}
                      onTimeUpdate={setCurrentTime}
                    />
                  </div>
                  
                  {/* Lyrics - direita */}
                  <div>
                    <Lyrics lyrics={lyrics} />
                  </div>
                </div>
                
                {/* Chords - horizontal embaixo */}
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
