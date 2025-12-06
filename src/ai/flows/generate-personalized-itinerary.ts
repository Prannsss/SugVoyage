"use server";
/**
 * @fileOverview A personalized travel itinerary generation AI agent.
 *
 * - generatePersonalizedItinerary - A function that generates a personalized travel itinerary.
 * - GeneratePersonalizedItineraryInput - The input type for the generatePersonalizedItinerary function.
 * - GeneratePersonalizedItineraryOutput - The return type for the generatePersonalizedItinerary function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GeneratePersonalizedItineraryInputSchema = z.object({
  interests: z
    .string()
    .describe(
      "The interests of the user, e.g., beaches, historical sites, food."
    ),
  budget: z.enum(["low", "medium", "high"]).describe("The budget of the user."),
  tripLength: z
    .number()
    .describe("The length of the trip in days, must be an integer."),
  groupType: z
    .string()
    .describe("The type of group, e.g., family, friends, solo traveler."),
});

export type GeneratePersonalizedItineraryInput = z.infer<
  typeof GeneratePersonalizedItineraryInputSchema
>;

const DailyScheduleSchema = z.object({
  day: z.number().describe("The day number of the trip."),
  title: z.string().describe("A catchy title for the day's activities."),
  activities: z
    .array(z.string())
    .describe("A list of activities planned for the day."),
});

const GeneratePersonalizedItineraryOutputSchema = z.object({
  itineraryTitle: z
    .string()
    .describe("A creative and engaging title for the entire trip itinerary."),
  costEstimate: z.string().describe("The estimated cost of the trip in USD."),
  schedule: z
    .array(DailyScheduleSchema)
    .describe("A day-by-day schedule of the trip."),
  map: z
    .string()
    .url()
    .describe(
      "A full, valid Google Maps URL for the itinerary. It should not be a shortened URL."
    ),
});

export type GeneratePersonalizedItineraryOutput = z.infer<
  typeof GeneratePersonalizedItineraryOutputSchema
>;

export async function generatePersonalizedItinerary(
  input: GeneratePersonalizedItineraryInput
): Promise<GeneratePersonalizedItineraryOutput> {
  return generatePersonalizedItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: "generatePersonalizedItineraryPrompt",
  input: { schema: GeneratePersonalizedItineraryInputSchema },
  output: { schema: GeneratePersonalizedItineraryOutputSchema },
  prompt: `You are a travel agent specializing in creating personalized travel itineraries for Cebu.

  Based on the user's interests, budget, trip length, and group type, generate a detailed travel itinerary.

  Interests: {{{interests}}}
  Budget: {{{budget}}}
  Trip Length: {{{tripLength}}} days
  Group Type: {{{groupType}}}

  The output must be structured according to the output schema.
  - itineraryTitle: A creative title for the whole trip.
  - costEstimate: An estimate of the cost in USD.
  - schedule: A day-by-day schedule. Each day should have a title and a list of activities.
  - map: A valid, full Google Maps URL for the itinerary. Do not use a shortened URL.

  Do not use any markdown formatting in the string outputs.
`,
});

const generatePersonalizedItineraryFlow = ai.defineFlow(
  {
    name: "generatePersonalizedItineraryFlow",
    inputSchema: GeneratePersonalizedItineraryInputSchema,
    outputSchema: GeneratePersonalizedItineraryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
