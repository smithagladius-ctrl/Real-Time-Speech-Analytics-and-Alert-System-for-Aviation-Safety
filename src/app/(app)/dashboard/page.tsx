import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plane, AlertTriangle, FileCheck2, Server } from "lucide-react";
import { mockRecordings } from "@/lib/data";
import { format } from 'date-fns';

export const metadata = {
  title: "Dashboard | AirScribe CVR Management",
};

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Real-time CVR monitoring hub with live flight tracking and key metrics."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Live Flights</CardTitle>
            <Plane className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Currently being monitored</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Recordings Today</CardTitle>
            <FileCheck2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 since last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Require investigation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">Nominal</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Recordings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Callsign</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecordings.map(rec => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-medium">{rec.callsign}</TableCell>
                    <TableCell>{format(rec.date, 'PPpp')}</TableCell>
                    <TableCell>
                       <Badge variant={rec.status === 'Incident' ? 'destructive' : rec.status === 'Flagged' ? 'secondary' : 'outline'}>
                        {rec.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
