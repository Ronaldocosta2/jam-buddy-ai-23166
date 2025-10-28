interface ChordDiagramProps {
  chord: string;
  strumPattern?: string;
  isActive?: boolean;
}

export const ChordDiagram = ({ chord, strumPattern = 'down', isActive = false }: ChordDiagramProps) => {
  // Guitar chord fingerings with fret positions and finger numbers
  // Format: [string, fret, finger] - finger: 0=open, -1=muted, 1-4=fingers
  const chordPatterns: Record<string, { positions: Array<{ string: number; fret: number; finger: number }>, muted: number[] }> = {
    'C': { 
      positions: [
        { string: 5, fret: 3, finger: 3 },
        { string: 4, fret: 2, finger: 2 },
        { string: 2, fret: 1, finger: 1 }
      ],
      muted: [6]
    },
    'D': { 
      positions: [
        { string: 3, fret: 2, finger: 1 },
        { string: 2, fret: 3, finger: 3 },
        { string: 1, fret: 2, finger: 2 }
      ],
      muted: [6, 5]
    },
    'E': { 
      positions: [
        { string: 5, fret: 2, finger: 2 },
        { string: 4, fret: 2, finger: 3 },
        { string: 3, fret: 1, finger: 1 }
      ],
      muted: []
    },
    'F': { 
      positions: [
        { string: 6, fret: 1, finger: 1 },
        { string: 5, fret: 3, finger: 3 },
        { string: 4, fret: 3, finger: 4 },
        { string: 3, fret: 2, finger: 2 },
        { string: 2, fret: 1, finger: 1 },
        { string: 1, fret: 1, finger: 1 }
      ],
      muted: []
    },
    'G': { 
      positions: [
        { string: 6, fret: 3, finger: 2 },
        { string: 5, fret: 2, finger: 1 },
        { string: 1, fret: 3, finger: 3 }
      ],
      muted: []
    },
    'A': { 
      positions: [
        { string: 4, fret: 2, finger: 1 },
        { string: 3, fret: 2, finger: 2 },
        { string: 2, fret: 2, finger: 3 }
      ],
      muted: [6]
    },
    'B': { 
      positions: [
        { string: 5, fret: 2, finger: 1 },
        { string: 4, fret: 4, finger: 2 },
        { string: 3, fret: 4, finger: 3 },
        { string: 2, fret: 4, finger: 4 },
        { string: 1, fret: 2, finger: 1 }
      ],
      muted: [6]
    },
    'Am': { 
      positions: [
        { string: 4, fret: 2, finger: 2 },
        { string: 3, fret: 2, finger: 3 },
        { string: 2, fret: 1, finger: 1 }
      ],
      muted: [6]
    },
    'Bm': { 
      positions: [
        { string: 5, fret: 2, finger: 1 },
        { string: 4, fret: 4, finger: 3 },
        { string: 3, fret: 4, finger: 4 },
        { string: 2, fret: 3, finger: 2 },
        { string: 1, fret: 2, finger: 1 }
      ],
      muted: [6]
    },
    'Cm': { 
      positions: [
        { string: 5, fret: 3, finger: 1 },
        { string: 4, fret: 5, finger: 3 },
        { string: 3, fret: 5, finger: 4 },
        { string: 2, fret: 4, finger: 2 },
        { string: 1, fret: 3, finger: 1 }
      ],
      muted: [6]
    },
    'Dm': { 
      positions: [
        { string: 3, fret: 2, finger: 1 },
        { string: 2, fret: 3, finger: 3 },
        { string: 1, fret: 1, finger: 2 }
      ],
      muted: [6, 5]
    },
    'Em': { 
      positions: [
        { string: 5, fret: 2, finger: 2 },
        { string: 4, fret: 2, finger: 3 }
      ],
      muted: []
    },
    'Fm': { 
      positions: [
        { string: 6, fret: 1, finger: 1 },
        { string: 5, fret: 3, finger: 3 },
        { string: 4, fret: 3, finger: 4 },
        { string: 3, fret: 1, finger: 1 },
        { string: 2, fret: 1, finger: 1 },
        { string: 1, fret: 1, finger: 1 }
      ],
      muted: []
    },
    'Gm': { 
      positions: [
        { string: 6, fret: 3, finger: 1 },
        { string: 5, fret: 5, finger: 3 },
        { string: 4, fret: 5, finger: 4 },
        { string: 3, fret: 3, finger: 1 },
        { string: 2, fret: 3, finger: 1 },
        { string: 1, fret: 3, finger: 1 }
      ],
      muted: []
    },
  };

  const baseChord = chord.replace(/[0-9]|maj|min|sus|dim|aug/gi, '').trim();
  const pattern = chordPatterns[baseChord] || chordPatterns['C'];

  const renderStrumPattern = () => {
    const arrows = strumPattern.split('-').map((dir, idx) => (
      <span key={idx} className={isActive ? 'text-primary-foreground' : 'text-primary'}>
        {dir === 'down' ? '↓' : '↑'}
      </span>
    ));
    return <div className="flex gap-1 justify-center">{arrows}</div>;
  };

  const FRET_COUNT = 5;
  const STRING_COUNT = 6;

  return (
    <div className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
      isActive 
        ? 'bg-gradient-primary border-primary shadow-glow scale-105' 
        : 'bg-card border-border'
    }`}>
      <div className={`text-lg font-bold mb-3 ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
        {chord}
      </div>
      
      {/* Chord Diagram - Traditional Grid Style */}
      <div className="relative">
        {/* String markers at top (x or o) */}
        <div className="flex justify-between mb-1 px-1" style={{ width: '80px' }}>
          {Array.from({ length: STRING_COUNT }).map((_, stringIdx) => {
            const stringNum = STRING_COUNT - stringIdx;
            const isMuted = pattern.muted.includes(stringNum);
            const isOpen = !isMuted && !pattern.positions.some(p => p.string === stringNum);
            return (
              <div 
                key={stringIdx} 
                className={`text-xs font-bold w-3 text-center ${
                  isMuted 
                    ? isActive ? 'text-destructive-foreground' : 'text-destructive'
                    : isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}
              >
                {isMuted ? '×' : isOpen ? '○' : ''}
              </div>
            );
          })}
        </div>

        {/* Fretboard Grid */}
        <svg width="80" height="100" className="block">
          {/* Nut (top thick line) */}
          <line 
            x1="5" y1="5" x2="75" y2="5" 
            stroke={isActive ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))'} 
            strokeWidth="3"
          />
          
          {/* Vertical strings */}
          {Array.from({ length: STRING_COUNT }).map((_, i) => (
            <line 
              key={`string-${i}`}
              x1={5 + i * 14} 
              y1="5" 
              x2={5 + i * 14} 
              y2="95" 
              stroke={isActive ? 'hsl(var(--primary-foreground) / 0.4)' : 'hsl(var(--foreground) / 0.4)'} 
              strokeWidth="1"
            />
          ))}
          
          {/* Horizontal frets */}
          {Array.from({ length: FRET_COUNT }).map((_, i) => (
            <line 
              key={`fret-${i}`}
              x1="5" 
              y1={5 + (i + 1) * 18} 
              x2="75" 
              y2={5 + (i + 1) * 18} 
              stroke={isActive ? 'hsl(var(--primary-foreground) / 0.4)' : 'hsl(var(--foreground) / 0.4)'} 
              strokeWidth="1"
            />
          ))}
          
          {/* Finger positions */}
          {pattern.positions.map((pos, idx) => {
            if (pos.fret === 0 || pos.fret > FRET_COUNT) return null;
            const x = 5 + (STRING_COUNT - pos.string) * 14;
            const y = 5 + (pos.fret * 18) - 9;
            
            return (
              <g key={idx}>
                <circle 
                  cx={x} 
                  cy={y} 
                  r="7" 
                  fill={isActive ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))'} 
                />
                <text 
                  x={x} 
                  y={y + 1} 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  className="text-[10px] font-bold"
                  fill={isActive ? 'hsl(var(--primary))' : 'hsl(var(--background))'}
                >
                  {pos.finger}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Strumming pattern */}
      <div className="text-sm font-semibold mt-2">
        {renderStrumPattern()}
      </div>
    </div>
  );
};
