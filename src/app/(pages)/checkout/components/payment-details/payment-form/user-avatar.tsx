import { useUserStore } from '@/stores/user';
import { useGameType } from '@/hooks/use-game-type';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export function UserAvatar() {
    const { user } = useUserStore();
    const gameType = useGameType();
    const t = useTranslations('checkout');

    if (!user) return null;

    const isHytale = gameType === 'hytale';
    const hytaleSrc = `https://hyvatar.io/render/${encodeURIComponent(user.username)}?size=200`;

    return (
        <>
            <span className="font-medium">{t('you-are-buying-as')}</span>
            {isHytale ? (
                <Image
                    src={hytaleSrc}
                    className="mt-4 h-auto w-auto mx-auto"
                    width={200}
                    height={200}
                    alt=""
                />
            ) : (
                <Image
                    src={user.avatar}
                    className="mt-4 h-auto w-auto mx-auto flex-1"
                    width={128}
                    height={308}
                    alt=""
                />
            )}
            <p className="mt-8 text-[20px] text-center font-bold text-accent-foreground">{user.username}</p>
        </>
    );
}
