import * as Slider from '@radix-ui/react-slider';
import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface TimeSliderProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
}

const MIN_YEAR = 1999;
const MAX_YEAR = 2026;
const TICK_MS = 1400;

export function TimeSlider({ value, onValueChange }: TimeSliderProps) {
  const [playing, setPlaying] = useState(false);

  // Advance: keep start fixed, +1 year on end. Stop at MAX_YEAR (no loop).
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const [start, end] = value;
      if (end >= MAX_YEAR) {
        // Reached end — pause playback, leave range at full extent.
        setPlaying(false);
        return;
      }
      onValueChange([start, end + 1]);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [playing, value, onValueChange]);

  const togglePlay = () => {
    if (!playing) {
      // Starting: if range is wide-open (full), reset end to start so accumulation is visible.
      const [start, end] = value;
      const isFullRange = start === MIN_YEAR && end === MAX_YEAR;
      if (isFullRange) {
        onValueChange([MIN_YEAR, MIN_YEAR]);
      }
    }
    setPlaying(p => !p);
  };

  return (
    <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-3 sm:px-8">
      <div className="backdrop-blur-md bg-slate-900/80 border border-white/[0.08] rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-xl animate-ui-slide-up animate-delay-200">
        {playing && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none">
            <span
              key={value[1]}
              className="block text-orange-400 font-mono tabular-nums font-semibold text-3xl sm:text-4xl animate-year-pop"
            >
              {value[1]}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-200 font-mono tabular-nums text-sm font-medium">{value[0]}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-400 text-slate-900 flex items-center justify-center transition-[background-color,transform] duration-150 active:scale-[0.96]"
              aria-label={playing ? 'Pausar' : 'Reproducir línea de tiempo'}
              title={playing ? 'Pausar' : 'Reproducir'}
            >
              {playing ? (
                <Pause className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              ) : (
                <Play className="h-3.5 w-3.5 translate-x-px" strokeWidth={2} aria-hidden />
              )}
            </button>
            <span className="text-slate-400 text-xs">Cuándo se prometieron</span>
          </div>
          <span className="text-slate-200 font-mono tabular-nums text-sm font-medium">{value[1]}</span>
        </div>
        <Slider.Root
          className="relative flex items-center select-none touch-none h-5"
          min={MIN_YEAR}
          max={MAX_YEAR}
          step={1}
          value={value}
          onValueChange={v => {
            if (playing) setPlaying(false);
            onValueChange(v as [number, number]);
          }}
          minStepsBetweenThumbs={1}
        >
          <Slider.Track className="relative bg-slate-700 rounded-full h-1 grow">
            <Slider.Range className="absolute bg-orange-400 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 sm:w-4 sm:h-4 bg-slate-200 rounded-full border-2 border-slate-500 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 transition-colors"
            aria-label="Año inicial"
          />
          <Slider.Thumb
            className="block w-5 h-5 sm:w-4 sm:h-4 bg-slate-200 rounded-full border-2 border-slate-500 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 transition-colors"
            aria-label="Año final"
          />
        </Slider.Root>
      </div>
    </div>
  );
}
