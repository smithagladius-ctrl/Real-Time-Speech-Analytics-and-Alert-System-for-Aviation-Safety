import { PageHeader } from "@/components/page-header";
import { WaveformVisualizer } from "@/components/live-monitoring/waveform-visualizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Mic, User, Users, Ear } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Live Monitoring | AirScribe CVR Management",
};

const channels = [
  { id: 1, name: "Pilot", icon: User, color: "hsl(var(--chart-2))" },
  { id: 2, name: "Co-pilot", icon: User, color: "hsl(var(--chart-3))" },
  { id: 3, name: "Area Mic", icon: Mic, color: "hsl(var(--chart-4))" },
  { id: 4, name: "Flight Engineer", icon: Ear, color: "hsl(var(--chart-5))" },
];

export default function LiveMonitoringPage() {
  return (
    <>
      <PageHeader
        title="Live Monitoring"
        description="Visualize 4-channel audio waveforms in real-time. Flight: UA248"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="flex flex-col col-span-1 gap-4 lg:col-span-4">
          {channels.map(channel => (
            <Card key={channel.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-medium">
                  <channel.icon className="w-5 h-5" style={{ color: channel.color }}/>
                  Channel {channel.id}: {channel.name}
                </CardTitle>
                <Badge style={{ backgroundColor: channel.color }} className="text-primary-foreground">Live</Badge>
              </CardHeader>
              <CardContent>
                <WaveformVisualizer color={channel.color} />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="col-span-1 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Channel Mixer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {channels.map(channel => (
                <div key={channel.id} className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <channel.icon className="w-4 h-4" style={{ color: channel.color }} />
                    {channel.name}
                  </label>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <VolumeX className="w-4 h-4" />
                    </Button>
                    <Slider defaultValue={[75]} max={100} step={1} />
                     <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
