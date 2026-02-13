import { mockRecordings, mockIncidents, flightDataPoints } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FlightCharts } from '@/components/investigation/flight-charts';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Maximize } from 'lucide-react';
import { AiAssistant } from '@/components/investigation/ai-assistant';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: "Incident Investigation | AirScribe CVR Management",
};

export default function InvestigationPage({ params }: { params: { id: string } }) {
  const recording = mockRecordings.find(r => r.id === params.id);
  const incident = mockIncidents.find(i => i.recordingId === params.id);

  if (!recording) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={`Investigation: ${recording.callsign}`}
        description={`Analyzing recording from ${format(recording.date, 'PPP')}`}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Flight Data Correlation</CardTitle>
                        <Button variant="ghost" size="icon">
                            <Maximize className="w-4 h-4"/>
                        </Button>
                    </div>
                    <CardDescription>CVR audio synchronized with FDR parameters and flight path visualization.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FlightCharts data={flightDataPoints} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Playback & Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 space-y-4 rounded-lg bg-muted/50">
                        <div className="grid grid-cols-4 gap-2">
                            <div className="h-16 rounded bg-card" style={{borderLeft: '4px solid hsl(var(--chart-2))'}}><div className="p-2 text-xs">CH1: Pilot</div></div>
                            <div className="h-16 rounded bg-card" style={{borderLeft: '4px solid hsl(var(--chart-3))'}}><div className="p-2 text-xs">CH2: Co-Pilot</div></div>
                            <div className="h-16 rounded bg-card" style={{borderLeft: '4px solid hsl(var(--chart-4))'}}><div className="p-2 text-xs">CH3: Area Mic</div></div>
                            <div className="h-16 rounded bg-card" style={{borderLeft: '4px solid hsl(var(--chart-5))'}}><div className="p-2 text-xs">CH4: Engineer</div></div>
                        </div>
                         <div className="relative h-2 rounded-full bg-border">
                            <div className="absolute top-0 left-0 h-2 rounded-full bg-primary" style={{ width: '37%' }}></div>
                            <div className="absolute w-4 h-4 -mt-1 -ml-2 rounded-full bg-primary ring-2 ring-background" style={{ top: '50%', left: '37%' }}></div>
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <Button variant="ghost" size="icon"><SkipBack /></Button>
                            <Button variant="default" size="lg" className="w-16 h-16 rounded-full"><Play className="w-8 h-8" /></Button>
                            <Button variant="ghost" size="icon"><SkipForward /></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recording Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between"><span>Callsign:</span> <span className="font-medium">{recording.callsign}</span></div>
              <div className="flex justify-between"><span>Date:</span> <span className="font-medium">{format(recording.date, 'PPpp')}</span></div>
              <div className="flex justify-between"><span>Duration:</span> <span className="font-medium">{recording.duration}</span></div>
              <div className="flex justify-between"><span>Status:</span> <Badge variant={recording.status === 'Incident' ? 'destructive' : recording.status === 'Flagged' ? 'secondary' : 'outline'}>{recording.status}</Badge></div>
              {incident && (
                 <>
                    <Separator />
                    <div className="flex justify-between"><span>Severity:</span> <Badge variant="destructive">{incident.severity}</Badge></div>
                    <p className="p-2 rounded-md bg-muted text-muted-foreground">{incident.description}</p>
                 </>
              )}
            </CardContent>
          </Card>
          
          <AiAssistant recording={recording} />
        </div>
      </div>
    </>
  );
}
