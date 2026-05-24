'use client';

import Image from 'next/image';
import { FC, useState } from 'react';
import { useGameType } from '@/hooks/use-game-type';
import { buildAvatarUrl, FALLBACK_AVATAR, AvatarKind } from '@/lib/avatar';

type Props = {
    username: string;
    kind?: AvatarKind;
    size: number;
    alt?: string;
    className?: string;
    quality?: number;
};

export const Avatar: FC<Props> = ({
    username,
    kind = 'head',
    size,
    alt,
    className,
    quality,
}) => {
    const gameType = useGameType();
    const initial = buildAvatarUrl(gameType, kind, username, size);
    const [src, setSrc] = useState<string>(initial);

    return (
        <Image
            src={src}
            alt={alt ?? username}
            width={size}
            height={size}
            className={className}
            quality={quality}
            onError={() => setSrc(FALLBACK_AVATAR)}
        />
    );
};
