import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const Tuner = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentNote, setCurrentNote] = useState<string>('--');
  const [currentFrequency, setCurrentFrequency] = useState<number>(0);
  const [cents, setCents] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const noteFromPitch = (frequency: number) => {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69;
  };

  const frequencyFromNoteNumber = (note: number) => {
    return 440 * Math.pow(2, (note - 69) / 12);
  };

  const centsOffFromPitch = (frequency: number, note: number) => {
    return Math.floor((1200 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2));
  };

  const autoCorrelate = (buf: Float32Array, sampleRate: number) => {
    let SIZE = buf.length;
    let MAX_SAMPLES = Math.floor(SIZE / 2);
    let best_offset = -1;
    let best_correlation = 0;
    let rms = 0;
    let foundGoodCorrelation = false;

    for (let i = 0; i < SIZE; i++) {
      let val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    let lastCorrelation = 1;
    for (let offset = 0; offset < MAX_SAMPLES; offset++) {
      let correlation = 0;

      for (let i = 0; i < MAX_SAMPLES; i++) {
        correlation += Math.abs(buf[i] - buf[i + offset]);
      }
      correlation = 1 - correlation / MAX_SAMPLES;

      if (correlation > 0.9 && correlation > lastCorrelation) {
        foundGoodCorrelation = true;
        if (correlation > best_correlation) {
          best_correlation = correlation;
          best_offset = offset;
        }
      }
      lastCorrelation = correlation;
    }

    if (foundGoodCorrelation) {
      return sampleRate / best_offset;
    }
    return -1;
  };

  const updatePitch = () => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(buffer);

    const frequency = autoCorrelate(buffer, audioContextRef.current!.sampleRate);

    if (frequency > -1) {
      const note = noteFromPitch(frequency);
      const noteName = NOTES[note % 12];
      const detune = centsOffFromPitch(frequency, note);

      setCurrentNote(noteName);
      setCurrentFrequency(Math.round(frequency * 10) / 10);
      setCents(detune);
    }

    if (isListening) {
      requestAnimationFrame(updatePitch);
    }
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new AudioContext();
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      updatePitch();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: 'Erro ao acessar microfone',
        description: 'Por favor, permita o acesso ao microfone nas configurações do navegador.',
        variant: 'destructive',
      });
    }
  };

  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setCurrentNote('--');
    setCurrentFrequency(0);
    setCents(0);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const getCentsColor = () => {
    if (!isListening) return 'bg-muted';
    if (Math.abs(cents) < 5) return 'bg-accent';
    if (Math.abs(cents) < 20) return 'bg-primary';
    return 'bg-destructive';
  };

  return (
    <Card className="p-6 bg-card border-border shadow-lg">
      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Afinador Cromático
        </h2>

        <div className="relative w-full max-w-sm">
          <div className="text-center space-y-4">
            <div className={`text-7xl font-bold transition-all duration-300 ${isListening ? 'text-primary' : 'text-muted-foreground'}`}>
              {currentNote}
            </div>
            
            <div className="text-2xl text-muted-foreground">
              {currentFrequency > 0 ? `${currentFrequency} Hz` : '--'}
            </div>

            {/* Cents indicator */}
            <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className={`absolute h-full ${getCentsColor()} transition-all duration-200`}
                style={{
                  left: '50%',
                  transform: `translateX(calc(-50% + ${Math.max(-50, Math.min(50, cents))}%))`,
                  width: '4px'
                }}
              />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-foreground/20" />
            </div>

            <div className="text-sm text-muted-foreground">
              {cents !== 0 && isListening && (
                <>
                  {Math.abs(cents) < 5 ? (
                    <span className="text-accent font-semibold">Afinado! ✓</span>
                  ) : (
                    <span>
                      {cents > 0 ? '↑ ' : '↓ '}
                      {Math.abs(cents)} cents
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={isListening ? stopListening : startListening}
          size="lg"
          className={`w-full max-w-xs transition-all duration-300 ${
            isListening 
              ? 'bg-destructive hover:bg-destructive/90' 
              : 'bg-gradient-primary hover:opacity-90'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="mr-2 h-5 w-5" />
              Parar Afinador
            </>
          ) : (
            <>
              <Mic className="mr-2 h-5 w-5" />
              Iniciar Afinador
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
