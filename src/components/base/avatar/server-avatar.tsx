import Image from 'next/image';
import { FC } from 'react';
import { buildAvatarUrl, AvatarKind, GameType } from '@/lib/avatar';

type Props = {
    username: string;
    gameType: GameType;
    kind?: AvatarKind;
    size: number;
    alt?: string;
    className?: string;
    quality?: number;
};

export const ServerAvatar: FC<Props> = ({
    username,
    gameType,
    kind = 'head',
    size,
    alt,
    className,
    quality,
}) => {
    return (
        <Image
            src={buildAvatarUrl(gameType, kind, username, size)}
            alt={alt ?? username}
            width={size}
            height={size}
            className={className}
            quality={quality}
        />
    );
};
