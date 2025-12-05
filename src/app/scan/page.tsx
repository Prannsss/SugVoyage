
'use client';

import { useState, useRef, useEffect } from 'react';
import { scanAndLearnAboutLandmark, type ScanAndLearnAboutLandmarkOutput } from '@/ai/flows/scan-and-learn-about-landmarks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Camera, Upload, Volume2, Info, Sparkles, Settings, ArrowLeft, X } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { usePermission } from '@/hooks/use-permission';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

export default function ScanAndLearnPage() {
  const [result, setResult] = useState<ScanAndLearnAboutLandmarkOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const { hasPermission: hasCameraPermission, setPermission: setCameraPermission } = usePermission('camera', true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isCleaningUp = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);


  // Aggressive camera cleanup function
  const stopAllCameraStreams = useRef(() => {
    console.log('Stopping all camera streams...');
    
    // Stop the video element stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Video element track stopped:', track.kind);
      });
      videoRef.current.srcObject = null;
    }
    
    // Stop the ref stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Ref stream track stopped:', track.kind);
      });
      streamRef.current = null;
    }
    
    // Get all active media streams and stop them
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('Force stopped track:', track.kind);
        });
      })
      .catch(() => {
        // Expected if no permission or no camera
      });
    
    setIsCameraOn(false);
    isCleaningUp.current = false;
    console.log('Camera cleanup completed');
  });

  useEffect(() => {
    const getCameraStream = async () => {
      if (hasCameraPermission) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsCameraOn(true);
            console.log('Camera started successfully');
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Could not access the camera. Please check browser permissions.',
          });
          setCameraPermission(false);
        }
      } else {
        stopAllCameraStreams.current();
      }
    };

    if (!isInitializing) {
        getCameraStream();
    }
    
    // Cleanup function that runs when dependencies change or component unmounts
    return () => {
      stopAllCameraStreams.current();
    };
  }, [hasCameraPermission, setCameraPermission, toast, isInitializing]);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 200);
    return () => clearTimeout(timer);
  }, []);

  // Pathname change detection - stops camera when route changes
  useEffect(() => {
    // When pathname changes (route navigation), stop camera
    if (pathname !== '/scan') {
      console.log('🚀 Route changed from /scan, stopping camera...');
      stopAllCameraStreams.current();
    }
  }, [pathname]);

  // Additional cleanup for component unmount - this ensures camera stops on navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('🚀 Page unloading, stopping camera...');
      stopAllCameraStreams.current();
    };

    // Listen for route changes (Next.js navigation)
    const handleRouteChange = () => {
      console.log('🚀 Route changing, stopping camera...');
      stopAllCameraStreams.current();
    };

    // Listen for clicks on navigation elements
    const handleNavigationClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a') || target.getAttribute('href')) {
        console.log('🚀 Navigation click detected, stopping camera...');
        setTimeout(() => stopAllCameraStreams.current(), 100);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handleRouteChange);
    document.addEventListener('click', handleNavigationClick, true);

    // Main cleanup for component unmount (navigation)
    return () => {
      console.log('🚀 Component unmounting, stopping camera...');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handleRouteChange);
      document.removeEventListener('click', handleNavigationClick, true);
      stopAllCameraStreams.current();
    };
  }, []);

  // Handle page visibility changes (tab switching, minimizing browser)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, pause camera
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => {
            track.enabled = false;
            console.log('Camera paused due to page visibility change');
          });
        }
      } else {
        // Page is visible, resume camera
        if (streamRef.current && hasCameraPermission) {
          streamRef.current.getTracks().forEach(track => {
            track.enabled = true;
            console.log('Camera resumed due to page visibility change');
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasCameraPermission]);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    processImage(file);
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  const takePicture = () => {
    if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if(blob) {
                    processImage(blob);
                }
            }, 'image/jpeg');
        }
    }
  }

  const processImage = (file: File | Blob) => {
    setResult(null);
    setIsLoading(true);
    setPhotoPreview(null);

    // Stop camera when processing image
    stopAllCameraStreams.current();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const photoDataUri = e.target?.result as string;
      const voice = localStorage.getItem('setting_audioVoice') || 'Algenib';
      setPhotoPreview(photoDataUri);
      try {
        const scanResult = await scanAndLearnAboutLandmark({ photoDataUri, voice });
        setResult(scanResult);
      } catch (error) {
        console.error(error);
        toast({
          title: "Scan Failed",
          description: "Could not identify the object. Please try another photo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  const resetScan = () => {
      setPhotoPreview(null);
      setResult(null);
      setIsLoading(false);
      if (hasCameraPermission && !isInitializing) {
        // Re-trigger camera stream logic
        const getCameraStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsCameraOn(true);
                }
            } catch (error) {
                console.error('Error restarting camera:', error);
                setCameraPermission(false);
            }
        };
        getCameraStream();
      }
  }
  
  const handleClose = () => {
    console.log('🚀 Close button clicked, stopping camera...');
    stopAllCameraStreams.current();
    router.push('/feed');
  };

  const renderCameraView = () => (
    <div className="flex flex-col h-full bg-black">
      <div className="relative flex-1 flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-cover aspect-[3/4]" autoPlay muted playsInline />
        {!isCameraOn && <Loader2 className="h-12 w-12 animate-spin text-primary absolute" />}
      </div>
  
       <div className="absolute bottom-20 left-0 right-0 flex items-center justify-center py-8 z-10">
        <div className="relative flex items-center justify-center w-60">
          <div className="flex-1 flex justify-start">
            <Button variant="ghost" size="icon" className="text-white bg-black/30 hover:bg-black/50 rounded-full w-12 h-12" onClick={triggerFileSelect}>
              <Upload className="h-6 w-6" />
            </Button>
          </div>
          <button
            onClick={takePicture}
            disabled={!isCameraOn}
            className="w-20 h-20 rounded-full bg-white/90 border-4 border-white/30 ring-4 ring-black/20 focus:outline-none focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
            aria-label="Take Picture"
          />
          <div className="flex-1 flex justify-end">
            <Button variant="ghost" size="icon" className="text-white bg-black/30 hover:bg-black/50 rounded-full w-12 h-12" onClick={handleClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultView = () => (
    <div className="space-y-4">
        <div className="relative aspect-[3/4] w-full max-w-2xl mx-auto">
           {photoPreview && (
                <>
                    <Image
                        src={photoPreview}
                        alt="Scanned item preview"
                        fill
                        className="object-cover md:rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2 bg-background/50 hover:bg-background/80 rounded-full z-10" onClick={resetScan}>
                        <X className="h-5 w-5" />
                    </Button>
                </>
           )}
           {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
           )}
           {result && (
               <div className="absolute bottom-8 left-0 right-0 px-4 md:px-6 text-background">
                    <h1 className="text-4xl font-bold tracking-tighter font-headline sm:text-5xl md:text-6xl text-foreground">
                        {result.objectIdentification}
                    </h1>
                </div>
           )}
        </div>

        {result && (
             <div className="space-y-6 pb-6 px-4 md:px-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                             <Sparkles className="h-6 w-6 text-accent" />
                             History & Significance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <p>{result.narration}</p>
                    </CardContent>
                </Card>
               
                {result.audio && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <Volume2 className="h-6 w-6 text-primary" />
                                Audio Narration
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <audio controls src={result.audio} className="w-full">
                                Your browser does not support the audio element.
                            </audio>
                        </CardContent>
                    </Card>
                )}
            </div>
        )}
    </div>
  );


  const renderContent = () => {
    if (isInitializing) {
        return (
             <div className="flex h-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }
    
    if (!hasCameraPermission) {
         return (
             <div className="flex h-full items-center justify-center p-4">
                <Alert variant="destructive" className="flex flex-col items-center justify-center text-center p-8 gap-4 max-w-md mx-auto">
                <Camera className="h-12 w-12" />
                <AlertTitle className="text-xl font-bold">Camera Access Disabled</AlertTitle>
                <AlertDescription>
                    You have disabled camera permissions in the app settings. Please enable it to use the scan feature.
                </AlertDescription>
                <Button asChild>
                    <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" /> Go to Settings
                    </Link>
                </Button>
                </Alert>
             </div>
        );
    }
    
    if (photoPreview) {
        return renderResultView();
    }
    
    return renderCameraView();

  }

  return (
    <div className={cn("h-full w-full", photoPreview || !hasCameraPermission || isInitializing ? "pt-20 md:pt-8 pb-24 md:pb-8" : "")}>
      <label htmlFor="file-upload" className="sr-only">Upload image file</label>
      <input
        id="file-upload"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        aria-label="Upload image file for scanning"
      />
        {renderContent()}
    </div>
  );
}
