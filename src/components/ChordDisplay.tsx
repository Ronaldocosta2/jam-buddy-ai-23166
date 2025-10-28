import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChordDiagram } from './ChordDiagram';

interface Chord {
  time: number;
  chord: string;
  duration?: number;
  strumPattern?: string;
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
    <div className="bg-card border-border border-2 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
        Cifras
      </h2>
      
      {chords.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Insira uma URL do YouTube para visualizar as cifras</p>
        </div>
      ) : (
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {chords.map((chord, index) => (
              <div
                key={index}
                className="flex-shrink-0"
              >
                <ChordDiagram 
                  chord={chord.chord} 
                  strumPattern={chord.strumPattern}
                  isActive={index === currentIndex} 
                />
                <div className={`text-center text-xs mt-2 ${
                  index === currentIndex ? 'text-primary font-bold' : 'text-muted-foreground'
                }`}>
                  {Math.floor(chord.time / 60)}:{String(Math.floor(chord.time % 60)).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
