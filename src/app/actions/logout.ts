'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const COOKIES_TO_CLEAR = [
    'token',
    'lastCategoryClicked',
    'discord_linked',
    'discord_username',
    'discord_id',
];

export async function logoutAction() {
    const cookieStore = await cookies();
    for (const name of COOKIES_TO_CLEAR) {
        cookieStore.delete(name);
    }

    revalidatePath('/', 'layout');
    redirect('/');
}
