import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DatasetPage() {
  return (
    <>
      <PageHeader
        title="ATC-ASR Dataset"
        description="Browse the Air Traffic Control Automatic Speech Recognition dataset."
      />
      <Card>
        <CardHeader>
            <CardTitle>Hugging Face Dataset Viewer</CardTitle>
            <CardDescription>An embedded viewer for the ATC-ASR-Dataset.</CardDescription>
        </CardHeader>
        <CardContent>
            <iframe
                src="https://huggingface.co/datasets/jacktol/ATC-ASR-Dataset/embed/viewer/default/train"
                frameBorder="0"
                width="100%"
                height="560px"
                className="rounded-lg"
            ></iframe>
        </CardContent>
      </Card>
    </>
  );
}
