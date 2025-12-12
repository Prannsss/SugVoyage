// app/settings/preferences/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserPreference from "@/components/UserPreference";
import { useRouter } from "next/navigation";

export default function EditPreferencesPage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedPreferences = localStorage.getItem("userPreferences");
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handleSavePreferences = () => {
    setIsSaving(true);
    // In a real app, you would save to your backend here
    setTimeout(() => {
      setIsSaving(false);
      router.push("/preferences-results");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/preferences-results"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-4"
          >
            <ArrowLeft size={16} />
            Back to Results
          </Link>
          <h1 className="text-3xl font-bold mb-2">Edit Your Preferences</h1>
          <p className="text-gray-600">
            Update your travel preferences to get better recommendations
          </p>
        </div>

        {/* UserPreference Component */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
          <UserPreference
            onComplete={handleSavePreferences}
            onSkip={() => router.push("/preferences-results")}
            isFullScreen={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="outline"
            onClick={() => router.push("/preferences-results")}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSavePreferences}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
