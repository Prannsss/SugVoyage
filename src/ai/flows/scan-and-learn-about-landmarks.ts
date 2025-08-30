
'use server';
/**
 * @fileOverview An AI agent that identifies scanned objects and narrates their history and cultural importance.
 *
 * - scanAndLearnAboutLandmark - A function that handles the object identification and narration process.
 * - ScanAndLearnAboutLandmarkInput - The input type for the scanAndLearnAboutLandmark function.
 * - ScanAndLearnAboutLandmarkOutput - The return type for the scanAndLearnAboutLandmark function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const ScanAndLearnAboutLandmarkInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the landmark, food, or artifact, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  voice: z.string().optional().describe('The voice to use for the audio narration.'),
});
export type ScanAndLearnAboutLandmarkInput = z.infer<typeof ScanAndLearnAboutLandmarkInputSchema>;

const ScanAndLearnAboutLandmarkOutputSchema = z.object({
  objectIdentification: z.string().describe('The AI-identified object.'),
  narration: z.string().describe('The history and cultural importance of the object narrated.'),
  audio: z.string().describe('The audio narration of the history and cultural importance of the object.'),
});
export type ScanAndLearnAboutLandmarkOutput = z.infer<typeof ScanAndLearnAboutLandmarkOutputSchema>;

export async function scanAndLearnAboutLandmark(input: ScanAndLearnAboutLandmarkInput): Promise<ScanAndLearnAboutLandmarkOutput> {
  return scanAndLearnAboutLandmarkFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanAndLearnAboutLandmarkPrompt',
  input: {schema: z.object({ photoDataUri: ScanAndLearnAboutLandmarkInputSchema.shape.photoDataUri })},
  output: {schema: z.object({
    objectIdentification: ScanAndLearnAboutLandmarkOutputSchema.shape.objectIdentification,
    narration: ScanAndLearnAboutLandmarkOutputSchema.shape.narration,
  })},
  prompt: `You are a knowledgeable tour guide specializing in Cebuano landmarks, food, and artifacts. When given an image, you will identify the object and narrate its history and cultural significance.

  Here is the photo of the object:
  {{media url=photoDataUri}}
  
  Do not use any markdown formatting, such as asterisks. The output should be plain text.

  Object Identification:
  Narration:
  `,
});

const scanAndLearnAboutLandmarkFlow = ai.defineFlow(
  {
    name: 'scanAndLearnAboutLandmarkFlow',
    inputSchema: ScanAndLearnAboutLandmarkInputSchema,
    outputSchema: ScanAndLearnAboutLandmarkOutputSchema,
  },
  async input => {
    const {output} = await prompt({ photoDataUri: input.photoDataUri });

    const ttsResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voice || 'Algenib' },
          },
        },
      },
      prompt: output?.narration ?? '',
    });

    let audioUri = '';
    if (ttsResponse.media) {
      const audioBuffer = Buffer.from(
        ttsResponse.media.url.substring(ttsResponse.media.url.indexOf(',') + 1),
        'base64'
      );

      const wavBase64 = await toWav(audioBuffer);
      audioUri = 'data:audio/wav;base64,' + wavBase64;
    }

    return {
      objectIdentification: output?.objectIdentification ?? 'Could not identify object.',
      narration: output?.narration ?? 'Could not generate narration.',
      audio: audioUri,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
