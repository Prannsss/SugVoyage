
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
import { useRouter } from 'next/navigation';

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


  useEffect(() => {
    const getCameraStream = async () => {
      if (hasCameraPermission) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsCameraOn(true);
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
         if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            setIsCameraOn(false);
        }
      }
    };

    if (!isInitializing) {
        getCameraStream();
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasCameraPermission, setCameraPermission, toast, isInitializing]);

  useEffect(() => {
    // This effect prevents a hydration mismatch by ensuring the client-side
    // logic that depends on `hasCameraPermission` runs after the initial render.
    const timer = setTimeout(() => setIsInitializing(false), 200);
    return () => clearTimeout(timer);
  }, []);


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

    if (isCameraOn) {
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setIsCameraOn(false);
    }
    

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
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
    }
    router.push('/feed');
  };

  const renderCameraView = () => (
    <div className="flex flex-col h-full bg-black">
      <div className="relative flex-1 flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-cover aspect-[3/4]" autoPlay muted playsInline />
        {!isCameraOn && <Loader2 className="h-12 w-12 animate-spin text-primary absolute" />}
      </div>
  
      <div className="absolute top-4 right-4 z-10">
        <Button variant="ghost" size="icon" className="text-white bg-black/30 hover:bg-black/50 rounded-full" onClick={triggerFileSelect}>
          <Upload className="h-6 w-6" />
        </Button>
      </div>
       <div className="absolute bottom-20 left-0 right-0 flex items-center justify-center py-8 z-10">
        <div className="relative flex items-center justify-center" style={{ width: '240px' }}>
          <div className="flex-1" />
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
    <div className={cn("h-full w-full", photoPreview || !hasCameraPermission || isInitializing ? "pt-20 md:pt-8" : "")}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
        {renderContent()}
    </div>
  );
}
