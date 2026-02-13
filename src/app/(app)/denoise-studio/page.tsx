import { PageHeader } from "@/components/page-header";
import { mockDenoiseAudioPairs } from "@/lib/data";
import { DenoisePlayer } from "@/components/audio-playback/denoise-player";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Denoise Studio | AirScribe CVR Management",
};

export default function DenoiseStudioPage() {
  return (
    <>
      <PageHeader
        title="Denoise Studio"
        description="Select an audio file from the playlist to preview the noisy and clean versions."
      />
      <DenoisePlayer audioPairs={mockDenoiseAudioPairs} />
    </>
  );
}
