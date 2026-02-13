import { type Flight, type Recording, type Incident, type Alert, type AudioFile, type DenoiseAudioPair, type EmotionAnalysis } from './types';

export const mockFlights: Flight[] = [
  { id: 'FL001', callsign: 'UA248', origin: 'SFO', destination: 'JFK', departureTime: new Date('2024-07-27T10:00:00Z'), arrivalTime: new Date('2024-07-27T18:00:00Z'), status: 'In Flight', position: { lat: 39.8, lng: -105.2 } },
  { id: 'FL002', callsign: 'DL589', origin: 'LAX', destination: 'ORD', departureTime: new Date('2024-07-27T11:30:00Z'), arrivalTime: new Date('2024-07-27T17:30:00Z'), status: 'In Flight', position: { lat: 34.0, lng: -95.0 } },
  { id: 'FL003', callsign: 'LH491', origin: 'FRA', destination: 'SEA', departureTime: new Date('2024-07-27T12:15:00Z'), arrivalTime: new Date('2024-07-27T23:45:00Z'), status: 'In Flight', position: { lat: 55.5, lng: -25.8 } },
  { id: 'FL004', callsign: 'EK202', origin: 'DXB', destination: 'JFK', departureTime: new Date('2024-07-27T08:00:00Z'), arrivalTime: new Date('2024-07-27T21:00:00Z'), status: 'In Flight', position: { lat: 48.0, lng: 25.0 } },
];

export const mockRecordings: Recording[] = [
  { id: 'REC001', flightId: 'FL001', callsign: 'UA248', date: new Date('2024-07-27T10:00:00Z'), duration: '08:00:00', fileSize: '1.2 GB', status: 'Normal' },
  { id: 'REC002', flightId: 'FL002', callsign: 'DL589', date: new Date('2024-07-27T11:30:00Z'), duration: '06:00:00', fileSize: '980 MB', status: 'Normal' },
  { id: 'REC003', flightId: 'FL003', callsign: 'AA121', date: new Date('2024-07-27T09:15:00Z'), duration: '03:30:00', fileSize: '540 MB', status: 'Incident' },
  { id: 'REC004', flightId: 'FL005', callsign: 'BA283', date: new Date('2024-07-26T22:00:00Z'), duration: '25:00:00', fileSize: '3.1 GB', status: 'Flagged' },
  { id: 'REC005', flightId: 'FL006', callsign: 'EK202', date: new Date('2024-07-26T18:45:00Z'), duration: '14:30:00', fileSize: '2.2 GB', status: 'Normal' },
  { id: 'REC006', flightId: 'FL007', callsign: 'QF11', date: new Date('2024-07-26T12:00:00Z'), duration: '11:00:00', fileSize: '1.8 GB', status: 'Normal' },
];

export const mockIncidents: Incident[] = [
  { id: 'INC001', recordingId: 'REC003', flightId: 'FL003', callsign: 'AA121', timestamp: new Date('2024-07-27T10:05:21Z'), severity: 'High', description: 'Uncommanded pitch up during climb, followed by stall warning.', status: 'Under Investigation' },
  { id: 'INC002', recordingId: 'REC004', flightId: 'FL005', callsign: 'BA283', timestamp: new Date('2024-07-26T23:10:45Z'), severity: 'Medium', description: 'Engine vibration advisory on ENG 2.', status: 'Open' },
];

export const mockAlerts: Alert[] = [
    { id: 'ALERT001', timestamp: new Date(Date.now() - 2 * 60 * 1000), type: 'Audio Anomaly', severity: 'Critical', message: 'Stall warning detected on flight UA248.', isRead: false },
    { id: 'ALERT002', timestamp: new Date(Date.now() - 5 * 60 * 1000), type: 'Flight', severity: 'Warning', message: 'DL589 deviated from planned altitude.', isRead: false },
    { id: 'ALERT003', timestamp: new Date(Date.now() - 15 * 60 * 1000), type: 'System', severity: 'Info', message: 'Storage capacity at 85%.', isRead: true },
    { id: 'ALERT004', timestamp: new Date(Date.now() - 30 * 60 * 1000), type: 'Audio Anomaly', severity: 'Warning', message: 'Unusual cabin pressure tone on AA121.', isRead: true },
    { id: 'ALERT005', timestamp: new Date(Date.now() - 60 * 60 * 1000), type: 'System', severity: 'Info', message: 'CVR-B7 unit successfully synced.', isRead: true },
];

export const flightDataPoints = Array.from({ length: 100 }, (_, i) => ({
  time: i,
  altitude: 35000 + Math.sin(i * 0.2) * 1000 + (Math.random() - 0.5) * 200,
  speed: 480 + Math.cos(i * 0.2) * 20 + (Math.random() - 0.5) * 10,
  heading: 270 + Math.sin(i * 0.1) * 15 + (Math.random() - 0.5) * 5,
}));

export const mockAudioFiles: AudioFile[] = [
  { id: 'aud001', title: 'Cockpit Comms - Pre-flight', url: 'https://ik.imagekit.io/fwqphsval/i-can-fly-official-music-video.mp3?updatedAt=1761623635310', duration: '02:45' },
  { id: 'aud002', title: 'Takeoff and Climb - UA248', url: 'https://storage.googleapis.com/studioprod-assets/assets/takeoff-climb.mp3', duration: '05:12' },
  { id: 'aud003', title: 'ATC Handover - Sector 4', url: 'https://storage.googleapis.com/studioprod-assets/assets/atc-handover.mp3', duration: '01:30' },
  { id: 'aud004', title: 'Cabin Announcement - Turbulence', url: 'https://storage.googleapis.com/studioprod-assets/assets/cabin-announcement-turbulence.mp3', duration: '00:55' },
  { id: 'aud005', title: 'Landing Preparations', url: 'https://storage.googleapis.com/studioprod-assets/assets/landing-preparations.mp3', duration: '03:18' },
];

export const mockDenoiseAudioPairs: DenoiseAudioPair[] = [
  {
    id: 'denoise_0',
    title: 'Audio Segment 0',
    noisyUrl: 'https://ik.imagekit.io/fwqphsval/Noisefull/audio_0_seg_0.wav?updatedAt=1761624074165',
    cleanUrl: 'https://ik.imagekit.io/fwqphsval/Noiseless/audio_0_seg_0.wav?updatedAt=1761624028495',
    transcript: 'SIERRA DELTA MIKE'
  },
  {
    id: 'denoise_1',
    title: 'Audio Segment 1',
    noisyUrl: 'https://ik.imagekit.io/fwqphsval/Noisefull/audio_1_seg_0.wav?updatedAt=1761624076527',
    cleanUrl: 'https://ik.imagekit.io/fwqphsval/Noiseless/audio_1_seg_0.wav?updatedAt=1761624043449',
    transcript: 'ONE TWO SEVEN ONE TWO FIVE GOOD BYE LUFTHANSA NINER ALPHA FOXTROT'
  },
  {
    id: 'denoise_2',
    title: 'Audio Segment 2',
    noisyUrl: 'https://ik.imagekit.io/fwqphsval/Noisefull/audio_2_seg_0.wav?updatedAt=1761624076551',
    cleanUrl: 'https://ik.imagekit.io/fwqphsval/Noiseless/audio_2_seg_0.wav?updatedAt=1761624046690',
    transcript: 'CSA ZERO TWO FIVE HEADING THREE ONE FIVE DESCEND FLIGHT LEVEL NINER ZERO'
  },
  {
    id: 'denoise_3',
    title: 'Audio Segment 3',
    noisyUrl: 'https://ik.imagekit.io/fwqphsval/Noisefull/audio_3_seg_0.wav?updatedAt=1761624076167',
    cleanUrl: 'https://ik.imagekit.io/fwqphsval/Noiseless/audio_3_seg_0.wav?updatedAt=1761624045209',
    transcript: 'TWINSTAR EIGHT EIGHT SEVEN DESCEND FOUR THOUSAND FEET CLEARED ILS APPROACH RUNWAY THREE ONE REPORT WHEN ESTABLISHED'
  },
  {
    id: 'denoise_4',
    title: 'Audio Segment 4',
    noisyUrl: 'https://ik.imagekit.io/fwqphsval/Noisefull/audio_4_seg_0.wav?updatedAt=1761624076626',
    cleanUrl: 'https://ik.imagekit.io/fwqphsval/Noiseless/audio_4_seg_0.wav?updatedAt=1761624046760',
    transcript: 'ARE CLEARED TO LAND RUNWAY TWO FOUR CSA ONE DELTA ZULU'
  },
  {
    id: 'denoise_5',
    title: 'Audio Segment 5',
    noisyUrl: 'https://ik.imagekit.io/fwqphsval/Noisefull/audio_5_seg_0.wav?updatedAt=1761624076153',
    cleanUrl: 'https://ik.imagekit.io/fwqphsval/Noiseless/audio_5_seg_0.wav?updatedAt=1761624042386',
    transcript: 'ONE TWO SEVEN ONE TWO FIVE CSA SEVEN'
  },
  {
    id: 'denoise_6',
    title: 'Audio Segment 6',
    noisyUrl: 'https://ik.imagekit.io/fwqphsval/Noisefull/audio_6_seg_0.wav?updatedAt=1761624076539',
    cleanUrl: 'https://ik.imagekit.io/fwqphsval/Noiseless/audio_6_seg_0.wav?updatedAt=1761624045390',
    transcript: 'LUFTHANSA NINER ALPHA HOTEL CLIMB TO FLIGHT LEVEL THREE FOUR ZERO'
  },
  {
    id: 'denoise_7',
    title: 'Audio Segment 7',
    noisyUrl: 'https://ik.imagekit.io/fwqphsval/Noisefull/audio_7_seg_0.wav?updatedAt=1761624076797',
    cleanUrl: 'https://ik.imagekit.io/fwqphsval/Noiseless/audio_7_seg_0.wav?updatedAt=1761624047161',
    transcript: 'LUFTHANSA NINER JULIETT CHARLIE TRAFFIC INFORMATION HELICOPTER JUST LANDING ON HELIPORT'
  },
  {
    id: 'denoise_8',
    title: 'Audio Segment 8',
    noisyUrl: 'https://ik.imagekit.io/fwqphsval/Noisefull/audio_8_seg_0.wav?updatedAt=1761624075659',
    cleanUrl: 'https://ik.imagekit.io/fwqphsval/Noiseless/audio_8_seg_0.wav?updatedAt=1761624027225',
    transcript: 'RUNWAY ONE THREE HELLO AUSTRIAN SEVEN'
  },
  {
    id: 'denoise_9',
    title: 'Audio Segment 9',
    noisyUrl: 'https://ik.imagekit.io/fwqphsval/Noisefull/audio_9_seg_0.wav?updatedAt=1761624075491',
    cleanUrl: 'https://ik.imagekit.io/fwqphsval/Noiseless/audio_9_seg_0.wav?updatedAt=1761624022377',
    transcript: 'PRESENT HEADING'
  },
  {
    id: 'denoise_10',
    title: 'Audio Segment 10',
    noisyUrl: 'https://ik.imagekit.io/fwqphsval/Noisefull/audio_10_seg_0.wav?updatedAt=1761624076003',
    cleanUrl: 'https://ik.imagekit.io/fwqphsval/Noiseless/audio_10_seg_0.wav?updatedAt=1761624044528',
    transcript: 'DESCENDING LEVEL SEVEN ZERO CSA SEVEN THREE TWO THREE'
  },
];


export const mockEmotionAnalysis: EmotionAnalysis = {
  id: 'EA001',
  recordingId: 'REC003',
  overallStress: 68,
  peakStressTime: 45,
  dominantEmotion: 'High Stress',
  timeline: Array.from({ length: 100 }, (_, i) => {
    const stress = 30 + Math.sin(i * 0.1) * 20 + (i > 40 && i < 60 ? (i-40)*2 : 0) + Math.random() * 10;
    return {
      time: i,
      stress: stress,
      frustration: 10 + Math.cos(i * 0.2) * 5 + (i > 50 && i < 70 ? 20 : 0) + Math.random() * 5,
      focus: 80 - Math.sin(i * 0.1) * 10 - (i > 40 && i < 60 ? 30 : 0) + Math.random() * 10,
      calm: 70 - stress / 2 + Math.random() * 10,
    };
  }),
  transcript: [
    { text: 'Mayday, mayday, mayday, Alpha-Alpha-One-Two-One, we have an uncommanded pitch up.', stressLevel: 'high' },
    { text: 'We are unable to maintain altitude. Requesting immediate assistance.', stressLevel: 'high' },
    { text: 'Stall warning! Stall warning!', stressLevel: 'high' },
    { text: 'Okay, push forward on the yoke, push forward!', stressLevel: 'medium' },
    { text: 'I am pushing, it\'s not responding!', stressLevel: 'high' },
    { text: 'Trying to disconnect autopilot... it\'s disconnected.', stressLevel: 'medium' },
    { text: 'Okay, manual control. Let\'s try to recover.', stressLevel: 'low' },
    { text: 'Airspeed is dropping. Lower the nose.', stressLevel: 'medium' },
    { text: 'That\'s what I\'m trying to do! Come on!', stressLevel: 'high' },
    { text: 'Okay, she\'s responding now. We are recovering. Resuming normal flight.', stressLevel: 'low' },
  ],
};
