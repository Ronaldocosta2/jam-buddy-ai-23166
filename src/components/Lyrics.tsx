import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LyricsProps {
  lyrics: string;
}

export const Lyrics = ({ lyrics }: LyricsProps) => {
  return (
    <Card className="h-full bg-card border-border">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Letra
        </h2>
        
        <ScrollArea className="h-[600px] pr-4">
          {lyrics ? (
            <div className="text-foreground whitespace-pre-line leading-relaxed">
              {lyrics}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">A letra será exibida aqui após processar o vídeo</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </Card>
  );
};
