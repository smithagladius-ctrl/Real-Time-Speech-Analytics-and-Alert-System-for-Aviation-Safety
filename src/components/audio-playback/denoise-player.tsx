'use client';
import { useState, useRef, useEffect } from 'react';
import { type DenoiseAudioPair } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Play, Pause, Loader2, ListMusic, AudioWaveform, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

type PlayerState = {
  isPlaying: boolean;
  type: 'noisy' | 'clean' | null;
  progress: number;
  duration: number;
  isLoading: boolean;
};

type TranscriptState = {
    text: string;
    isLoading: boolean;
}

const initialPlayerState: PlayerState = {
  isPlaying: false,
  type: null,
  progress: 0,
  duration: 0,
  isLoading: false,
};

const initialTranscriptState: TranscriptState = {
    text: '',
    isLoading: false,
};

export function DenoisePlayer({ audioPairs }: { audioPairs: DenoiseAudioPair[] }) {
  const [activePairIndex, setActivePairIndex] = useState(0);
  const [playerState, setPlayerState] = useState<PlayerState>(initialPlayerState);
  const [transcriptState, setTranscriptState] = useState<TranscriptState>(initialTranscriptState);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const activePair = audioPairs[activePairIndex];

  // Reset states when the selected audio pair changes
  useEffect(() => {
    setPlayerState(initialPlayerState);
    setTranscriptState(initialTranscriptState);
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
    }
  }, [activePairIndex]);


  const handlePlay = (type: 'noisy' | 'clean') => {
    if (!audioRef.current) return;

    // If clicking the same button that is already playing, pause it.
    if (playerState.isPlaying && playerState.type === type) {
      audioRef.current.pause();
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
      return;
    }

    const url = type === 'noisy' ? activePair.noisyUrl : activePair.cleanUrl;
    
    // If switching to a different audio type, load it.
    if (audioRef.current.src !== url) {
        setPlayerState(prev => ({ ...prev, isLoading: true, isPlaying: false, type }));
        audioRef.current.src = url;
        audioRef.current.load();
    } else {
        // If it's the same audio, just play.
        audioRef.current.play().catch(console.error);
        setPlayerState(prev => ({ ...prev, isPlaying: true, type }));
    }
  };

  const handleTranscribe = () => {
    setTranscriptState({ text: '', isLoading: true });
    // Simulate transcription delay
    setTimeout(() => {
        setTranscriptState({ text: activePair.transcript, isLoading: false });
    }, 1500);
  }

  const handleCanPlay = () => {
    if (audioRef.current) {
        audioRef.current.play().catch(console.error);
        setPlayerState(prev => ({ 
            ...prev, 
            isLoading: false, 
            isPlaying: true, 
        }));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setPlayerState(prev => ({
        ...prev,
        progress: (currentTime / duration) * 100 || 0,
        duration: duration || 0
      }));
    }
  };
  
  const handleEnded = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: false, progress: 0, type: null }));
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (value[0] / 100) * audioRef.current.duration;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <audio 
        ref={audioRef}
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => audioRef.current && setPlayerState(prev => ({ ...prev, duration: audioRef.current!.duration }))}
        onEnded={handleEnded}
      />
      <Card className="md:col-span-1">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ListMusic className="w-5 h-5" /> Audio Segments
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {audioPairs.map((pair, index) => (
              <button
                key={pair.id}
                onClick={() => setActivePairIndex(index)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors text-sm",
                  index === activePairIndex ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                )}
              >
                <p className="font-medium">{pair.title}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="md:col-span-2 space-y-6">
        <Card>
          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-t-lg">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <AudioWaveform className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-2xl font-bold font-headline">{activePair.title}</h2>
            <p className="text-muted-foreground">Select an audio version to play</p>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Slider value={[playerState.progress]} onValueChange={handleSeek} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(audioRef.current?.currentTime ?? 0)}</span>
                <span>{formatTime(playerState.duration)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Noisy Player */}
              <Button onClick={() => handlePlay('noisy')} disabled={playerState.isLoading && playerState.type === 'clean'}>
                {playerState.isLoading && playerState.type === 'noisy' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : playerState.isPlaying && playerState.type === 'noisy' ? (
                  <Pause className="mr-2" />
                ) : (
                  <Play className="mr-2" />
                )}
                Play Noisy
              </Button>

              {/* Clean Player */}
              <Button onClick={() => handlePlay('clean')} disabled={playerState.isLoading && playerState.type === 'noisy'}>
                 {playerState.isLoading && playerState.type === 'clean' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : playerState.isPlaying && playerState.type === 'clean' ? (
                  <Pause className="mr-2" />
                ) : (
                  <Play className="mr-2" />
                )}
                Play Clean
              </Button>
            </div>
             <div className="text-center">
                {playerState.type && <Badge variant="secondary">Now Playing: {playerState.type.charAt(0).toUpperCase() + playerState.type.slice(1)}</Badge>}
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Transcription</CardTitle>
            </CardHeader>
            <CardContent>
                {transcriptState.isLoading ? (
                     <div className="flex items-center justify-center h-24">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : transcriptState.text ? (
                    <div className="p-4 rounded-md bg-muted/50 font-code text-sm text-foreground">
                        {transcriptState.text}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-24 border-2 border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground">Click the button to generate a transcript.</p>
                    </div>
                )}
                <Button onClick={handleTranscribe} className="w-full mt-4" disabled={transcriptState.isLoading}>
                    <FileText className="mr-2"/>
                    Transcribe Audio
                </Button>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
