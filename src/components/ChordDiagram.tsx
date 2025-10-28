interface ChordDiagramProps {
  chord: string;
  isActive?: boolean;
}

export const ChordDiagram = ({ chord, isActive = false }: ChordDiagramProps) => {
  // Basic chord fingerings for common chords (simplified guitar tab)
  const chordPatterns: Record<string, { frets: number[], fingers: string[] }> = {
    'C': { frets: [3, 3, 2, 0, 1, 0], fingers: ['3', '3', '2', '·', '1', '·'] },
    'D': { frets: [2, 3, 2, 0, -1, -1], fingers: ['1', '3', '2', '·', 'x', 'x'] },
    'E': { frets: [0, 0, 1, 2, 2, 0], fingers: ['·', '·', '1', '3', '2', '·'] },
    'F': { frets: [1, 1, 2, 3, 3, 1], fingers: ['1', '1', '2', '4', '3', '1'] },
    'G': { frets: [3, 0, 0, 0, 2, 3], fingers: ['3', '·', '·', '·', '2', '4'] },
    'A': { frets: [0, 2, 2, 2, 0, -1], fingers: ['·', '2', '3', '4', '·', 'x'] },
    'B': { frets: [2, 4, 4, 4, 2, -1], fingers: ['1', '3', '4', '5', '2', 'x'] },
    'Am': { frets: [0, 1, 2, 2, 0, -1], fingers: ['·', '1', '3', '2', '·', 'x'] },
    'Bm': { frets: [2, 3, 4, 4, 2, -1], fingers: ['1', '2', '4', '3', '1', 'x'] },
    'Cm': { frets: [3, 4, 5, 5, 3, -1], fingers: ['1', '2', '4', '3', '1', 'x'] },
    'Dm': { frets: [1, 3, 2, 0, -1, -1], fingers: ['1', '3', '2', '·', 'x', 'x'] },
    'Em': { frets: [0, 0, 0, 2, 2, 0], fingers: ['·', '·', '·', '2', '3', '·'] },
    'Fm': { frets: [1, 1, 1, 3, 4, 1], fingers: ['1', '1', '1', '3', '4', '1'] },
    'Gm': { frets: [3, 3, 3, 5, 6, 3], fingers: ['1', '1', '1', '3', '4', '1'] },
  };

  // Get base chord (remove suffixes like 7, maj7, etc.)
  const baseChord = chord.replace(/[0-9]|maj|min|sus|dim|aug/gi, '').trim();
  const pattern = chordPatterns[baseChord] || chordPatterns['C']; // Default to C if unknown

  return (
    <div className={`inline-flex flex-col items-center p-2 rounded-lg transition-all ${
      isActive ? 'bg-primary/20' : 'bg-muted/50'
    }`}>
      <div className="text-xs font-bold mb-1 text-foreground">{chord}</div>
      <div className="relative">
        {/* Fretboard */}
        <div className="grid grid-cols-6 gap-[2px] bg-border p-1 rounded">
          {pattern.fingers.map((finger, i) => (
            <div
              key={i}
              className={`w-4 h-5 flex items-center justify-center text-[10px] font-bold rounded ${
                finger === 'x' 
                  ? 'bg-destructive/20 text-destructive'
                  : finger === '·'
                  ? 'bg-primary/20 text-primary'
                  : isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {finger}
            </div>
          ))}
        </div>
        {/* Strings labels */}
        <div className="flex justify-between text-[8px] text-muted-foreground mt-1 px-1">
          <span>E</span>
          <span>A</span>
          <span>D</span>
          <span>G</span>
          <span>B</span>
          <span>e</span>
        </div>
      </div>
    </div>
  );
};
