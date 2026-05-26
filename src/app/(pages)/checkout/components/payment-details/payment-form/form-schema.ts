import { z } from 'zod';
import { TDataCollection } from '@/types/settings';

const BUILTIN: Array<keyof TDataCollection['fields']> = [
    'fullname',
    'email',
    'address1',
    'address2',
    'city',
    'region',
    'country',
    'zipcode'
];

export const buildPaymentFormSchema = (dc?: TDataCollection) => {
    const detailsShape: Record<string, z.ZodTypeAny> = {};

    if (dc) {
        for (const key of BUILTIN) {
            const fc = dc.fields[key];
            if (!fc?.enabled) continue;

            if (key === 'email') {
                detailsShape[key] = fc.required
                    ? z.string().email({ message: 'Please enter a valid email.' })
                    : z
                          .string()
                          .email({ message: 'Please enter a valid email.' })
                          .or(z.literal(''))
                          .optional();
            } else {
                detailsShape[key] = fc.required
                    ? z.string().min(1, { message: 'This field is required.' })
                    : z.string().optional();
            }
        }
    }

    const customShape: Record<string, z.ZodTypeAny> = {};
    for (const cf of dc?.custom ?? []) {
        customShape[cf.id] = cf.required
            ? z.string().min(1, { message: 'This field is required.' })
            : z.string().default('');
    }

    return z.object({
        details: z.object(detailsShape).optional(),
        custom: z.object(customShape).optional(),
        termsAndConditions: z.literal(true, {
            errorMap: () => ({ message: 'You must accept Terms and Conditions' })
        }),
        privacyPolicy: z.literal(true, {
            errorMap: () => ({ message: 'You must accept Privacy Policy' })
        }),
        paymentMethod: z.string().min(1, { message: 'Select a payment method.' })
    });
};

export type PaymentFormValues = z.infer<ReturnType<typeof buildPaymentFormSchema>>;

export const defaultValues: Partial<PaymentFormValues> = {
    paymentMethod: ''
};
