'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Lightbulb, Loader2 } from 'lucide-react';
import { useFormState, useFormStatus } from 'react-dom';
import { analyzeRecording } from '@/app/investigation/[id]/actions';
import { type Recording } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const initialState = {
  summary: '',
  keyEvents: [],
  incidentDetected: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Lightbulb className="w-4 h-4 mr-2" />
          Analyze with AI
        </>
      )}
    </Button>
  );
}

export function AiAssistant({ recording }: { recording: Recording }) {
  const analyzeRecordingWithId = analyzeRecording.bind(null, recording.id);
  const [state, formAction] = useFormState(analyzeRecordingWithId, initialState);

  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle>AI Investigation Assistant</CardTitle>
          <CardDescription>Use AI to automatically detect potential incidents and correlate events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error && (
            <Alert variant="destructive">
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state.incidentDetected === false && (
             <Alert variant="default">
                <AlertTitle>No Incident Detected</AlertTitle>
                <AlertDescription>{state.summary}</AlertDescription>
            </Alert>
          )}

          {state.incidentDetected === true && (
            <Alert variant="destructive">
                <AlertTitle>Potential Incident Detected!</AlertTitle>
                <AlertDescription>
                    <p className="mb-2 font-semibold">{state.summary}</p>
                    <h4 className="font-bold mt-4 mb-2">Key Events:</h4>
                    <ul className="space-y-1 list-disc list-inside">
                        {state.keyEvents.map((event, index) => (
                        <li key={index}>{event}</li>
                        ))}
                    </ul>
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <SubmitButton />
          <Button variant="secondary" className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
