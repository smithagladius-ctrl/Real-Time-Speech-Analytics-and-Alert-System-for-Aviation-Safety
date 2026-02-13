

'use client';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell, CartesianGrid, Line, LineChart } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const monthlyRecordingsData = [
    { month: "Jan", recordings: 186, incidents: 2 },
    { month: "Feb", recordings: 205, incidents: 3 },
    { month: "Mar", recordings: 237, incidents: 1 },
    { month: "Apr", recordings: 213, incidents: 4 },
    { month: "May", recordings: 254, incidents: 2 },
    { month: "Jun", recordings: 234, incidents: 5 },
];

const incidentStatusData = [
  { name: 'Open', value: 5, fill: 'hsl(var(--chart-2))' },
  { name: 'Under Investigation', value: 3, fill: 'hsl(var(--chart-3))' },
  { name: 'Closed', value: 12, fill: 'hsl(var(--chart-5))' },
];

const incidentSeverityData = [
  { name: 'Critical', value: 2, fill: 'hsl(var(--destructive))' },
  { name: 'High', value: 4, fill: 'hsl(var(--chart-2))' },
  { name: 'Medium', value: 7, fill: 'hsl(var(--chart-4))' },
  { name: 'Low', value: 10, fill: 'hsl(var(--chart-5))' },
];

const alertsTrendData = [
    { day: "7 days ago", alerts: 3 },
    { day: "6 days ago", alerts: 5 },
    { day: "5 days ago", alerts: 2 },
    { day: "4 days ago", alerts: 4 },
    { day: "3 days ago", alerts: 1 },
    { day: "2 days ago", alerts: 6 },
    { day: "Yesterday", alerts: 3 },
    { day: "Today", alerts: 2 },
];


export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        description="Generate compliance reports and view analytics dashboards."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Recordings & Incidents</CardTitle>
            <CardDescription>Number of CVR recordings and incidents logged per month.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyRecordingsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="recordings" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="incidents" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Weekly Alert Trend</CardTitle>
                <CardDescription>Number of system and anomaly alerts over the past week.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={alertsTrendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                            <Legend />
                            <Line type="monotone" dataKey="alerts" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{r: 4, fill: "hsl(var(--chart-3))"}} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Incident Status Breakdown</CardTitle>
            <CardDescription>Current status of all logged incidents.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Pie data={incidentStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {incidentStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Incident Severity Breakdown</CardTitle>
            <CardDescription>Distribution of incidents by severity level.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Pie data={incidentSeverityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {incidentSeverityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
