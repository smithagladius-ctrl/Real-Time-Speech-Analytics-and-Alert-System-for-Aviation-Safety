
'use client';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEmotionAnalysis } from "@/lib/data";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { BrainCircuit, Angry, Smile as SmileIcon, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

const stressLevelColors = {
    high: "bg-destructive/20 text-destructive-foreground border-destructive",
    medium: "bg-yellow-500/20 text-yellow-500 border-yellow-500",
    low: "bg-green-500/20 text-green-500 border-green-500",
}

export default function StressDetectionPage() {
  const analysis = mockEmotionAnalysis;
  return (
    <>
      <PageHeader
        title="Stress & Emotion Detection"
        description={`Analysis for recording ${analysis.recordingId}.`}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
         <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Overall Stress</CardTitle>
                <Gauge className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-destructive">{analysis.overallStress}%</div>
                <p className="text-xs text-muted-foreground">Peak stress detected at {analysis.peakStressTime}s</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Dominant Emotion</CardTitle>
                <BrainCircuit className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{analysis.dominantEmotion}</div>
                <p className="text-xs text-muted-foreground">Primary emotional state detected</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Peak Frustration</CardTitle>
                <Angry className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">45%</div>
                <p className="text-xs text-muted-foreground">Highest level of frustration detected</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Lowest Calm</CardTitle>
                <SmileIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">22%</div>
                <p className="text-xs text-muted-foreground">Lowest level of calmness detected</p>
            </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 mt-6 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Emotion Timeline</CardTitle>
            <CardDescription>Detected emotional levels over the course of the recording.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analysis.timeline}>
                        <defs>
                            <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                            </linearGradient>
                             <linearGradient id="colorFrustration" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit="s" />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area type="monotone" dataKey="stress" stroke="hsl(var(--destructive))" fill="url(#colorStress)" />
                        <Area type="monotone" dataKey="frustration" stroke="hsl(var(--chart-2))" fill="url(#colorFrustration)" />
                        <Area type="monotone" dataKey="focus" stroke="hsl(var(--chart-3))" fillOpacity={0} />
                        <Area type="monotone" dataKey="calm" stroke="hsl(var(--chart-5))" fillOpacity={0} />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Analyzed Transcript</CardTitle>
            <CardDescription>Transcript with color-coded stress levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto p-4 rounded-md bg-muted/50">
                {analysis.transcript.map((segment, index) => (
                    <p 
                        key={index}
                        className={cn(
                            "text-sm p-2 rounded-md border-l-4",
                            stressLevelColors[segment.stressLevel]
                        )}
                    >
                        {segment.text}
                    </p>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
