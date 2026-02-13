import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal } from "lucide-react";
import { mockRecordings } from "@/lib/data";
import { format } from "date-fns";

export const metadata = {
  title: "Archive | AirScribe CVR Management",
};

export default function ArchivePage() {
  return (
    <>
      <PageHeader
        title="Recordings Archive"
        description="Access a historical library of CVR recordings with advanced search."
      />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>All Recordings</CardTitle>
            <div className="flex items-center gap-2">
              <Input placeholder="Search callsign..." className="w-48" />
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="flagged">Flagged</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Callsign</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecordings.map(rec => (
                <TableRow key={rec.id}>
                  <TableCell className="font-medium">{rec.callsign}</TableCell>
                  <TableCell>{format(rec.date, 'yyyy-MM-dd HH:mm')}</TableCell>
                  <TableCell>{rec.duration}</TableCell>
                  <TableCell>{rec.fileSize}</TableCell>
                  <TableCell>
                    <Badge variant={rec.status === 'Incident' ? 'destructive' : rec.status === 'Flagged' ? 'secondary' : 'outline'}>
                      {rec.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/investigation/${rec.id}`}>
                      <Button variant="ghost" size="sm">
                        Analyze
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
