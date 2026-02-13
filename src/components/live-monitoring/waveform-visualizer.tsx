'use client';

import { useEffect, useState } from "react";

type WaveformVisualizerProps = {
  color?: string;
};

export function WaveformVisualizer({ color = 'hsl(var(--primary))' }: WaveformVisualizerProps) {
  const [pathData, setPathData] = useState('');

  useEffect(() => {
    const generatePath = () => {
      const width = 800;
      const height = 100;
      const points = 200;
      let path = `M 0 ${height / 2}`;
      
      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        const phase = Date.now() / 500;
        const randomFactor = (Math.random() - 0.5) * 20;
        const y = height / 2 + Math.sin(i * 0.1 + phase) * (height / 3) * (i / points) * (1 - i / points) * 4 + randomFactor;
        path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
      }
      return path;
    };

    const interval = setInterval(() => {
      setPathData(generatePath());
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[100px] bg-muted/20 rounded-lg overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 800 100" preserveAspectRatio="none">
        <path d={pathData} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
