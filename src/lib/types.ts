export type Flight = {
  id: string;
  callsign: string;
  origin: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  status: 'On Time' | 'Delayed' | 'In Flight' | 'Landed';
  position: { lat: number; lng: number };
};

export type Recording = {
  id: string;
  flightId: string;
  callsign: string;
  date: Date;
  duration: string;
  fileSize: string;
  status: 'Normal' | 'Flagged' | 'Incident';
};

export type Incident = {
  id: string;
  recordingId: string;
  flightId: string;
  callsign: string;
  timestamp: Date;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  status: 'Open' | 'Under Investigation' | 'Closed';
};

export type Alert = {
  id: string;
  timestamp: Date;
  type: 'System' | 'Flight' | 'Audio Anomaly';
  severity: 'Info' | 'Warning' | 'Critical';
  message: string;
  isRead: boolean;
};

export type AudioFile = {
  id: string;
  title: string;
  url: string;
  duration: string;
};

export type DenoiseAudioPair = {
  id: string;
  title: string;
  noisyUrl: string;
  cleanUrl: string;
  transcript: string;
};

export type EmotionDataPoint = {
  time: number;
  stress: number;
  frustration: number;
  focus: number;
  calm: number;
};

export type TranscriptSegment = {
  text: string;
  stressLevel: 'high' | 'medium' | 'low';
};

export type EmotionAnalysis = {
  id: string;
  recordingId: string;
  overallStress: number;
  peakStressTime: number;
  dominantEmotion: 'Calm' | 'Focused' | 'Frustration' | 'High Stress';
  timeline: EmotionDataPoint[];
  transcript: TranscriptSegment[];
};
