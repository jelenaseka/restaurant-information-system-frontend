import { ItemForMenu } from "./item-for-menu.model";

export class ItemsForMenu {
    category: string;
    items: ItemForMenu[];
  
    constructor(category: string, items: ItemForMenu[]) {
      this.category = category;
      this.items = items;
    }
  }