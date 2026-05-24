import { AxiosInstance, isAxiosError } from 'axios';
import { TAnnouncement } from '@/types/announcement';

type ReturnType = TAnnouncement;

export const getAnnouncement = (fetcher: AxiosInstance) => async (): Promise<
    ReturnType | undefined
> => {
    const url = '/announcement/get';
    try {
        return (await fetcher.get<ReturnType>(url)).data;
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            const reason = isAxiosError(error) ? error.message : String(error);
            // eslint-disable-next-line no-console
            console.warn(`[getAnnouncement] dev: backend unreachable (${reason}) — skipping alert`);
            return undefined;
        }
        throw error;
    }
};
