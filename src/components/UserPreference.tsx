import React, { useState } from "react";
import {
  ChevronRight,
  MapPin,
  Mountain,
  Lightbulb,
  Check,
  X,
  Castle,
  Palmtree,
  Droplets,
  Building,
  Trees,
  Utensils,
  Moon,
  ShoppingBag,
  Zap,
  Coffee,
  Camera,
  User,
  Users,
  Backpack,
  Map,
  Compass,
  Apple,
  Activity,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UserPreferenceProps {
  onComplete?: () => void;
  onSkip?: () => void;
  isFullScreen?: boolean;
}

type OptionType = {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description?: string;
};

type TabType = {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
  question: string;
  description?: string;
  options: OptionType[];
};

type PreferencesType = {
  interests: string[];
  travelTypes: string[];
  suggestions: string;
};

type IconType = React.ComponentType<{
  size?: number;
  className?: string;
}>;

const UserPreference: React.FC<UserPreferenceProps> = ({
  onComplete,
  onSkip,
  isFullScreen = false,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [preferences, setPreferences] = useState<PreferencesType>({
    interests: [],
    travelTypes: [],
    suggestions: "",
  });

  const tabs: TabType[] = [
    {
      id: 0,
      title: "Interests",
      icon: MapPin,
      question: "What catches your eye in Cebu?",
      description: "Select what excites you most",
      options: [
        { id: "historical", label: "Historical Sites", icon: Castle },
        { id: "beaches", label: "Beaches & Islands", icon: Palmtree },
        { id: "waterfalls", label: "Waterfalls", icon: Droplets },
        { id: "city", label: "City Attractions", icon: Building },
        { id: "mountains", label: "Mountain Views", icon: Trees },
        { id: "cuisine", label: "Local Cuisine", icon: Utensils },
        { id: "nightlife", label: "Nightlife", icon: Moon },
        { id: "shopping", label: "Shopping", icon: ShoppingBag },
      ],
    },
    {
      id: 1,
      title: "Travel Style",
      icon: Mountain,
      question: "How do you like to travel?",
      description: "Choose your travel personality",
      options: [
        { id: "adventure", label: "Adventure Seeker", icon: Zap },
        { id: "relaxation", label: "Relaxation & Leisure", icon: Coffee },
        { id: "cultural", label: "Cultural Explorer", icon: Castle },
        { id: "food", label: "Food Enthusiast", icon: Apple },
        { id: "nature", label: "Nature & Photography", icon: Camera },
        { id: "solo", label: "Solo Traveler", icon: User },
        { id: "family", label: "Family Vacation", icon: Users },
        { id: "backpacker", label: "Backpacker", icon: Backpack },
      ],
    },
    {
      id: 2,
      title: "Suggestions",
      icon: Lightbulb,
      question: "How would you like us to help?",
      description: "Tell us your preference for recommendations",
      options: [
        { id: "full", label: "Plan my full itinerary", icon: Map },
        { id: "popular", label: "Show popular spots", icon: Lightbulb },
        { id: "hidden", label: "Hidden gems & secrets", icon: Compass },
        { id: "food", label: "Food journey focus", icon: Apple },
        { id: "adventure", label: "Adventure activities", icon: Activity },
        { id: "relaxation", label: "Relaxation & wellness", icon: Heart },
      ],
    },
  ];

  const handleSelect = (tabId: number, value: string): void => {
    let key: keyof PreferencesType;

    if (tabId === 0) {
      key = "interests";
    } else if (tabId === 1) {
      key = "travelTypes";
    } else {
      key = "suggestions";
    }

    if (tabId === 0 || tabId === 1) {
      setPreferences((prev) => ({
        ...prev,
        [key]: (prev[key] as string[]).includes(value)
          ? (prev[key] as string[]).filter((item) => item !== value)
          : [...(prev[key] as string[]), value],
      }));
    } else {
      setPreferences((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  const handleNext = (): void => {
    if (activeTab < tabs.length - 1) {
      setActiveTab((prev) => prev + 1);
    } else {
      console.log("Preferences submitted:", preferences);
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handlePrevious = (): void => {
    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    }
  };

  const handleSkip = (): void => {
    if (onSkip) {
      onSkip();
    }
  };

  const isOptionSelected = (tabId: number, value: string): boolean => {
    if (tabId === 0) return preferences.interests.includes(value);
    if (tabId === 1) return preferences.travelTypes.includes(value);
    if (tabId === 2) return preferences.suggestions === value;
    return false;
  };

  const currentTab = tabs[activeTab];
  const TabIcon = currentTab.icon;
  const progressPercentage = ((activeTab + 1) / tabs.length) * 100;

  return (
    <div className={`${isFullScreen ? "h-full" : ""} z-[9999] relative`}>
      <div
        className={`${
          isFullScreen ? "h-full flex flex-col" : "max-w-4xl mx-auto p-4 md:p-8"
        }`}
      >
        {/* Mobile Full Screen Header */}
        {isFullScreen && (
          <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
                <TabIcon className="text-sky-600" size={14} />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-black">
                  Preferences
                </h1>
                <p className="text-xs text-gray-500">
                  {activeTab + 1}/{tabs.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="w-7 h-7 rounded-lg hover:bg-sky-50 flex items-center justify-center transition-colors"
              aria-label="Skip preferences"
            >
              <X size={16} className="text-sky-600" />
            </button>
          </div>
        )}

        <div className={`${isFullScreen ? "flex-1 overflow-auto p-4" : ""}`}>
          {/* Header for Desktop */}
          {!isFullScreen && (
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-xl font-bold text-black">
                    Sugvoyage Setup
                  </h1>
                  <p className="text-sky-600 text-sm mt-0.5">
                    Personalize your Cebu travel experience
                  </p>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-xs text-sky-600 hover:text-sky-700 px-2.5 py-1 rounded-md hover:bg-sky-50 transition-colors"
                >
                  Skip
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-sky-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-gray-500">
                    Step {activeTab + 1} of {tabs.length}
                  </span>
                  <span className="text-xs text-sky-600 font-medium">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Progress Indicators */}
          {isFullScreen && (
            <div className="mb-4">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-sky-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div
            className={`${
              isFullScreen
                ? "h-full"
                : "bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className={`${
                  isFullScreen ? "h-full flex flex-col" : "space-y-5"
                }`}
              >
                {/* Question Section */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center flex-shrink-0">
                      <TabIcon className="text-white" size={18} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-black">
                        {currentTab.question}
                      </h2>
                      {currentTab.description && (
                        <p className="text-sky-600 text-xs mt-0.5">
                          {currentTab.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {activeTab === 0 || activeTab === 1
                      ? "Select multiple options"
                      : "Select one option"}
                  </p>
                </div>

                {/* Options Grid - Ultra compact with icons */}
                <div
                  className={`grid ${
                    isFullScreen
                      ? "grid-cols-2 gap-2"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5"
                  } flex-1 ${isFullScreen ? "overflow-auto pb-16" : ""}`}
                >
                  {currentTab.options.map((option) => {
                    const selected = isOptionSelected(activeTab, option.id);
                    const OptionIcon = option.icon;

                    return (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelect(activeTab, option.id)}
                        className={`
                          relative p-3 rounded-lg border-2 transition-all duration-200
                          flex flex-col items-center justify-center min-h-[72px]
                          text-center group
                          ${
                            selected
                              ? "border-sky-500 bg-sky-50 text-sky-700"
                              : "border-gray-200 bg-white hover:border-sky-300 hover:bg-sky-50/30"
                          }
                        `}
                      >
                        {/* Icon */}
                        <div
                          className={`mb-1.5 transition-colors ${
                            selected
                              ? "text-sky-600"
                              : "text-gray-500 group-hover:text-sky-500"
                          }`}
                        >
                          <OptionIcon size={18} />
                        </div>

                        {/* Label */}
                        <span
                          className={`font-medium text-xs leading-tight px-1 ${
                            selected ? "text-sky-700" : "text-gray-700"
                          }`}
                        >
                          {option.label}
                        </span>

                        {/* Description (for suggestions) */}
                        {option.description && (
                          <span
                            className={`text-[10px] mt-1 ${
                              selected
                                ? "text-sky-500/80"
                                : "text-gray-400 group-hover:text-sky-400"
                            }`}
                          >
                            {option.description}
                          </span>
                        )}

                        {/* Selection indicator */}
                        {selected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Selection Summary */}
                {((activeTab === 0 && preferences.interests.length > 0) ||
                  (activeTab === 1 && preferences.travelTypes.length > 0)) && (
                  <div className="mt-3 p-3 bg-sky-50/50 rounded-lg border border-sky-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-sky-700">
                        Selected (
                        {
                          preferences[
                            activeTab === 0 ? "interests" : "travelTypes"
                          ].length
                        }
                        )
                      </span>
                      <span className="text-[10px] text-sky-600">
                        Click to remove
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(
                        preferences[
                          activeTab === 0 ? "interests" : "travelTypes"
                        ] as string[]
                      ).map((itemId: string) => {
                        const item = currentTab.options.find(
                          (opt) => opt.id === itemId
                        );
                        if (!item) return null;
                        const ItemIcon = item.icon;

                        return (
                          <button
                            key={itemId}
                            onClick={() => handleSelect(activeTab, itemId)}
                            className="px-2.5 py-1 bg-sky-500 text-white text-[11px] rounded-full hover:bg-sky-600 transition-colors flex items-center gap-1.5"
                          >
                            <ItemIcon size={10} />
                            {item.label}
                            <X size={9} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div
                  className={`${
                    isFullScreen
                      ? "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4"
                      : "pt-5 border-t border-gray-100"
                  } flex justify-between gap-3`}
                >
                  <button
                    onClick={handlePrevious}
                    disabled={activeTab === 0}
                    className={`
                      px-4 py-2.5 rounded-lg font-medium transition-all
                      flex items-center justify-center flex-1 max-w-[120px]
                      text-sm
                      ${
                        activeTab === 0
                          ? "text-gray-400 cursor-not-allowed bg-gray-50"
                          : "text-sky-600 hover:bg-sky-50 border border-sky-200"
                      }
                    `}
                  >
                    <ChevronRight className="rotate-180 mr-1.5" size={14} />
                    Back
                  </button>

                  <button
                    onClick={handleNext}
                    className={`
                      px-4 py-2.5 rounded-lg font-medium transition-all
                      flex items-center justify-center flex-1 text-sm
                      bg-sky-500 text-white hover:bg-sky-600 shadow-sm hover:shadow
                      ${isFullScreen ? "max-w-[calc(100%-124px)]" : ""}
                    `}
                  >
                    {activeTab === tabs.length - 1
                      ? "Complete Setup"
                      : "Continue"}
                    {activeTab < tabs.length - 1 && (
                      <ChevronRight className="ml-1.5" size={14} />
                    )}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Help text for desktop */}
          {!isFullScreen && (
            <div className="mt-4 text-center">
              <p className="text-xs text-sky-600">
                These preferences help us personalize your Cebu experience
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPreference;
