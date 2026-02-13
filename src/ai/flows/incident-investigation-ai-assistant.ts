'use server';
/**
 * @fileOverview An AI assistant for incident investigation by analyzing CVR audio and flight data.
 *
 * - analyzeIncident - A function that analyzes potential safety incidents.
 * - IncidentInvestigationInput - The input type for the analyzeIncident function.
 * - IncidentInvestigationOutput - The return type for the analyzeIncident function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IncidentInvestigationInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A CVR audio recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  flightData: z.string().describe('Flight data parameters including altitude, speed, and heading.'),
});
export type IncidentInvestigationInput = z.infer<typeof IncidentInvestigationInputSchema>;

const IncidentInvestigationOutputSchema = z.object({
  incidentDetected: z.boolean().describe('Whether a potential safety incident is detected.'),
  summary: z.string().describe('A summary of the potential safety incident.'),
  keyEvents: z.array(z.string()).describe('Key audio and flight events correlated to the incident.'),
});
export type IncidentInvestigationOutput = z.infer<typeof IncidentInvestigationOutputSchema>;

export async function analyzeIncident(input: IncidentInvestigationInput): Promise<IncidentInvestigationOutput> {
  return analyzeIncidentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'incidentAnalysisPrompt',
  input: {schema: IncidentInvestigationInputSchema},
  output: {schema: IncidentInvestigationOutputSchema},
  prompt: `You are an aviation safety expert specializing in detecting potential safety incidents from CVR audio and flight data.

  Analyze the provided CVR audio and flight data to detect potential safety incidents.  Correlate unusual audio events (e.g., alarms, unusual noises) with flight data anomalies (e.g., sudden changes in altitude or speed).

  Audio data: {{media url=audioDataUri}}
  Flight data: {{{flightData}}}

  Based on your analysis, determine if a potential safety incident occurred. Provide a summary of the incident and list key events that support your determination. Make sure to set incidentDetected appropriately.
  `,
});

const analyzeIncidentFlow = ai.defineFlow(
  {
    name: 'analyzeIncidentFlow',
    inputSchema: IncidentInvestigationInputSchema,
    outputSchema: IncidentInvestigationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
