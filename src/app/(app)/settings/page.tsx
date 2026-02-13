import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Settings | AirScribe CVR Management",
};

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="System Settings"
        description="Configure system parameters and preferences."
      />
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
           <CardDescription>This is a placeholder for system settings.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Settings controls will be available here.</p>
           </div>
        </CardContent>
        <CardContent>
            <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </>
  );
}
