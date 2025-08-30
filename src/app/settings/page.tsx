
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

    React.useEffect(() => {
        const savedVoice = localStorage.getItem('setting_audioVoice');
        if (savedVoice) {
            setAudioVoice(savedVoice);
        }
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


  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 pt-20 md:pt-8">
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
                <SettingsItem icon={ShieldCheck} title="Two-factor authentication">
                    <Switch id="tfa-switch" />
                </SettingsItem>
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
