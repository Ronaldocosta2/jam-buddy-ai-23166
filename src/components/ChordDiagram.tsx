interface ChordDiagramProps {
  chord: string;
  strumPattern?: string;
  isActive?: boolean;
}

export const ChordDiagram = ({ chord, strumPattern = 'down', isActive = false }: ChordDiagramProps) => {
  // Guitar chord fingerings with actual fret positions
  const chordPatterns: Record<string, { frets: (number | null)[], name: string }> = {
    'C': { frets: [null, 3, 2, 0, 1, 0], name: 'C' },
    'D': { frets: [null, null, 0, 2, 3, 2], name: 'D' },
    'E': { frets: [0, 2, 2, 1, 0, 0], name: 'E' },
    'F': { frets: [1, 3, 3, 2, 1, 1], name: 'F' },
    'G': { frets: [3, 2, 0, 0, 0, 3], name: 'G' },
    'A': { frets: [null, 0, 2, 2, 2, 0], name: 'A' },
    'B': { frets: [null, 2, 4, 4, 4, 2], name: 'B' },
    'Am': { frets: [null, 0, 2, 2, 1, 0], name: 'Am' },
    'Bm': { frets: [null, 2, 4, 4, 3, 2], name: 'Bm' },
    'Cm': { frets: [null, 3, 5, 5, 4, 3], name: 'Cm' },
    'Dm': { frets: [null, null, 0, 2, 3, 1], name: 'Dm' },
    'Em': { frets: [0, 2, 2, 0, 0, 0], name: 'Em' },
    'Fm': { frets: [1, 3, 3, 1, 1, 1], name: 'Fm' },
    'Gm': { frets: [3, 5, 5, 3, 3, 3], name: 'Gm' },
  };

  const baseChord = chord.replace(/[0-9]|maj|min|sus|dim|aug/gi, '').trim();
  const pattern = chordPatterns[baseChord] || chordPatterns['C'];

  const renderStrumPattern = () => {
    const arrows = strumPattern.split('-').map((dir, idx) => (
      <span key={idx} className={isActive ? 'text-primary-foreground' : 'text-primary'}>
        {dir === 'down' ? '↓' : '↑'}
      </span>
    ));
    return <div className="flex gap-1">{arrows}</div>;
  };

  return (
    <div className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
      isActive 
        ? 'bg-gradient-primary border-primary shadow-glow scale-105' 
        : 'bg-card border-border'
    }`}>
      <div className={`text-xl font-bold mb-2 ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
        {chord}
      </div>
      
      {/* Tablatura */}
      <div className="relative bg-muted/30 rounded p-2 mb-2">
        <div className="flex flex-col gap-[3px]">
          {['e', 'B', 'G', 'D', 'A', 'E'].map((string, stringIdx) => {
            const fretValue = pattern.frets[5 - stringIdx];
            return (
              <div key={stringIdx} className="flex items-center gap-2">
                <span className={`text-xs font-mono w-3 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                  {string}
                </span>
                <div className="flex items-center">
                  <div className={`h-[2px] w-16 ${isActive ? 'bg-primary-foreground/40' : 'bg-foreground/40'}`} />
                  <span className={`absolute ml-1 text-sm font-bold ${
                    fretValue === null 
                      ? isActive ? 'text-destructive-foreground' : 'text-destructive'
                      : isActive ? 'text-primary-foreground' : 'text-primary'
                  }`}>
                    {fretValue === null ? 'x' : fretValue === 0 ? 'o' : fretValue}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strumming pattern */}
      <div className="text-sm font-semibold">
        {renderStrumPattern()}
      </div>
    </div>
  );
};
