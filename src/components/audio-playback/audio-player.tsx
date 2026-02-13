'use client';
import { useState, useRef, useEffect } from 'react';
import { type AudioFile } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, ListMusic, Forward, Rewind, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export function AudioPlayer({ audioFiles }: { audioFiles: AudioFile[] }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = audioFiles[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Playback failed", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, currentTrackIndex]);
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % audioFiles.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + audioFiles.length) % audioFiles.length);
    setIsPlaying(true);
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const newProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(newProgress);
    }
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
            src={currentTrack.url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleNext}
        />
      <Card className="md:col-span-1">
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2"><ListMusic className="w-5 h-5" /> Playlist</h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {audioFiles.map((file, index) => (
              <button
                key={file.id}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                }}
                className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors text-sm",
                    index === currentTrackIndex ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                )}
              >
                <p className="font-medium">{file.title}</p>
                <p className={cn("text-xs", index === currentTrackIndex ? 'text-primary-foreground/80' : 'text-muted-foreground' )}>{file.duration}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="md:col-span-2">
        <Card>
            <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-t-lg">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <ListMusic className="w-16 h-16 text-primary" />
                </div>
                <h2 className="text-2xl font-bold font-headline">{currentTrack.title}</h2>
                <p className="text-muted-foreground">AirScribe Audio Recordings</p>
            </div>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
                <Slider value={[progress]} onValueChange={handleSeek} />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(audioRef.current?.currentTime ?? 0)}</span>
                    <span>{formatTime(audioRef.current?.duration ?? 0)}</span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon" onClick={handlePrev}><Rewind /></Button>
              <Button variant="default" size="lg" className="w-16 h-16 rounded-full" onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext}><Forward /></Button>
            </div>
            <div className="flex items-center gap-2 pt-4 max-w-xs mx-auto">
                <Volume2 className="w-5 h-5 text-muted-foreground"/>
                <Slider 
                    defaultValue={[volume * 100]} 
                    onValueChange={(value) => setVolume(value[0] / 100)}
                />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
