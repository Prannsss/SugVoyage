'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Delete } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PIN_LENGTH = 4;

export default function PinVerificationPage() {
    const router = useRouter();
    const [pin, setPin] = React.useState<string[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [isShaking, setIsShaking] = React.useState(false);
    const [attempts, setAttempts] = React.useState(0);
    const maxAttempts = 5;

    React.useEffect(() => {
        // Check if 2FA is enabled
        const tfaEnabled = localStorage.getItem('tfa_enabled') === 'true';
        const pinHash = localStorage.getItem('tfa_pin_hash');
        
        if (!tfaEnabled || !pinHash) {
            // No 2FA setup, redirect to main app
            router.replace('/');
            return;
        }

        // Check if already verified in this session
        const sessionVerified = sessionStorage.getItem('pin_verified') === 'true';
        if (sessionVerified) {
            router.replace('/');
            return;
        }
    }, [router]);

    const handleNumberPress = (num: string) => {
        if (pin.length < PIN_LENGTH) {
            const newPin = [...pin, num];
            setPin(newPin);
            setError(null);

            // Auto-verify when PIN is complete
            if (newPin.length === PIN_LENGTH) {
                verifyPin(newPin.join(''));
            }
        }
    };

    const handleDelete = () => {
        if (pin.length > 0) {
            setPin(pin.slice(0, -1));
            setError(null);
        }
    };

    const handleClear = () => {
        setPin([]);
        setError(null);
    };

    const verifyPin = async (enteredPin: string) => {
        const storedPinHash = localStorage.getItem('tfa_pin_hash');
        
        // Simple hash comparison (in production, use proper crypto)
        const enteredPinHash = await hashPin(enteredPin);
        
        if (enteredPinHash === storedPinHash) {
            // PIN correct - mark session as verified
            sessionStorage.setItem('pin_verified', 'true');
            router.replace('/');
        } else {
            // PIN incorrect
            setIsShaking(true);
            setAttempts(prev => prev + 1);
            setTimeout(() => {
                setIsShaking(false);
                setPin([]);
            }, 500);

            if (attempts + 1 >= maxAttempts) {
                setError(`Too many attempts. Please try again later.`);
                // Could implement lockout here
            } else {
                setError(`Incorrect PIN. ${maxAttempts - attempts - 1} attempts remaining.`);
            }
        }
    };

    // Simple hash function for PIN (client-side only)
    const hashPin = async (pin: string): Promise<string> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(pin + 'sugvoyage_salt');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const numberPad = [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['', '0', 'delete'],
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold font-headline">Enter PIN</h1>
                    <p className="text-muted-foreground text-sm">
                        Enter your 4-digit PIN to unlock SugVoyage
                    </p>
                </div>

                {/* PIN Dots */}
                <div 
                    className={cn(
                        "flex justify-center gap-4 py-8",
                        isShaking && "animate-shake"
                    )}
                >
                    {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "w-4 h-4 rounded-full border-2 transition-all duration-200",
                                index < pin.length
                                    ? "bg-primary border-primary scale-110"
                                    : "border-muted-foreground/30"
                            )}
                        />
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <p className="text-destructive text-sm text-center animate-in fade-in">
                        {error}
                    </p>
                )}

                {/* Number Pad */}
                <div className="grid gap-3">
                    {numberPad.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center gap-3">
                            {row.map((item, colIndex) => {
                                if (item === '') {
                                    return <div key={colIndex} className="w-20 h-16" />;
                                }
                                if (item === 'delete') {
                                    return (
                                        <Button
                                            key={colIndex}
                                            variant="ghost"
                                            className="w-20 h-16 text-lg"
                                            onClick={handleDelete}
                                            disabled={pin.length === 0 || attempts >= maxAttempts}
                                        >
                                            <Delete className="w-6 h-6" />
                                        </Button>
                                    );
                                }
                                return (
                                    <Button
                                        key={colIndex}
                                        variant="outline"
                                        className="w-20 h-16 text-2xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                                        onClick={() => handleNumberPress(item)}
                                        disabled={pin.length >= PIN_LENGTH || attempts >= maxAttempts}
                                    >
                                        {item}
                                    </Button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Forgot PIN */}
                <div className="text-center pt-4">
                    <Button
                        variant="link"
                        className="text-muted-foreground text-sm"
                        onClick={() => {
                            // In a real app, this would trigger a recovery flow
                            // For now, we'll just show a message
                            setError('Please log in again to reset your PIN.');
                        }}
                    >
                        Forgot PIN?
                    </Button>
                </div>
            </div>

            {/* Add shake animation */}
            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
                    20%, 40%, 60%, 80% { transform: translateX(8px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}
