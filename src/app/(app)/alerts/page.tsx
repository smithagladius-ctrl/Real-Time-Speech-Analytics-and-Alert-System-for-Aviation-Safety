import { PageHeader } from "@/components/page-header";
import { mockAlerts } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Bell, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Alerts | AirScribe CVR Management",
};

const alertIcons = {
  Critical: <AlertTriangle className="h-5 w-5 text-destructive" />,
  Warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  Info: <Info className="h-5 w-5 text-blue-500" />,
};

const alertColors = {
  Critical: "border-l-destructive",
  Warning: "border-l-yellow-500",
  Info: "border-l-blue-500",
}

export default function AlertsPage() {
  return (
    <>
      <PageHeader
        title="Alerts & Notifications"
        description="A centralized log of all system, flight, and audio anomaly alerts."
      />
      <Card>
        <CardHeader>
          <CardTitle>Alerts Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAlerts.map(alert => (
              <div 
                key={alert.id} 
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border bg-card",
                  "border-l-4",
                  alertColors[alert.severity as keyof typeof alertColors],
                  !alert.isRead && "bg-muted/50"
                )}
              >
                <div className="mt-1">
                  {alertIcons[alert.severity as keyof typeof alertIcons]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">
                      {alert.type} - <span className={cn(
                        alert.severity === "Critical" && "text-destructive",
                        alert.severity === "Warning" && "text-yellow-500",
                      )}>{alert.severity}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
