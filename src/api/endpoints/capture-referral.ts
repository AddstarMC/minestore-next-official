import { AxiosInstance } from 'axios';

type CaptureReferralResponse = {
    success: boolean;
    attribution_applied?: boolean;
    message?: string;
};
export const captureReferral = (fetcher: AxiosInstance) => async (refCode: string) => {
    const url = '/capture-referral';
    const response = await fetcher.post<CaptureReferralResponse>(url, { ref: refCode }, {
        withCredentials: true,
    });
    return response.data;
};
