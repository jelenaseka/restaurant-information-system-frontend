import { DishItem } from "./DishItem.model";

export interface DishItemDetails {
    id : number,
    notes : string,
    chef: string,
    state : string,
    icon : string
    createdAt : string,
    itemList : DishItem[],
}