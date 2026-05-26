"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGameType } from '@/hooks/use-game-type';

export default function PatronMember({
                                        username,
                                        rank,
                                        amount,
                                        currencyCode,
                                     }: {
   username: string;
   rank?: number;
   amount?: number;
   currencyCode?: string;
}) {
   const gameType = useGameType();
   const isHytale = gameType === 'hytale';
   const initialSrc = isHytale
      ? `https://hyvatar.io/render/${encodeURIComponent(username)}?size=100`
      : `https://minotar.net/avatar/${username}/100.png`;
   const fallbackSrc = isHytale
      ? `https://hyvatar.io/render/NPC?size=100`
      : 'https://minotar.net/avatar/test/100.png';
   const [imgSrc, setImgSrc] = useState(initialSrc);
   const t = useTranslations('patrons');

   let bgColorClass = 'bg-accent';
   if (rank === 1) bgColorClass = 'bg-yellow-500 px-9';
   if (rank === 2) bgColorClass = 'bg-gray-400 px-9';
   if (rank === 3) bgColorClass = 'bg-amber-800 px-9';

   return (
      <div
         className={`flex flex-col items-center p-4 rounded-lg ${bgColorClass} shadow-md rounded border-2 border-accent-foreground/10`}
      >
         <h3 className="font-bold text-accent-foreground text-center mb-2">{username}</h3>
         <Image
            src={imgSrc}
            alt={username}
            width={100}
            height={100}
            quality={100}
            className="rounded-md mb-4"
            onError={() => setImgSrc(fallbackSrc)}
         />
         {amount !== undefined && currencyCode && rank && rank <= 3 && (
            <p className="text-sm font-semibold text-gray-200">
               {t('spent')} {amount}
               {currencyCode}
            </p>
         )}
      </div>
   );
}
