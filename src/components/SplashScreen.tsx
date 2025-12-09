"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane } from "lucide-react";

interface SplashScreenProps {
  onLoadingComplete?: () => void;
  minDuration?: number;
}

export default function SplashScreen({
  onLoadingComplete,
  minDuration = 2000,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 20; // Smoother progress animation
    const totalSteps = minDuration / interval;
    const increment = 100 / totalSteps;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        return next >= 100 ? 100 : next;
      });
    }, interval);

    const timer = setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete?.();
    }, minDuration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [minDuration, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Plane and Progress Container */}
          <div className="mb-8 flex flex-col items-center">
            {/* Animated Plane */}
            <motion.div
              className="relative mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                animate={{
                  x: [-24, 24, -24],
                  rotate: [0, 3, 0],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Plane className="h-12 w-12 text-blue-600" />
              </motion.div>
            </motion.div>

            {/* Percentage Display */}
            <div className="mb-6 text-center">
              <motion.div
                className="text-4xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {Math.round(progress)}%
              </motion.div>
              <motion.div
                className="mt-1 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Loading SugVoyage
              </motion.div>
            </div>
          </div>

          {/* Progress Bar - Black Version */}
          <div className="w-56">
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-300">
              <motion.div
                className="h-full bg-gray-900"
                initial={{ width: "0%" }}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* "Preparing your adventure" text */}
            <motion.div
              className="mt-4 text-center text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Preparing your adventure...
            </motion.div>
          </div>

          {/* App Name at Bottom */}
          <motion.div
            className="absolute bottom-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-lg font-semibold text-gray-800">SugVoyage</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
