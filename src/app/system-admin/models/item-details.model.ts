import { ItemCategoryCreate } from "./item-category-create.model";
import { PriceHistory } from "./price-history.model";

export interface ItemDetails {
    itemCategory: ItemCategoryCreate;
    prices: PriceHistory[];
    code: string;
    name: string;
    description: string;
    iconBase64: string | null;
    type: string;
    components: string[];
}