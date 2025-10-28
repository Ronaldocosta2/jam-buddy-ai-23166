import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChordDiagram } from './ChordDiagram';

interface Chord {
  time: number;
  chord: string;
  duration?: number;
}

interface ChordDisplayProps {
  chords: Chord[];
  currentTime: number;
}

export const ChordDisplay = ({ chords, currentTime }: ChordDisplayProps) => {
  const getCurrentChordIndex = () => {
    for (let i = chords.length - 1; i >= 0; i--) {
      if (currentTime >= chords[i].time) {
        return i;
      }
    }
    return -1;
  };

  const currentIndex = getCurrentChordIndex();

  return (
    <Card className="h-full bg-card border-border shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
          Cifras
        </h2>
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {chords.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">Insira uma URL do YouTube para visualizar as cifras</p>
              </div>
            ) : (
              chords.map((chord, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gradient-primary scale-105 shadow-glow'
                      : index < currentIndex
                      ? 'bg-muted/30 opacity-60'
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-3xl font-bold ${
                        index === currentIndex ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {chord.chord}
                    </span>
                    <span
                      className={`text-sm ${
                        index === currentIndex ? 'text-white/80' : 'text-muted-foreground'
                      }`}
                    >
                      {Math.floor(chord.time / 60)}:{String(Math.floor(chord.time % 60)).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex justify-center">
                    <ChordDiagram chord={chord.chord} isActive={index === currentIndex} />
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
