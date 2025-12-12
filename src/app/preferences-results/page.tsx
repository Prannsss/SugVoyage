// app/preferences-results/page.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Mountain,
  Lightbulb,
  Sparkles,
  Star,
  Heart,
  Navigation,
  Calendar,
  Clock,
  TrendingUp,
  Map,
  Coffee,
  Camera,
  Palmtree,
  Castle,
  Utensils,
  Zap,
  Users,
  Compass,
  Droplets,
  Building,
  Trees,
  Moon,
  ShoppingBag,
  Apple,
  User,
  Backpack,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserPreferences {
  interests: string[];
  travelTypes: string[];
  suggestions: string;
}

interface Recommendation {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ComponentType<any>;
  rating: number;
  matchScore: number;
  tags: string[];
  location: string;
  estimatedCost: string;
  timeNeeded: string;
}

export default function PreferencesResultsPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    // Get preferences from localStorage
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
      const parsedPrefs = JSON.parse(savedPreferences);
      setPreferences(parsedPrefs);

      // Generate recommendations based on preferences
      const generatedRecs = generateRecommendations(parsedPrefs);
      setRecommendations(generatedRecs);
    } else {
      // No preferences found, redirect to home
      router.push("/");
    }

    setLoading(false);
  }, [router]);

  const generateRecommendations = (
    prefs: UserPreferences
  ): Recommendation[] => {
    const allRecommendations: Recommendation[] = [
      // Historical & Cultural
      {
        id: "1",
        title: "Magellan's Cross & Basilica Minore",
        category: "Historical",
        description:
          "Explore Cebu's historical landmarks and Spanish colonial architecture",
        icon: Castle,
        rating: 4.8,
        matchScore: prefs.interests.includes("historical") ? 95 : 30,
        tags: ["History", "Culture", "Architecture"],
        location: "Downtown Cebu City",
        estimatedCost: "₱500-1,000",
        timeNeeded: "2-3 hours",
      },
      {
        id: "2",
        title: "Fort San Pedro",
        category: "Historical",
        description: "Oldest triangular bastion fort in the Philippines",
        icon: Castle,
        rating: 4.5,
        matchScore: prefs.interests.includes("historical") ? 90 : 25,
        tags: ["History", "Museum", "Spanish Era"],
        location: "Cebu City Port Area",
        estimatedCost: "₱300-500",
        timeNeeded: "1-2 hours",
      },

      // Beaches & Islands
      {
        id: "3",
        title: "Bantayan Island Beach Hopping",
        category: "Beaches",
        description: "White sand beaches and crystal clear waters",
        icon: Palmtree,
        rating: 4.9,
        matchScore: prefs.interests.includes("beaches") ? 98 : 40,
        tags: ["Beach", "Island", "Relaxation"],
        location: "Bantayan Island",
        estimatedCost: "₱2,000-4,000",
        timeNeeded: "Full day",
      },
      {
        id: "4",
        title: "Malapascua Island Diving",
        category: "Beaches",
        description:
          "Famous for thresher shark encounters and vibrant coral reefs",
        icon: Palmtree,
        rating: 4.7,
        matchScore:
          prefs.interests.includes("beaches") &&
          prefs.travelTypes.includes("adventure")
            ? 96
            : 35,
        tags: ["Diving", "Marine Life", "Adventure"],
        location: "Malapascua Island",
        estimatedCost: "₱3,000-6,000",
        timeNeeded: "2-3 days",
      },

      // Food & Cuisine
      {
        id: "5",
        title: "Cebu Lechon Food Crawl",
        category: "Food",
        description: "Taste the famous Cebu lechon and local delicacies",
        icon: Utensils,
        rating: 4.8,
        matchScore: prefs.interests.includes("cuisine") ? 97 : 45,
        tags: ["Food Tour", "Local Cuisine", "Street Food"],
        location: "Carcar City & Cebu City",
        estimatedCost: "₱1,000-2,000",
        timeNeeded: "Half day",
      },
      {
        id: "6",
        title: "Larsian BBQ Experience",
        category: "Food",
        description: "Authentic Filipino barbecue at its best",
        icon: Utensils,
        rating: 4.6,
        matchScore: prefs.interests.includes("cuisine") ? 92 : 38,
        tags: ["Barbecue", "Local", "Budget-friendly"],
        location: "Fuente Osmeña, Cebu City",
        estimatedCost: "₱500-800",
        timeNeeded: "2-3 hours",
      },

      // Adventure & Nature
      {
        id: "7",
        title: "Kawasan Falls Canyoneering",
        category: "Adventure",
        description: "Thrilling canyoneering adventure with waterfall jumps",
        icon: Zap,
        rating: 4.9,
        matchScore: prefs.travelTypes.includes("adventure") ? 99 : 20,
        tags: ["Adventure", "Waterfalls", "Extreme"],
        location: "Badian, Cebu",
        estimatedCost: "₱1,500-2,500",
        timeNeeded: "Full day",
      },
      {
        id: "8",
        title: "Osmeña Peak Sunrise Hike",
        category: "Adventure",
        description: "Highest peak in Cebu with breathtaking sunrise views",
        icon: Mountain,
        rating: 4.7,
        matchScore:
          prefs.interests.includes("mountains") &&
          prefs.travelTypes.includes("adventure")
            ? 94
            : 32,
        tags: ["Hiking", "Sunrise", "Panoramic Views"],
        location: "Mantalungon, Dalaguete",
        estimatedCost: "₱800-1,500",
        timeNeeded: "Early morning",
      },

      // Relaxation & Wellness
      {
        id: "9",
        title: "Spa & Wellness Retreat",
        category: "Relaxation",
        description: "Luxury spa experience with traditional Filipino hilot",
        icon: Coffee,
        rating: 4.8,
        matchScore: prefs.travelTypes.includes("relaxation") ? 93 : 42,
        tags: ["Spa", "Wellness", "Relaxation"],
        location: "Various locations",
        estimatedCost: "₱1,500-2,500",
        timeNeeded: "3-4 hours",
      },

      // Photography & Nature
      {
        id: "10",
        title: "Sirao Flower Farm",
        category: "Nature",
        description: "Little Amsterdam of Cebu with colorful celosia flowers",
        icon: Camera,
        rating: 4.6,
        matchScore: prefs.travelTypes.includes("nature") ? 91 : 48,
        tags: ["Photography", "Flowers", "Scenic"],
        location: "Sirao, Cebu City",
        estimatedCost: "₱300-500",
        timeNeeded: "2-3 hours",
      },

      // Family Activities
      {
        id: "11",
        title: "Cebu Safari & Adventure Park",
        category: "Family",
        description:
          "Wildlife safari experience with family-friendly activities",
        icon: Users,
        rating: 4.7,
        matchScore: prefs.travelTypes.includes("family") ? 96 : 36,
        tags: ["Family", "Animals", "Adventure"],
        location: "Carmen, Cebu",
        estimatedCost: "₱1,200-1,800 per person",
        timeNeeded: "Full day",
      },
    ];

    // Sort by match score
    return allRecommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8);
  };

  const getCategories = () => {
    if (!recommendations.length) return [];
    const categories = Array.from(
      new Set(recommendations.map((r) => r.category))
    );
    return ["all", ...categories];
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "historical":
        return Castle;
      case "beaches":
        return Palmtree;
      case "food":
        return Utensils;
      case "adventure":
        return Zap;
      case "relaxation":
        return Coffee;
      case "nature":
        return Camera;
      case "family":
        return Users;
      default:
        return MapPin;
    }
  };

  const filteredRecommendations =
    activeCategory === "all"
      ? recommendations
      : recommendations.filter((rec) => rec.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2f7cc4] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2f7cc4]">
            Loading your personalized recommendations...
          </p>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Section */}
      <div
        className="bg-cover bg-center text-white relative"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/city.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
              <Sparkles className="text-white" size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Your Personalized Cebu Adventure Awaits! 🎉
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Based on your preferences, we've curated these perfect experiences
              just for you
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Preferences Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-blue-100"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-xl font-bold text-[#2f7cc4]">
              Your Travel Profile
            </h2>
            <Link href="/settings/preferences">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-[#2f7cc4]/30 text-[#2f7cc4] hover:bg-[#2f7cc4]/10 w-full sm:w-auto"
              >
                <Edit2 size={14} />
                Edit Preferences
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Interests */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MapPin size={16} className="text-[#2f7cc4]" />
                </div>
                <h3 className="font-semibold text-sm text-[#2f7cc4]">
                  Interests
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.interests.map((interest, index) => {
                  const icons = [
                    Castle,
                    Palmtree,
                    Droplets,
                    Building,
                    Trees,
                    Utensils,
                    Moon,
                    ShoppingBag,
                  ];
                  const Icon = icons[index] || MapPin;
                  return (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2f7cc4] text-white text-xs rounded-full hover:bg-[#2f7cc4]/90 transition-colors"
                    >
                      <Icon size={12} />
                      {interest}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Travel Style */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mountain size={16} className="text-[#2f7cc4]" />
                </div>
                <h3 className="font-semibold text-sm text-[#2f7cc4]">
                  Travel Style
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {preferences.travelTypes.map((style, index) => {
                  const icons = [
                    Zap,
                    Coffee,
                    Castle,
                    Apple,
                    Camera,
                    User,
                    Users,
                    Backpack,
                  ];
                  const Icon = icons[index] || Compass;
                  return (
                    <span
                      key={style}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2f7cc4] text-white text-xs rounded-full hover:bg-[#2f7cc4]/90 transition-colors"
                    >
                      <Icon size={12} />
                      {style}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Suggestions Preference */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Lightbulb size={16} className="text-[#2f7cc4]" />
                </div>
                <h3 className="font-semibold text-sm text-[#2f7cc4]">
                  Recommendation Style
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#2f7cc4]">
                  {preferences.suggestions}
                </span>
                <Lightbulb size={14} className="text-[#2f7cc4]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recommendations Section */}
        <div className="mb-10">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2f7cc4]">
                Curated Recommendations
              </h2>
              <p className="text-[#2f7cc4]/80 mt-1">
                Top picks based on your preferences
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <span className="text-sm text-[#2f7cc4]/80">Best Match:</span>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 rounded-full">
                <TrendingUp size={14} className="text-[#2f7cc4]" />
                <span className="text-sm font-medium text-[#2f7cc4]">
                  {recommendations.length > 0
                    ? `${Math.round(recommendations[0].matchScore)}% match`
                    : "Calculating..."}
                </span>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {getCategories().map((category) => {
              const CategoryIcon = getCategoryIcon(category);
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`
                    px-4 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2
                    ${
                      activeCategory === category
                        ? "bg-[#2f7cc4] text-white shadow-sm"
                        : "bg-white text-[#2f7cc4] hover:bg-blue-50 border border-blue-200"
                    }
                  `}
                >
                  <CategoryIcon size={14} />
                  <span className="text-sm font-medium capitalize">
                    {category === "all" ? "All" : category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Recommendations Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredRecommendations.map((rec, index) => {
                const RecIcon = rec.icon;
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-blue-100 flex flex-col h-full"
                  >
                    {/* Match Score Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className="flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-full border border-blue-100 shadow-sm">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            rec.matchScore >= 90
                              ? "bg-green-500"
                              : rec.matchScore >= 70
                              ? "bg-yellow-500"
                              : "bg-[#2f7cc4]"
                          }`}
                        />
                        <span className="text-xs font-bold text-[#2f7cc4]">
                          {rec.matchScore}%
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1">
                      {/* Header with Icon */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <RecIcon className="text-[#2f7cc4]" size={22} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-sm line-clamp-2">
                            {rec.title}
                          </h3>
                          <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#2f7cc4] text-xs rounded-full font-medium mt-1">
                            {rec.category}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {rec.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {rec.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-blue-50 text-[#2f7cc4] text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Details */}
                      <div className="space-y-2 border-t border-blue-100 pt-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-[#2f7cc4]" />
                            <span className="text-gray-700 truncate">
                              {rec.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Star
                              size={12}
                              className="text-yellow-500 fill-yellow-500"
                            />
                            <span className="font-medium text-gray-700">
                              {rec.rating}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-[#2f7cc4]" />
                            <span className="text-gray-700">
                              {rec.timeNeeded}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Navigation size={12} className="text-[#2f7cc4]" />
                            <span className="font-medium text-gray-700">
                              {rec.estimatedCost}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fixed Action Buttons at Bottom */}
                    <div className="border-t border-blue-100 p-3">
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-[#2f7cc4] hover:bg-[#2f7cc4]/90 text-white text-sm h-9">
                          <Heart size={14} className="mr-1.5" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-[#2f7cc4]/30 text-[#2f7cc4] hover:bg-blue-50 text-sm h-9"
                        >
                          <Navigation size={14} className="mr-1.5" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-r from-[#2f7cc4] to-[#2f7cc4]/90 rounded-2xl p-6 md:p-8 text-white mb-8 shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                Ready to Explore Cebu?
              </h3>
              <p className="text-white/90 text-sm md:text-base">
                Let us create a personalized itinerary based on your selected
                recommendations
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link href="/plan" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-[#2f7cc4] hover:bg-blue-50 font-medium w-full"
                >
                  <Calendar className="mr-2" size={18} />
                  Plan My Trip
                </Button>
              </Link>
              <Link href="/explore" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/20 w-full"
                >
                  <Map className="mr-2" size={18} />
                  Explore More
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Tips Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-[#2f7cc4] mb-6">
            Pro Tips for Your Trip
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                <Calendar size={20} className="text-[#2f7cc4]" />
              </div>
              <h4 className="font-semibold text-[#2f7cc4] mb-2">
                Best Time to Visit
              </h4>
              <p className="text-sm text-[#2f7cc4]/80">
                {preferences.interests.includes("beaches")
                  ? "Dry season (Dec-May) for beach activities"
                  : "Year-round for cultural and city attractions"}
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                <Navigation size={20} className="text-[#2f7cc4]" />
              </div>
              <h4 className="font-semibold text-[#2f7cc4] mb-2">Travel Tips</h4>
              <p className="text-sm text-[#2f7cc4]/80">
                {preferences.travelTypes.includes("adventure")
                  ? "Book adventure activities in advance during peak season"
                  : "Try local transportation for authentic experience"}
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                <Compass size={20} className="text-[#2f7cc4]" />
              </div>
              <h4 className="font-semibold text-[#2f7cc4] mb-2">
                Local Insights
              </h4>
              <p className="text-sm text-[#2f7cc4]/80">
                {preferences.travelTypes.includes("cultural")
                  ? "Visit historical sites early morning to avoid crowds"
                  : "Weekdays are less crowded for popular attractions"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
