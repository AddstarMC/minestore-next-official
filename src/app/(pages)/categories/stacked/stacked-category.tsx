import { TItem } from '@/types/item';
import { StackedItemRow } from './stacked-item-row';

type StackedCategoryProps = {
    items: TItem[];
};

export function StackedCategory({ items }: StackedCategoryProps) {
    const stackedItems = items.filter(item => item.stacked_tiers?.tiers && item.stacked_tiers.tiers.length > 0);

    if (!stackedItems.length) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
                <span>No items available in this category.</span>
                {items.length > 0 && (
                    <span className="text-xs">
                        {items.length} item{items.length !== 1 ? 's' : ''} exist but have no tiers configured.
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4">
            {stackedItems.map((item) => (
                <StackedItemRow key={item.id} item={item} />
            ))}
        </div>
    );
}
