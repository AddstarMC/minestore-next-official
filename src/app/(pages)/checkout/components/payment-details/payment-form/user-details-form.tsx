import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getFormCountries } from '@/constants/countries';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';
import { UserAvatar } from './user-avatar';
import { useSettingsStore } from '@/stores/settings';
import { useTranslations } from 'next-intl';

const TEXT_FIELDS = [
    'fullname',
    'email',
    'address1',
    'address2',
    'city',
    'region',
    'zipcode'
] as const;

export const UserDetailsForm = () => {
    const { settings } = useSettingsStore();
    const formCountries = getFormCountries();
    const { setValue } = useFormContext();
    const t = useTranslations('checkout.details');

    const dc = settings?.data_collection;
    if (!dc) return null;

    const enabledText = TEXT_FIELDS.filter((f) => dc.fields[f]?.enabled);
    const countryEnabled = dc.fields.country?.enabled;
    const custom = dc.custom ?? [];

    if (enabledText.length === 0 && !countryEnabled && custom.length === 0) {
        return null;
    }

    const star = (f: keyof typeof dc.fields) => (dc.fields[f]?.required ? '*' : '');

    const placeholders: Record<string, string> = {
        fullname: 'John Doe',
        email: 'test@gmail.com',
        address1: '1234 Main St',
        address2: 'Apartment, studio, or floor',
        city: 'New York',
        region: 'NY',
        zipcode: '12345'
    };

    const labelKey: Record<string, string> = {
        fullname: 'full-name',
        email: 'email',
        address1: 'address-line-1',
        address2: 'address-line-2',
        city: 'city',
        region: 'state-region',
        zipcode: 'zip-code'
    };

    return (
        <div className="grid gap-8 xl:grid-cols-[300px,1fr]">
            <div className="m-auto hidden xl:block">
                <UserAvatar />
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-accent-foreground">{t('your-details')}</h2>
                <div className="grid grid-cols-2 gap-4">
                    {enabledText.map((f) => (
                        <FormField
                            key={f}
                            name={`details.${f}`}
                            defaultValue=""
                            render={({ field }) => (
                                <FormItem
                                    className={
                                        f === 'address1' || f === 'address2'
                                            ? 'col-span-2 md:col-span-1'
                                            : undefined
                                    }
                                >
                                    <FormLabel>
                                        {star(f)}
                                        {t(labelKey[f])}
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder={placeholders[f]} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    {countryEnabled && (
                        <FormField
                            defaultValue=""
                            name="details.country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {star('country')}
                                        {t('country')}
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        'w-full justify-between',
                                                        !field.value && 'text-muted-foreground'
                                                    )}
                                                >
                                                    {field.value
                                                        ? formCountries.find(
                                                              (l) => l.value === field.value
                                                          )?.label
                                                        : t('country-placeholder')}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput
                                                    placeholder={t('country-placeholder')}
                                                />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        {t('no-country-found')}
                                                    </CommandEmpty>
                                                    <CommandGroup className="max-h-[200px] overflow-auto">
                                                        {formCountries.map((country) => (
                                                            <CommandItem
                                                                value={country.label}
                                                                key={country.value}
                                                                onSelect={() => {
                                                                    setValue(
                                                                        'details.country',
                                                                        country.value
                                                                    );
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        'mr-2 h-4 w-4',
                                                                        country.value ===
                                                                            field.value
                                                                            ? 'opacity-100'
                                                                            : 'opacity-0'
                                                                    )}
                                                                />
                                                                {country.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {custom.map((cf) => (
                        <FormField
                            key={cf.id}
                            name={`custom.${cf.id}`}
                            defaultValue=""
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>
                                        {cf.required ? '*' : ''}
                                        {cf.label}
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
