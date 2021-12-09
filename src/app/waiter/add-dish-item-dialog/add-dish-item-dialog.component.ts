import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DishItem, DishItemDTO, DishItemOrderedDTO, DrinkItemDTO, DrinkItems, DrinkItemsDTO, OrderItem } from '../models/order.model';
import { Category, CategoryService } from '../services/category.service';
import { mergeMap, map, filter, switchMap, concatAll } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatTabChangeEvent } from '@angular/material/tabs';

interface ItemForMenu {
  id: number,
  name: string,
  iconBase64: string
}

interface ItemsForMenu {
  category: string,
  items: ItemForMenu[]
}

class DrinkItemsCreate {
  orderId: number;
  notes: string;
  drinkItemList: DrinkItemDTO[];

  constructor(orderId: number, notes: string, drinkItemList: DrinkItemDTO[]) {
    this.orderId = orderId;
    this.notes = notes;
    this.drinkItemList = drinkItemList
  }
}

class DishItemCreate {
  orderId: number;
  notes: string;
  amount: number;
  itemId: number;

  constructor(orderId: number, notes: string, amount: number, itemId: number) {
    this.orderId = orderId;
    this.notes = notes;
    this.amount = amount;
    this.itemId = itemId;
  }
}

class ItemForDialog {
  id: number;
  notes: string;
  icon: string;
  items: any[];
  name: string;

  constructor() {
    this.id = -1;
    this.notes = "";
    this.icon = "";
    this.items = [];
    this.name = "";
  }
}

@Component({
  selector: 'app-add-dish-item-dialog',
  templateUrl: './add-dish-item-dialog.component.html',
  styleUrls: ['./add-dish-item-dialog.component.scss']
})
export class AddOrderItemDialogComponent implements OnInit {
  categories: Category[] = []
  itemsForMenu: ItemsForMenu[] = []
  itemsByCategory: ItemsForMenu[] = []
  itemType: string
  selected: number = 0
  itemForDialog: ItemForDialog
  itemsOriginal: any[] = []

  constructor(public dialogRef: MatDialogRef<AddOrderItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService,
    private http: HttpClient) { }

  ngOnInit(): void {
    console.log('oninit')
    console.log('data: ',this.data)
    this.itemType = this.data.orderItem instanceof DrinkItems ? 'DRINK' : 'DISH'
    this.getCategoriesAndItemsForMenu()
    this.itemForDialog = new ItemForDialog()
    if(this.itemType == 'DISH') {
      this.itemForDialog.items.push(((this.data.orderItem as DishItem).dishItem as DishItemDTO).orderedItem)
      this.itemsOriginal = JSON.parse(JSON.stringify(this.itemForDialog.items))

      this.itemForDialog.id = ((this.data.orderItem as DishItem).dishItem as DishItemDTO).id
      this.itemForDialog.notes = ((this.data.orderItem as DishItem).dishItem as DishItemDTO).notes
      this.itemForDialog.icon = ((this.data.orderItem as DishItem).dishItem as DishItemDTO).icon
    } else {
      ((this.data.orderItem as DrinkItems).drinkItems as DrinkItemsDTO).itemList.forEach(item => {
        this.itemForDialog.items.push(item)
      });
      this.itemsOriginal = JSON.parse(JSON.stringify(this.itemForDialog.items))

      this.itemForDialog.id = ((this.data.orderItem as DrinkItems).drinkItems as DrinkItemsDTO).id
      this.itemForDialog.name = ((this.data.orderItem as DrinkItems).drinkItems as DrinkItemsDTO).name
      this.itemForDialog.notes = ((this.data.orderItem as DrinkItems).drinkItems as DrinkItemsDTO).notes
    }
    
  }

  getCategoriesAndItemsForMenu(): void {
    let i = 0
    this.categoryService.getCategories().pipe(
      mergeMap((data) => data),
      filter(item => item.type === this.itemType),
      mergeMap(item => {
        this.categories.push({name: item.name, type: item.type})
        return this.getItemsForCategory(item.name)
      })
    )
    .subscribe((data) => {
      this.itemsForMenu.push({category: this.categories[i].name, items: data})
      i = i + 1
    })
  }

  getItemsForCategory(category: string): Observable<ItemForMenu[]> {
    return this.http.get<ItemForMenu[]>("/item/category/" + category);
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.itemsByCategory = this.itemsForMenu.filter(item => item.category === this.categories[tabChangeEvent.index].name)
  }

  editOrderItem() {
    if(this.itemType == 'DRINK') {
      let createDrinkItems = new DrinkItemsCreate(this.data.orderId, this.itemForDialog.notes, [])
      this.itemForDialog.items.forEach(item => {
        console.log('item status',item.status)
        createDrinkItems.drinkItemList.push(new DrinkItemDTO(item.id, item.amount, item.name))
      })
      // this.dialogRef.close(createDrinkItems);
    } else {
      // let amount = this.itemForDialog.items[0].amount
      // let createDishItem = new DishItemCreate(this.data.orderId, this.itemForDialog.notes, amount, this.itemForDialog.id)
      // this.dialogRef.close(createDishItem);
    }
    
  }

  resetChanges(): void {
    this.itemForDialog.items = JSON.parse(JSON.stringify(this.itemsOriginal))
    if(this.itemType == 'DRINK') { 
      ((this.data.orderItem as DrinkItems).drinkItems as DrinkItemsDTO).itemList = JSON.parse(JSON.stringify(this.itemsOriginal))
    } else {
      ((this.data.orderItem as DishItem).dishItem as DishItemDTO).orderedItem = JSON.parse(JSON.stringify(this.itemsOriginal[0]))
    }
    this.dialogRef.close("");
  }

  increment(item: any) {
    item.amount = item.amount + 1
  }

  decrement(item: any) {
    item.amount = item.amount - 1
  }

  addItem() {
    if(this.itemType == 'DRINK') { // SAMO TADA MOZE
      // this.itemForDialog.items.push(new DrinkItemDTO(0, 0, "name")) //prvo je id ITEMA sa menija, i ime dobija, amount je 0
    }
  }

}
