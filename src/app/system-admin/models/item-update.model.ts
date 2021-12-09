import { ItemCreate } from "./item-create.model";

export interface ItemUpdate extends ItemCreate {
    code: string;
}