import Image from 'next/image';
import { StaffHeading } from './heading';
import type { GameType } from '@/lib/avatar';

type User = {
    username: string;
    prefix: string;
    sorting?: number;
};

type ResponseType = {
    [role: string]: User[];
};

async function getStaffMembers() {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/api/staff`;

    const res = await fetch(URL, {
        next: {
            revalidate: 60 * 10
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json() as Promise<ResponseType>;
}

async function getGameType(): Promise<GameType> {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/settings/get`;
        const res = await fetch(url, { next: { revalidate: 60 } });
        const data = await res.json();

        if (data?.game_type) {
            return data.game_type as GameType;
        }

        const candidates: Array<string | undefined> = [
            data?.top?.avatar,
            ...((data?.recentDonators ?? []).map((d: { avatar?: string }) => d.avatar)),
        ];
        if (candidates.some((url) => url?.includes('hyvatar.io'))) {
            return 'hytale';
        }

        return 'minecraft';
    } catch {
        return 'minecraft';
    }
}

export default async function Page() {
    const [staffMembers, gameType] = await Promise.all([
        getStaffMembers(),
        getGameType(),
    ]);

    return (
        <div className="flex-col rounded-[10px] bg-card p-6">
            <StaffHeading />

            <div className="grid gap-4">
                {Object.entries(staffMembers).map(([role, users]) => (
                    <StaffCategory key={role} role={role} users={users!} gameType={gameType} />
                ))}
            </div>
        </div>
    );
}

function StaffCategory({ role, users, gameType }: { role: string; users: User[]; gameType: GameType }) {
    return (
        <div>
            <h2 className="text-2xl font-bold text-accent-foreground">{role}</h2>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {users.map((user) => (
                    <StaffMember
                        key={user.username}
                        username={user.username}
                        prefix={user.prefix}
                        gameType={gameType}
                    />
                ))}
            </div>
        </div>
    );
}

function StaffMember({ username, prefix, gameType }: User & { gameType: GameType }) {
    const isHytale = gameType === 'hytale';
    const src = isHytale
        ? `https://hyvatar.io/render/${encodeURIComponent(username)}?size=60`
        : `https://minotar.net/avatar/${username}/64`;

    return (
        <div className="flex items-center gap-4 rounded-md border border-accent-foreground/10 bg-accent p-4">
            <Image
                src={src}
                alt={username}
                width={60}
                height={60}
                className="rounded-md"
            />
            <div>
                <h3 className="font-bold text-accent-foreground">{username}</h3>
                <p
                    className="text-sm"
                    dangerouslySetInnerHTML={{
                        __html: prefix
                    }}
                ></p>
            </div>
        </div>
    );
}
