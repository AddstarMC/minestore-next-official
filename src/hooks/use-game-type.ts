import { useSettingsStore } from '@/stores/settings';
import { useUserStore } from '@/stores/user';
import type { GameType } from '@/lib/avatar';

const hasHyvatar = (url?: string | null): boolean =>
    Boolean(url && url.includes('hyvatar.io'));

export const useGameType = (): GameType => {
    const settings = useSettingsStore((s) => s.settings);
    const user = useUserStore((s) => s.user);

    if (settings?.game_type) {
        return settings.game_type as GameType;
    }

    if (hasHyvatar(user?.avatar)) {
        return 'hytale';
    }

    if (hasHyvatar(settings?.top?.avatar)) {
        return 'hytale';
    }

    if (settings?.recentDonators?.some((d) => hasHyvatar(d.avatar))) {
        return 'hytale';
    }

    return 'minecraft';
};
