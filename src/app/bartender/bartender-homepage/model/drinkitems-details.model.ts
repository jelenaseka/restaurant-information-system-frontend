import { DrinkItem } from "./DrinkItem.model";

export interface DrinkItemsDetails {
    id : number,
    notes : string,
    bartender: string,
    state : string,
    itemList : DrinkItem[],
    createdAt : string
}