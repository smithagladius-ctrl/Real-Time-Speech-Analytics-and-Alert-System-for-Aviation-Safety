'use server';

import { analyzeIncident, type IncidentInvestigationOutput } from '@/ai/flows/incident-investigation-ai-assistant';
import { mockIncidents } from '@/lib/data';

export async function analyzeRecording(
    recordingId: string,
    prevState: any,
    formData: FormData
  ) {
  try {
    // This is a mock audio data URI. In a real application, you would fetch or generate this from the recording file.
    // This represents a very short, silent WAV file.
    const audioDataUri = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
    
    // Mock flight data corresponding to the incident
    const incident = mockIncidents.find(i => i.recordingId === recordingId);
    const flightData = incident 
        ? `Flight ${incident.callsign} experienced an issue at ${incident.timestamp.toISOString()}. Details: ${incident.description}. Flight parameters at the time showed unusual readings.`
        : `Normal flight data for recording ${recordingId}. No known anomalies.`;

    const result = await analyzeIncident({
      audioDataUri,
      flightData,
    });
    
    return result;

  } catch (error) {
    console.error(error);
    return {
      summary: '',
      keyEvents: [],
      incidentDetected: null,
      error: 'The AI analysis failed. Please try again later.',
    };
  }
}
