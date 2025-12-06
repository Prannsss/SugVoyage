"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  generatePersonalizedItinerary,
  type GeneratePersonalizedItineraryOutput,
} from "@/ai/flows/generate-personalized-itinerary";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Wand2,
  Map,
  Calendar,
  DollarSign,
  ExternalLink,
  Download,
  Redo,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const formSchema = z.object({
  interests: z
    .string()
    .min(10, "Please describe your interests in a bit more detail."),
  budget: z.enum(["low", "medium", "high"], {
    required_error: "Please select a budget.",
  }),
  tripLength: z.coerce
    .number()
    .int()
    .min(1, "Trip must be at least 1 day long."),
  groupType: z.string().min(1, "Please specify the group type."),
});

const loadingTexts = ["Crafting your", "Helping you plan your"];

export default function ItineraryBuilderPage() {
  const [itinerary, setItinerary] =
    useState<GeneratePersonalizedItineraryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: "",
      tripLength: undefined,
      groupType: "",
    },
  });

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingTextIndex(
          (prevIndex) => (prevIndex + 1) % loadingTexts.length
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setItinerary(null);
    try {
      const result = await generatePersonalizedItinerary(values);
      setItinerary(result);
      toast({
        title: "Itinerary Generated!",
        description: "Your personalized Cebu adventure awaits.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Oh no! Something went wrong.",
        description: "We couldn't generate your itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGenerateNew = () => {
    setItinerary(null);
    // form.reset(); // uncomment if you want to reset form to default values
  };

  return (
    <div
      className="space-y-8 px-4 md:px-6 pt-20 md:pt-8 pb-24 md:pb-8"
      suppressHydrationWarning
    >
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl md:text-5xl">
          Itinerary Builder
        </h1>
        <p className="text-muted-foreground md:text-xl/relaxed">
          Craft your perfect Cebu getaway in seconds with the help of AI.
        </p>
      </header>

      {!itinerary && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Your Travel Preferences</CardTitle>
            <CardDescription>
              Tell us what you're looking for, and our AI assistant will do the
              rest.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., historical landmarks, diving, local cuisine..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tripLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trip Length (days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="groupType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Group Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select group type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="solo">Solo</SelectItem>
                            <SelectItem value="couple">Couple</SelectItem>
                            <SelectItem value="family">Family</SelectItem>
                            <SelectItem value="friends">Friends</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Itinerary
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="space-y-6">
          <div className="flex justify-center items-center gap-4 text-muted-foreground transition-all duration-300">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h3 className="text-xl font-semibold">
              <span className="inline-block transition-opacity duration-300">
                {loadingTexts[loadingTextIndex]}
              </span>
              <span> adventure...</span>
            </h3>
          </div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="space-y-2 pt-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {itinerary && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg bg-secondary/50">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <Sparkles className="h-7 w-7 text-accent" />
              {itinerary.itineraryTitle}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleGenerateNew}>
                <Redo className="mr-2 h-4 w-4" />
                Generate New
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download for Offline Use
              </Button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-3 space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  <Calendar className="h-8 w-8 text-primary" />
                  <CardTitle>Daily Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="day-1"
                    className="w-full"
                  >
                    {itinerary.schedule.map((day) => (
                      <AccordionItem key={day.day} value={`day-${day.day}`}>
                        <AccordionTrigger className="text-lg font-semibold">
                          Day {day.day}: {day.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-5 space-y-2 text-foreground/80">
                            {day.activities.map((activity, index) => (
                              <li key={index}>{activity}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  <DollarSign className="h-8 w-8 text-accent" />
                  <CardTitle>Cost Estimate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{itinerary.costEstimate}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                  <Map className="h-8 w-8 text-accent" />
                  <CardTitle>Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <a
                      href={itinerary.map}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Google Maps
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
