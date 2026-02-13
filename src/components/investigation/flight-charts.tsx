'use client';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

export function FlightCharts({ data }: { data: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 text-sm font-medium">Altitude (ft)</h4>
        <ChartContainer config={{}} className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))"/>
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 500', 'dataMax + 500']} />
              <Tooltip cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="altitude" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
            <h4 className="mb-2 text-sm font-medium">Speed (kts)</h4>
            <ChartContainer config={{}} className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 20', 'dataMax + 20']}/>
                    <Tooltip cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="speed" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
        </div>
        <div>
            <h4 className="mb-2 text-sm font-medium">Heading (°)</h4>
            <ChartContainer config={{}} className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 20', 'dataMax + 20']}/>
                    <Tooltip cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="heading" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
        </div>
      </div>
    </div>
  );
}
