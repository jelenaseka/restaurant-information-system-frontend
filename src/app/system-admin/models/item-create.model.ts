import { ItemCategoryCreate } from "./item-category-create.model";

export interface ItemCreate {
    itemCategory: ItemCategoryCreate;
    name: string;
    description: string;
    iconBase64: string | null;
    type: string;
    components: string[];
    price: number;
}