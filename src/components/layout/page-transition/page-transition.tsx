'use client';

import { usePathname } from 'next/navigation';
import { AnimationEvent, FC, PropsWithChildren, useLayoutEffect, useState } from 'react';

export const PageTransition: FC<PropsWithChildren> = ({ children }) => {
    const pathname = usePathname();
    const [isAnimating, setIsAnimating] = useState(true);

    useLayoutEffect(() => {
        if (!isAnimating) return;

        const html = document.documentElement;
        const body = document.body;
        const prevHtml = html.style.overflow;
        const prevBody = body.style.overflow;

        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';

        return () => {
            html.style.overflow = prevHtml;
            body.style.overflow = prevBody;
        };
    }, [isAnimating]);

    const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            setIsAnimating(false);
        }
    };

    return (
        <div
            key={pathname}
            onAnimationEnd={handleAnimationEnd}
            className="animate-in fade-in duration-300 ease-out motion-reduce:animate-none"
        >
            {children}
        </div>
    );
};
