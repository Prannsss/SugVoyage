
'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  KeyRound,
  ShieldCheck,
  LogOut,
  Languages,
  Palette,
  Sparkles,
  DollarSign,
  Accessibility,
  Volume2,
  Download,
  Bell,
  HardDrive,
  Trash2,
  PieChart,
  MapPin,
  Camera,
  Mic,
  Database,
  HelpCircle,
  MessageSquare,
  Star,
  FileText,
  Info,
  ChevronRight,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  Copy,
  Check,
  Key,
  Delete,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { usePermission } from '@/hooks/use-permission';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const SettingsItem = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) => {
  const Icon = icon;
  return (
    <div className="flex items-center justify-between py-4 rounded-lg hover:bg-muted/50 transition-colors -mx-4 px-4">
        <div className="flex items-center gap-4">
            <Icon className="h-6 w-6 text-muted-foreground" />
            <div className="flex flex-col">
                <span className="font-medium">{title}</span>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
        </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};

const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="py-2">
        <h2 className="text-2xl font-bold font-headline mb-2">{title}</h2>
        <div className="divide-y">
            {children}
        </div>
    </div>
);

const passwordFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;


export default function SettingsPage() {
    const { toast } = useToast();
    const [isCodeSent, setIsCodeSent] = React.useState(false);
    const [language, setLanguage] = React.useState("english");
    const [audioVoice, setAudioVoice] = React.useState("Algenib");
    const [locationAccess, setLocationAccess] = React.useState("while-using");
    const { hasPermission: allowDataUsage, setPermission: setAllowDataUsage } = usePermission('analytics');
    const [isDataUsageSheetOpen, setIsDataUsageSheetOpen] = React.useState(false);
    const [nearbyRecommendations, setNearbyRecommendations] = React.useState(true);
    const [isNearbySheetOpen, setIsNearbySheetOpen] = React.useState(false);
    const { hasPermission: cameraPermission, setPermission: setCameraPermission } = usePermission('camera', true);
    const [isCameraSheetOpen, setIsCameraSheetOpen] = React.useState(false);
    
    // Gemini API Key state
    const [geminiApiKey, setGeminiApiKey] = React.useState("");
    const [showApiKey, setShowApiKey] = React.useState(false);
    const [isApiKeyCopied, setIsApiKeyCopied] = React.useState(false);
    const [isApiKeySheetOpen, setIsApiKeySheetOpen] = React.useState(false);

    // Two-Factor Authentication (PIN) state
    const [tfaEnabled, setTfaEnabled] = React.useState(false);
    const [isPinDialogOpen, setIsPinDialogOpen] = React.useState(false);
    const [pinStep, setPinStep] = React.useState<'create' | 'confirm' | 'disable'>('create');
    const [pin, setPin] = React.useState<string[]>([]);
    const [confirmPin, setConfirmPin] = React.useState<string[]>([]);
    const [pinError, setPinError] = React.useState<string | null>(null);
    const [isShaking, setIsShaking] = React.useState(false);
    const PIN_LENGTH = 4;

    React.useEffect(() => {
        const savedVoice = localStorage.getItem('setting_audioVoice');
        if (savedVoice) {
            setAudioVoice(savedVoice);
        }
        // Load saved Gemini API key
        const savedApiKey = localStorage.getItem('GEMINI_API_KEY');
        if (savedApiKey) {
            setGeminiApiKey(savedApiKey);
        }
        // Load TFA state
        const tfaState = localStorage.getItem('tfa_enabled') === 'true';
        setTfaEnabled(tfaState);
    }, []);

    const handleAudioVoiceChange = (newVoice: string) => {
        setAudioVoice(newVoice);
        localStorage.setItem('setting_audioVoice', newVoice);
    };

    const locationAccessDescriptions: Record<string, string> = {
        "always": "Always",
        "while-using": "While using the app",
        "never": "Never",
    };

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            email: '',
        },
    });

    function onSubmit(data: PasswordFormValues) {
        console.log(data);
        setIsCodeSent(true);
        toast({
            title: 'Verification Code Sent',
            description: `A verification code has been sent to ${data.email}.`,
        });
    }

    const handleDataUsageToggle = (checked: boolean) => {
        setIsDataUsageSheetOpen(true);
    };

    const handleDataUsageConfirm = (consent: boolean) => {
        if (consent) {
            setAllowDataUsage(!allowDataUsage);
            toast({
                title: "Data Usage preference updated",
                description: `Anonymous data sharing is now ${!allowDataUsage ? 'enabled' : 'disabled'}.`
            })
        }
        setIsDataUsageSheetOpen(false);
    }

    const handleNearbyRecommendationsToggle = () => {
        setIsNearbySheetOpen(true);
    };

    const handleNearbyRecommendationsConfirm = (consent: boolean) => {
        if (consent) {
            setNearbyRecommendations(!nearbyRecommendations);
            toast({
                title: "Nearby Recommendations updated",
                description: `Location access for recommendations is now ${!nearbyRecommendations ? 'enabled' : 'disabled'}.`
            })
        }
        setIsNearbySheetOpen(false);
    }
    
    const handleCameraPermissionToggle = () => {
        setIsCameraSheetOpen(true);
    }

    const handleCameraPermissionConfirm = (consent: boolean) => {
        setCameraPermission(consent);
        setIsCameraSheetOpen(false);
        toast({
            title: "Camera Permissions Updated",
            description: `Camera access is now ${consent ? 'enabled' : 'disabled'}.`
        });
    };

    // Gemini API Key handlers
    const handleSaveApiKey = () => {
        if (geminiApiKey.trim()) {
            localStorage.setItem('GEMINI_API_KEY', geminiApiKey.trim());
            toast({
                title: "API Key Saved",
                description: "Your Gemini API key has been saved locally.",
            });
        } else {
            localStorage.removeItem('GEMINI_API_KEY');
            toast({
                title: "API Key Removed",
                description: "Your Gemini API key has been removed.",
            });
        }
        setIsApiKeySheetOpen(false);
    };

    const handleCopyApiKey = async () => {
        if (geminiApiKey) {
            await navigator.clipboard.writeText(geminiApiKey);
            setIsApiKeyCopied(true);
            toast({
                title: "Copied!",
                description: "API key copied to clipboard.",
            });
            setTimeout(() => setIsApiKeyCopied(false), 2000);
        }
    };

    const getMaskedApiKey = () => {
        if (!geminiApiKey) return "Not set";
        if (geminiApiKey.length <= 8) return "••••••••";
        return `${geminiApiKey.slice(0, 4)}${"•".repeat(Math.min(geminiApiKey.length - 8, 20))}${geminiApiKey.slice(-4)}`;
    };

    // PIN Hash function
    const hashPin = async (pinValue: string): Promise<string> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(pinValue + 'sugvoyage_salt');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    // Handle TFA toggle
    const handleTfaToggle = (checked: boolean) => {
        if (checked) {
            // Opening PIN creation dialog
            setPinStep('create');
            setPin([]);
            setConfirmPin([]);
            setPinError(null);
            setIsPinDialogOpen(true);
        } else {
            // Opening PIN verification to disable
            setPinStep('disable');
            setPin([]);
            setPinError(null);
            setIsPinDialogOpen(true);
        }
    };

    // Handle PIN number press
    const handlePinNumberPress = (num: string) => {
        const currentPin = pinStep === 'confirm' ? confirmPin : pin;
        const setCurrentPin = pinStep === 'confirm' ? setConfirmPin : setPin;

        if (currentPin.length < PIN_LENGTH) {
            const newPin = [...currentPin, num];
            setCurrentPin(newPin);
            setPinError(null);

            // Auto-advance when PIN is complete
            if (newPin.length === PIN_LENGTH) {
                if (pinStep === 'create') {
                    // Move to confirm step
                    setTimeout(() => {
                        setPinStep('confirm');
                    }, 200);
                } else if (pinStep === 'confirm') {
                    // Verify PINs match
                    handleConfirmPin(newPin);
                } else if (pinStep === 'disable') {
                    // Verify PIN to disable
                    handleDisablePin(newPin);
                }
            }
        }
    };

    // Handle PIN delete
    const handlePinDelete = () => {
        const currentPin = pinStep === 'confirm' ? confirmPin : pin;
        const setCurrentPin = pinStep === 'confirm' ? setConfirmPin : setPin;

        if (currentPin.length > 0) {
            setCurrentPin(currentPin.slice(0, -1));
            setPinError(null);
        }
    };

    // Confirm PIN creation
    const handleConfirmPin = async (confirmedPin: string[]) => {
        const originalPin = pin.join('');
        const confirmed = confirmedPin.join('');

        if (originalPin === confirmed) {
            // PINs match - save and enable TFA
            const pinHash = await hashPin(originalPin);
            localStorage.setItem('tfa_pin_hash', pinHash);
            localStorage.setItem('tfa_enabled', 'true');
            // Mark current session as verified so user doesn't need to enter PIN immediately
            sessionStorage.setItem('pin_verified', 'true');
            setTfaEnabled(true);
            setIsPinDialogOpen(false);
            toast({
                title: "PIN Created",
                description: "Two-factor authentication is now enabled. You'll need to enter this PIN when opening the app.",
            });
        } else {
            // PINs don't match
            setIsShaking(true);
            setPinError("PINs don't match. Please try again.");
            setTimeout(() => {
                setIsShaking(false);
                setConfirmPin([]);
            }, 500);
        }
    };

    // Disable PIN
    const handleDisablePin = async (enteredPin: string[]) => {
        const entered = enteredPin.join('');
        const enteredHash = await hashPin(entered);
        const storedHash = localStorage.getItem('tfa_pin_hash');

        if (enteredHash === storedHash) {
            // PIN correct - disable TFA
            localStorage.removeItem('tfa_pin_hash');
            localStorage.setItem('tfa_enabled', 'false');
            sessionStorage.removeItem('pin_verified');
            setTfaEnabled(false);
            setIsPinDialogOpen(false);
            toast({
                title: "PIN Removed",
                description: "Two-factor authentication has been disabled.",
            });
        } else {
            // PIN incorrect
            setIsShaking(true);
            setPinError("Incorrect PIN. Please try again.");
            setTimeout(() => {
                setIsShaking(false);
                setPin([]);
            }, 500);
        }
    };

    // Reset PIN dialog
    const handlePinDialogClose = () => {
        setIsPinDialogOpen(false);
        setPin([]);
        setConfirmPin([]);
        setPinError(null);
        setPinStep('create');
    };

    // Number pad for PIN
    const numberPad = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['', '0', 'delete'],
    ];

    // Get current PIN array for display
    const getCurrentPinDisplay = () => {
        return pinStep === 'confirm' ? confirmPin : pin;
    };


  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 pt-20 md:pt-8 pb-24 md:pb-8">
        <div className="divide-y space-y-6">
            <SettingsSection title="Account & Security">
                 <Sheet onOpenChange={(open) => !open && (setIsCodeSent(false), form.reset())}>
                    <SheetTrigger asChild>
                        <div className="cursor-pointer">
                            <SettingsItem icon={KeyRound} title="Change password">
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </SettingsItem>
                        </div>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-2xl">
                        <SheetHeader className="text-left">
                        <SheetTitle>Change Password</SheetTitle>
                        <SheetDescription>
                            {isCodeSent 
                                ? "Enter the verification code and your new password."
                                : "Enter your email to receive a verification code."
                            }
                        </SheetDescription>
                        </SheetHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="your@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <SheetFooter className="pt-4">
                                    <SheetClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </SheetClose>
                                    <Button type="submit">Send Verification Code</Button>
                                </SheetFooter>
                            </form>
                        </Form>
                    </SheetContent>
                </Sheet>
                <SettingsItem icon={ShieldCheck} title="Two-factor authentication" description={tfaEnabled ? "PIN enabled" : "Protect your app with a PIN"}>
                    <Switch id="tfa-switch" checked={tfaEnabled} onCheckedChange={handleTfaToggle} />
                </SettingsItem>
                
                {/* PIN Setup/Disable Dialog */}
                <Dialog open={isPinDialogOpen} onOpenChange={handlePinDialogClose}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {pinStep === 'create' && 'Create PIN'}
                                {pinStep === 'confirm' && 'Confirm PIN'}
                                {pinStep === 'disable' && 'Enter PIN to Disable'}
                            </DialogTitle>
                            <DialogDescription>
                                {pinStep === 'create' && 'Create a 4-digit PIN to protect your app. You\'ll need to enter this PIN when opening SugVoyage.'}
                                {pinStep === 'confirm' && 'Re-enter your PIN to confirm.'}
                                {pinStep === 'disable' && 'Enter your current PIN to disable two-factor authentication.'}
                            </DialogDescription>
                        </DialogHeader>

                        {/* PIN Dots */}
                        <div 
                            className={cn(
                                "flex justify-center gap-4 py-6",
                                isShaking && "animate-shake"
                            )}
                        >
                            {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "w-4 h-4 rounded-full border-2 transition-all duration-200",
                                        index < getCurrentPinDisplay().length
                                            ? "bg-primary border-primary scale-110"
                                            : "border-muted-foreground/30"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Error Message */}
                        {pinError && (
                            <p className="text-destructive text-sm text-center animate-in fade-in">
                                {pinError}
                            </p>
                        )}

                        {/* Number Pad */}
                        <div className="grid gap-2 py-2">
                            {numberPad.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex justify-center gap-2">
                                    {row.map((item, colIndex) => {
                                        if (item === '') {
                                            return <div key={colIndex} className="w-16 h-14" />;
                                        }
                                        if (item === 'delete') {
                                            return (
                                                <Button
                                                    key={colIndex}
                                                    variant="ghost"
                                                    className="w-16 h-14 text-lg"
                                                    onClick={handlePinDelete}
                                                    disabled={getCurrentPinDisplay().length === 0}
                                                >
                                                    <Delete className="w-5 h-5" />
                                                </Button>
                                            );
                                        }
                                        return (
                                            <Button
                                                key={colIndex}
                                                variant="outline"
                                                className="w-16 h-14 text-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                                                onClick={() => handlePinNumberPress(item)}
                                                disabled={getCurrentPinDisplay().length >= PIN_LENGTH}
                                            >
                                                {item}
                                            </Button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <DialogFooter className="sm:justify-center">
                            <Button variant="outline" onClick={handlePinDialogClose}>
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                
                 <Sheet>
                    <SheetTrigger asChild>
                        <div className="cursor-pointer">
                            <SettingsItem icon={Languages} title="Default language" description={language.charAt(0).toUpperCase() + language.slice(1)}>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </SettingsItem>
                        </div>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-2xl">
                        <SheetHeader className="text-left">
                            <SheetTitle>Choose Language</SheetTitle>
                            <SheetDescription>Select your preferred language for the app.</SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                            <RadioGroup value={language} onValueChange={setLanguage} className="w-full">
                                <Label htmlFor="lang-en" className="flex items-center justify-between p-4 border-b w-full cursor-pointer">
                                    English
                                    <RadioGroupItem value="english" id="lang-en" />
                                </Label>
                                <Label htmlFor="lang-ceb" className="flex items-center justify-between p-4 border-b w-full cursor-pointer">
                                    Cebuano
                                    <RadioGroupItem value="cebuano" id="lang-ceb" />
                                </Label>
                                <Label htmlFor="lang-ko" className="flex items-center justify-between p-4 border-b w-full cursor-pointer">
                                    Korean
                                    <RadioGroupItem value="korean" id="lang-ko" />
                                </Label>
                                <Label htmlFor="lang-ja" className="flex items-center justify-between p-4 w-full cursor-pointer">
                                    Japanese
                                    <RadioGroupItem value="japanese" id="lang-ja" />
                                </Label>
                            </RadioGroup>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button className="w-full">Done</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </SettingsSection>
            
            <SettingsSection title="AI Features">
                <Sheet open={isApiKeySheetOpen} onOpenChange={setIsApiKeySheetOpen}>
                    <SheetTrigger asChild>
                        <div className="cursor-pointer">
                            <SettingsItem 
                                icon={Key} 
                                title="Gemini API Key" 
                                description={geminiApiKey ? getMaskedApiKey() : "Add your free API key for AI features"}
                            >
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </SettingsItem>
                        </div>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-2xl">
                        <SheetHeader className="text-left">
                            <SheetTitle>Gemini API Key</SheetTitle>
                            <SheetDescription>
                                Enter your free Gemini API key to use AI features like itinerary generation, 
                                landmark scanning, and more. Get your free key at{' '}
                                <a 
                                    href="https://aistudio.google.com/apikey" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                >
                                    Google AI Studio
                                </a>
                            </SheetDescription>
                        </SheetHeader>
                        <div className="py-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="gemini-api-key">API Key</Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            id="gemini-api-key"
                                            type={showApiKey ? "text" : "password"}
                                            placeholder="Enter your Gemini API key"
                                            value={geminiApiKey}
                                            onChange={(e) => setGeminiApiKey(e.target.value)}
                                            className="pr-20"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => setShowApiKey(!showApiKey)}
                                            >
                                                {showApiKey ? (
                                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={handleCopyApiKey}
                                                disabled={!geminiApiKey}
                                            >
                                                {isApiKeyCopied ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Copy className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Your API key is stored locally on your device and never sent to our servers.
                                </p>
                            </div>
                        </div>
                        <SheetFooter className="grid grid-cols-2 gap-4">
                            <SheetClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </SheetClose>
                            <Button onClick={handleSaveApiKey}>
                                {geminiApiKey ? "Save Key" : "Remove Key"}
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </SettingsSection>
            
            <SettingsSection title="App Experience">
                 <Sheet>
                    <SheetTrigger asChild>
                        <div className="cursor-pointer">
                            <SettingsItem icon={Volume2} title="Audio narration voice" description={audioVoice}>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </SettingsItem>
                        </div>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-2xl">
                        <SheetHeader className="text-left">
                            <SheetTitle>Choose Narration Voice</SheetTitle>
                            <SheetDescription>Select your preferred voice for AI-powered audio narrations.</SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                            <RadioGroup value={audioVoice} onValueChange={handleAudioVoiceChange} className="w-full">
                                <Label htmlFor="voice-algenib" className="flex items-center justify-between p-4 border-b w-full cursor-pointer">
                                    Algenib (Female)
                                    <RadioGroupItem value="Algenib" id="voice-algenib" />
                                </Label>
                                <Label htmlFor="voice-achernar" className="flex items-center justify-between p-4 border-b w-full cursor-pointer">
                                    Achernar (Male)
                                    <RadioGroupItem value="Achernar" id="voice-achernar" />
                                </Label>
                                <Label htmlFor="voice-puck" className="flex items-center justify-between p-4 border-b w-full cursor-pointer">
                                    Puck (Female)
                                    <RadioGroupItem value="Puck" id="voice-puck" />
                                </Label>
                                <Label htmlFor="voice-umbriel" className="flex items-center justify-between p-4 w-full cursor-pointer">
                                    Umbriel (Male)
                                    <RadioGroupItem value="Umbriel" id="voice-umbriel" />
                                </Label>
                            </RadioGroup>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button className="w-full">Done</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                <SettingsItem icon={Download} title="Downloaded offline content">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </SettingsItem>
                <div className="py-2">
                    <h3 className="font-bold mb-2 text-lg">Notifications</h3>
                    <div className="space-y-1 divide-y">
                        <SettingsItem icon={Bell} title="Itinerary reminders">
                            <Switch defaultChecked/>
                        </SettingsItem>
                        <SettingsItem icon={Bell} title="Nearby recommendations">
                            <Switch checked={nearbyRecommendations} onCheckedChange={handleNearbyRecommendationsToggle} />
                        </SettingsItem>
                        <Sheet open={isNearbySheetOpen} onOpenChange={setIsNearbySheetOpen}>
                            <SheetContent side="bottom" className="rounded-t-2xl">
                                <SheetHeader>
                                    <SheetTitle>Nearby Recommendations</SheetTitle>
                                    <SheetDescription>
                                        {nearbyRecommendations
                                            ? "Disable location access for personalized recommendations?"
                                            : "Allow this app to access your location for the best accommodations in your area?"
                                        }
                                    </SheetDescription>
                                </SheetHeader>
                                <SheetFooter className="grid grid-cols-2 gap-4 pt-4">
                                    <Button variant="outline" onClick={() => handleNearbyRecommendationsConfirm(false)}>No</Button>
                                    <Button onClick={() => handleNearbyRecommendationsConfirm(true)}>Yes</Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                        <SettingsItem icon={Bell} title="Fiesta/cultural event alerts">
                            <Switch defaultChecked />
                        </SettingsItem>
                        <SettingsItem icon={Bell} title="Travel tips">
                            <Switch />
                        </SettingsItem>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Privacy & Permissions">
                <Sheet>
                    <SheetTrigger asChild>
                        <div className="cursor-pointer">
                            <SettingsItem icon={MapPin} title="Manage location access" description={locationAccessDescriptions[locationAccess]}>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </SettingsItem>
                        </div>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-2xl">
                        <SheetHeader className="text-left">
                            <SheetTitle>Manage Location Access</SheetTitle>
                            <SheetDescription>Choose when the app can access your location.</SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                            <RadioGroup value={locationAccess} onValueChange={setLocationAccess} className="w-full">
                                <Label htmlFor="loc-always" className="flex items-center justify-between p-4 border-b w-full cursor-pointer">
                                    Always
                                    <RadioGroupItem value="always" id="loc-always" />
                                </Label>
                                <Label htmlFor="loc-while-using" className="flex items-center justify-between p-4 border-b w-full cursor-pointer">
                                    While using the app
                                    <RadioGroupItem value="while-using" id="loc-while-using" />
                                </Label>
                                <Label htmlFor="loc-never" className="flex items-center justify-between p-4 w-full cursor-pointer">
                                    Never
                                    <RadioGroupItem value="never" id="loc-never" />
                                </Label>
                            </RadioGroup>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button className="w-full">Done</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                 <SettingsItem icon={Camera} title="Camera permissions">
                    <Switch checked={cameraPermission} onCheckedChange={handleCameraPermissionToggle} />
                </SettingsItem>
                <Sheet open={isCameraSheetOpen} onOpenChange={setIsCameraSheetOpen}>
                    <SheetContent side="bottom" className="rounded-t-2xl">
                        <SheetHeader className="text-left">
                            <SheetTitle>Camera Access</SheetTitle>
                            <SheetDescription>
                                {cameraPermission
                                    ? "This app has access to your camera. Do you want to disable it?"
                                    : "Allow the use of camera to scan Cebu's best spots and learn about their history."
                                }
                            </SheetDescription>
                        </SheetHeader>
                        <SheetFooter className="grid grid-cols-2 gap-4 pt-4">
                           {cameraPermission ? (
                                <>
                                    <Button variant="outline" onClick={() => setIsCameraSheetOpen(false)}>Keep Enabled</Button>
                                    <Button variant="destructive" onClick={() => handleCameraPermissionConfirm(false)}>Disable</Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={() => setIsCameraSheetOpen(false)}>Cancel</Button>
                                    <Button onClick={() => handleCameraPermissionConfirm(true)}>Allow</Button>
                                </>
                            )}
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                <SettingsItem icon={Database} title="Data usage" description="Opt-out of analytics for app improvement">
                    <Switch checked={allowDataUsage} onCheckedChange={handleDataUsageToggle} />
                </SettingsItem>
                <Sheet open={isDataUsageSheetOpen} onOpenChange={setIsDataUsageSheetOpen}>
                    <SheetContent side="bottom" className="rounded-t-2xl">
                        <SheetHeader className="text-left">
                            <SheetTitle>Data Usage</SheetTitle>
                            <SheetDescription>
                                {allowDataUsage 
                                    ? "Disallow sending anonymous data for app improvements?"
                                    : "Allow sending your data anonymously for app improvements?"
                                }
                            </SheetDescription>
                        </SheetHeader>
                        <SheetFooter className="grid grid-cols-2 gap-4 pt-4">
                             <Button variant="outline" onClick={() => handleDataUsageConfirm(false)}>No</Button>
                             <Button onClick={() => handleDataUsageConfirm(true)}>Yes</Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </SettingsSection>

            <SettingsSection title="Support & Feedback">
                <SettingsItem icon={HelpCircle} title="Help Center / FAQs">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </SettingsItem>
                <SettingsItem icon={MessageSquare} title="Contact support">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </SettingsItem>
                <SettingsItem icon={Star} title="Rate the app">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </SettingsItem>
                <SettingsItem icon={FileText} title="Submit feedback / report issue">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </SettingsItem>
            </SettingsSection>
            
            <SettingsSection title="About">
                <SettingsItem icon={Info} title="App version" description="1.0.0" />
                <SettingsItem icon={FileText} title="Terms & Conditions">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </SettingsItem>
                <SettingsItem icon={FileText} title="Privacy Policy">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </SettingsItem>
                <SettingsItem icon={Info} title="Credits">
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </SettingsItem>
            </SettingsSection>
        </div>
        <div className="pt-4 pb-8">
            <Button variant="destructive" className="w-full">
                <LogOut className="mr-2" /> Log Out
            </Button>
        </div>
    </div>
  );
}
