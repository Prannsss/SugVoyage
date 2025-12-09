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
  Wand2,
  Calendar,
  Star,
  Download,
  Copy,
  Clock,
  Users,
  ChevronRight,
  Sparkles,
  Palmtree,
  Building,
  Mountain,
  ChefHat,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    .min(1, "Trip must be at least 1 day long.")
    .max(7, "Maximum 7 days for planning."),
  groupType: z.string().min(1, "Please specify the group type."),
});

// Popular templates
const popularTemplates = [
  {
    id: 1,
    title: "Beach & Island Hopping",
    days: 3,
    description: "Perfect sun, sand and sea getaway",
    icon: <Palmtree className="h-8 w-8" />,
  },
  {
    id: 2,
    title: "Cebu City Explorer",
    days: 2,
    description: "History, culture and city life",
    icon: <Building className="h-8 w-8" />,
  },
  {
    id: 3,
    title: "Adventure Seeker",
    days: 4,
    description: "Waterfalls, hikes and thrills",
    icon: <Mountain className="h-8 w-8" />,
  },
  {
    id: 4,
    title: "Foodie Tour",
    days: 2,
    description: "Taste the best of Cebu cuisine",
    icon: <ChefHat className="h-8 w-8" />,
  },
];

const loadingTexts = ["Planning your", "Creating your", "Crafting your"];

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
      tripLength: 3,
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
        title: "Itinerary Created!",
        description: "Your travel plan is ready.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleUseTemplate = (template: (typeof popularTemplates)[0]) => {
    let interests = "";
    switch (template.id) {
      case 1:
        interests =
          "beaches, island hopping, snorkeling, relaxation, sunset views";
        break;
      case 2:
        interests =
          "historical sites, museums, local culture, city exploration";
        break;
      case 3:
        interests =
          "waterfalls, hiking, adventure activities, nature exploration";
        break;
      case 4:
        interests =
          "local food, street food, restaurants, culinary experiences";
        break;
    }

    form.setValue("interests", interests);
    form.setValue("tripLength", template.days);
    form.setValue("groupType", "friends");
    form.setValue("budget", "medium");

    toast({
      title: "Template loaded",
      description: `Starting with ${template.title}`,
    });
  };

  const handleSaveToCalendar = () => {
    toast({
      title: "Added to Calendar",
      description: "Itinerary saved to your calendar app",
    });
  };

  const handleCopyItinerary = () => {
    navigator.clipboard.writeText(JSON.stringify(itinerary, null, 2));
    toast({
      title: "Copied!",
      description: "Itinerary copied to clipboard",
    });
  };

  return (
    <div className="space-y-8 px-4 md:px-6 pt-20 md:pt-8 pb-24 md:pb-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter font-headline">
          Itinerary Builder
        </h1>
        <p className="text-muted-foreground">
          Plan your perfect Cebu trip with AI assistance
        </p>
      </header>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {!itinerary ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Create Your Itinerary
                </CardTitle>
                <CardDescription>
                  Fill in your preferences to generate a personalized plan
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
                          <FormLabel>What are you interested in?</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., beaches, hiking, local food, history..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                  <SelectValue placeholder="Select" />
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
                            <FormLabel>Days</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" max="7" {...field} />
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
                            <FormLabel>Group</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
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

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                      >
                        <Wand2 className="mr-2 h-4 w-4" />
                        {isLoading ? "Generating..." : "Generate Itinerary"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                      >
                        Clear
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-headline">
                        {itinerary.itineraryTitle}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {itinerary.schedule.length} days
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {form.getValues("groupType")}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveToCalendar}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Save to Calendar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyItinerary}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {itinerary.schedule.map((day) => (
                      <div key={day.day} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 text-primary font-bold rounded-lg w-12 h-12 flex items-center justify-center">
                            Day {day.day}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{day.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {day.activities.length} activities
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3 pl-4 border-l-2 border-primary/20 ml-6">
                          {day.activities.map((activity, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50"
                            >
                              <div className="bg-primary/10 rounded-full p-2 mt-1">
                                <Clock className="h-4 w-4 text-primary" />
                              </div>
                              <p className="flex-1">{activity}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Cost Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {itinerary.costEstimate}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Estimated total cost for {form.getValues("tripLength")}{" "}
                      days
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleSaveToCalendar}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Add to Calendar
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleCopyItinerary}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Itinerary
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={itinerary.map}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        View Map
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground"
                      onClick={() => setItinerary(null)}
                    >
                      Create New Itinerary
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Templates</CardTitle>
              <CardDescription>
                Start with a ready-made itinerary and customize it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 rounded-xl border hover:border-primary/50 hover:bg-accent/50 transition-colors cursor-pointer group"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{template.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold">{template.title}</h3>
                          <Badge variant="outline">
                            {template.days}{" "}
                            {template.days === 1 ? "day" : "days"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Use Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Choose a template</h4>
                    <p className="text-sm text-muted-foreground">
                      Select a pre-made itinerary that matches your interests
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Customize it</h4>
                    <p className="text-sm text-muted-foreground">
                      Adjust days, budget, and activities to your preference
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-full p-2 mt-1">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Save & Share</h4>
                    <p className="text-sm text-muted-foreground">
                      Save to calendar or share with your travel companions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center space-y-4 p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <div>
              <h3 className="text-xl font-semibold">
                {loadingTexts[loadingTextIndex]} itinerary...
              </h3>
              <p className="text-muted-foreground mt-2">
                Finding the best activities and routes for you
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
