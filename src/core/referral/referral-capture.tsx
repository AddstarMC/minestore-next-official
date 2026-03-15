'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { getEndpoints } from '@/api';
import { fetcher } from '@/api/client/fetcher';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';

const { captureReferral, getCart } = getEndpoints(fetcher);
export function ReferralCapture() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setCart = useCartStore((s) => s.setCart);
    const user = useUserStore((s) => s.user);
    const capturedRef = useRef<string | null>(null);

    useEffect(() => {
        const refCode = searchParams.get('ref');
        if (!refCode || refCode.trim() === '' || capturedRef.current === refCode) {
            return;
        }

        capturedRef.current = refCode;

        (async () => {
            try {
                const result = await captureReferral(refCode.trim());
                if (result.success && user) {
                    setCart(await getCart());
                }
            } catch {
                capturedRef.current = null;
                return;
            }

            const next = new URLSearchParams(searchParams);
            next.delete('ref');
            const query = next.toString();
            const path = window.location.pathname || '/';
            router.replace(query ? `${path}?${query}` : path, { scroll: false });
        })();
    }, [searchParams, router, setCart, user]);

    return null;
}
