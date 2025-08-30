'use server';
/**
 * @fileOverview An AI agent that provides details, history, and reviews for a given place.
 *
 * - getPlaceDetails - A function that returns details for a place.
 * - GetPlaceDetailsInput - The input type for the getPlaceDetails function.
 * - GetPlaceDetailsOutput - The return type for the getPlaceDetails function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetPlaceDetailsInputSchema = z.object({
  placeName: z.string().describe('The name of the place to get details for.'),
});
export type GetPlaceDetailsInput = z.infer<typeof GetPlaceDetailsInputSchema>;

const ReviewSchema = z.object({
  author: z.string().describe("The name of the reviewer."),
  rating: z.number().describe("The rating from 1 to 5."),
  comment: z.string().describe("The review comment."),
});

const GetPlaceDetailsOutputSchema = z.object({
  history: z.string().describe('The detailed history and cultural significance of the place.'),
  reviews: z.array(ReviewSchema).describe('A list of up to 5 user reviews for the place.'),
  directions: z.string().describe('Instructions on how to get to the place from a central point in Cebu City, like Fuente Osmeña Circle.'),
  mapLink: z.string().url().describe('A full, valid Google Maps URL for the place. It should not be a shortened URL.'),
});
export type GetPlaceDetailsOutput = z.infer<typeof GetPlaceDetailsOutputSchema>;


const getReviews = ai.defineTool(
  {
    name: 'getReviews',
    description: 'Get a list of user reviews for a specific place in Cebu.',
    inputSchema: z.object({
      placeName: z.string().describe('The name of the place.'),
    }),
    outputSchema: z.object({
      reviews: z.array(ReviewSchema),
    }),
  },
  async (input) => {
    // In a real application, this would call an external API like Google Places.
    // For this demo, we'll return mock data.
    const mockReviews: Record<string, z.infer<typeof ReviewSchema>[]> = {
        "magellan's cross": [
            { author: 'TravelerJoe', rating: 5, comment: 'A must-see historical landmark! You can feel the history.' },
            { author: 'Maria S.', rating: 4, comment: 'Beautiful and significant, but very crowded. Go early!' },
        ],
        "kawasan falls": [
            { author: 'AdrenalineJunkie', rating: 5, comment: 'Canyoneering was the best experience of my life! The water is so blue.' },
            { author: 'LeoP', rating: 5, comment: 'Stunningly beautiful. The trek is worth it.' },
            { author: 'FamilyExplorer', rating: 4, comment: 'Great for families, but can be slippery. Be careful with kids.' },
        ],
    };

    const placeKey = input.placeName.toLowerCase();
    const reviews = mockReviews[placeKey] || [
        { author: 'Bot', rating: 4, comment: 'This is a well-known spot in Cebu.' },
        { author: 'AI Reviewer', rating: 5, comment: 'Highly recommended by many visitors for its unique experience.' },
    ];
    
    return { reviews };
  }
);

export async function getPlaceDetails(input: GetPlaceDetailsInput): Promise<GetPlaceDetailsOutput> {
  return getPlaceDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getPlaceDetailsPrompt',
  input: { schema: GetPlaceDetailsInputSchema },
  output: { schema: GetPlaceDetailsOutputSchema },
  tools: [getReviews],
  prompt: `You are a Cebu tour guide. Provide a detailed history and cultural background for the given place: {{{placeName}}}.

  Also provide the following:
  - Detailed directions on how to get there from a central point in Cebu City (e.g., Fuente Osmeña Circle).
  - A valid, full Google Maps URL for the location. Do not use a shortened URL (like goo.gl or maps.app.goo.gl).
  - Use the getReviews tool to find user reviews for this place and include them in the output.

  Important: Do not use any markdown formatting, such as asterisks. The output should be plain text.
`,
});

const getPlaceDetailsFlow = ai.defineFlow(
  {
    name: 'getPlaceDetailsFlow',
    inputSchema: GetPlaceDetailsInputSchema,
    outputSchema: GetPlaceDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
