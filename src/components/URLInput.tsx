import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Music, Youtube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface URLInputProps {
  onSubmit: (videoId: string) => void;
  isLoading?: boolean;
}

export const URLInput = ({ onSubmit, isLoading }: URLInputProps) => {
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: 'URL necessária',
        description: 'Por favor, insira uma URL do YouTube',
        variant: 'destructive',
      });
      return;
    }

    const videoId = extractVideoId(url);
    
    if (!videoId) {
      toast({
        title: 'URL inválida',
        description: 'Por favor, insira uma URL válida do YouTube',
        variant: 'destructive',
      });
      return;
    }

    onSubmit(videoId);
  };

  return (
    <Card className="p-8 bg-card border-border shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-primary rounded-full">
              <Music className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Cole a URL do YouTube
          </h2>
          <p className="text-muted-foreground">
            Vamos processar a música e exibir as cifras sincronizadas
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-12 bg-background border-border focus:ring-primary"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-primary hover:opacity-90 text-white font-semibold text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Processando...' : 'Buscar Cifras'}
          </Button>
        </div>

        <div className="text-xs text-center text-muted-foreground">
          <p>Exemplo: https://www.youtube.com/watch?v=dQw4w9WgXcQ</p>
        </div>
      </form>
    </Card>
  );
};
