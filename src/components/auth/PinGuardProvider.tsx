'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Pages that don't require PIN verification
const PUBLIC_PATHS = [
    '/login',
    '/signup',
    '/verify-email',
    '/onboarding',
    '/pin-verification',
    '/offline',
];

interface PinGuardProviderProps {
    children: React.ReactNode;
}

export function PinGuardProvider({ children }: PinGuardProviderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isChecking, setIsChecking] = React.useState(true);
    const [shouldRender, setShouldRender] = React.useState(false);

    React.useEffect(() => {
        const checkPinVerification = () => {
            // Skip check for public paths
            if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
                setShouldRender(true);
                setIsChecking(false);
                return;
            }

            // Check if 2FA is enabled
            const tfaEnabled = localStorage.getItem('tfa_enabled') === 'true';
            const pinHash = localStorage.getItem('tfa_pin_hash');

            if (!tfaEnabled || !pinHash) {
                // No 2FA setup, allow access
                setShouldRender(true);
                setIsChecking(false);
                return;
            }

            // Check if session is verified
            const sessionVerified = sessionStorage.getItem('pin_verified') === 'true';

            if (sessionVerified) {
                // Already verified in this session
                setShouldRender(true);
                setIsChecking(false);
                return;
            }

            // Need to verify PIN - redirect to PIN verification page
            router.replace('/pin-verification');
            setIsChecking(false);
        };

        checkPinVerification();
    }, [pathname, router]);

    // Show nothing while checking (prevents flash)
    if (isChecking) {
        return null;
    }

    // Don't render children if we're redirecting to PIN verification
    if (!shouldRender && !PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        return null;
    }

    return <>{children}</>;
}
