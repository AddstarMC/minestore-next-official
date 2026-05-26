export type GameType = 'minecraft' | 'hytale';
export type AvatarKind = 'head' | 'body' | 'helm' | 'bust' | 'guest';

type ServiceMap = Record<GameType, Record<AvatarKind, string>>;

const SERVICES: ServiceMap = {
    minecraft: {
        head:  'https://mc-heads.net/avatar/{username}/{size}',
        body:  'https://mc-heads.net/body/{username}/{size}px',
        helm:  'https://minotar.net/helm/{username}/{size}.png',
        bust:  'https://minotar.net/armor/bust/{username}/{size}.png',
        guest: 'https://minotar.net/helm/steve/{size}.png',
    },
    hytale: {
        head:  'https://hyvatar.io/render/{username}?size={size}',
        body:  'https://hyvatar.io/render/full/{username}?size={size}',
        helm:  'https://hyvatar.io/render/{username}?size={size}',
        bust:  'https://hyvatar.io/render/full/{username}?size={size}',
        guest: 'https://hyvatar.io/render/NPC?size={size}',
    },
};

export const FALLBACK_AVATAR = '/img/question-icon.png';

export function buildAvatarUrl(
    gameType: GameType,
    kind: AvatarKind,
    username: string,
    size: number,
): string {
    const service = SERVICES[gameType] ?? SERVICES.minecraft;
    const template = service[kind];
    return template
        .replace('{username}', encodeURIComponent(username))
        .replace('{size}', String(size));
}
