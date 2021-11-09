import { DrinkItem } from "./drinkitem.model";

export interface DrinkItemsDetails {
    id : number,
    notes : string,
    bartender: string,
    state : string,
    drinkItemList : DrinkItem[],
    createdAt : string
}