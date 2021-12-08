import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DishItem, DishItemDTO, DrinkItems, DrinkItemsDTO, OrderItem } from '../models/order.model';
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
  itemType: string = '';
  selected: number = 0
  itemForDialog: ItemForDialog | undefined;

  constructor(public dialogRef: MatDialogRef<AddOrderItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public item: OrderItem,
    private categoryService: CategoryService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.itemType = this.item instanceof DrinkItems ? 'DRINK' : 'DISH'
    this.getCategoriesAndItemsForMenu()
    this.itemForDialog = new ItemForDialog()
    if(this.itemType == 'DISH') {
      this.itemForDialog.items.push(((this.item as DishItem).dishItem as DishItemDTO).orderedItem)
      this.itemForDialog.id = ((this.item as DishItem).dishItem as DishItemDTO).id
      this.itemForDialog.notes = ((this.item as DishItem).dishItem as DishItemDTO).notes
      this.itemForDialog.icon = ((this.item as DishItem).dishItem as DishItemDTO).icon
    } else {
      ((this.item as DrinkItems).drinkItems as DrinkItemsDTO).itemList.forEach(item => {
        this.itemForDialog?.items.push(item)
      });
      this.itemForDialog.id = ((this.item as DrinkItems).drinkItems as DrinkItemsDTO).id
      this.itemForDialog.name = ((this.item as DrinkItems).drinkItems as DrinkItemsDTO).name
      this.itemForDialog.notes = ((this.item as DrinkItems).drinkItems as DrinkItemsDTO).notes
    }
    
    console.log(this.itemForDialog)
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
      // this.itemsByCategory.push(this.itemsForMenu[0])
      // console.log(this.categories)
      // console.log(this.itemsForMenu)
    })
  }

  getItemsForCategory(category: string): Observable<ItemForMenu[]> {
    return this.http.get<ItemForMenu[]>("/item/category/" + category);
  }

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    // console.log('tabChangeEvent => ', tabChangeEvent);
    // console.log('index => ', tabChangeEvent.index);
    //renderuj one items for menu
    this.itemsByCategory = this.itemsForMenu.filter(item => item.category === this.categories[tabChangeEvent.index].name)
    // console.log(this.itemsByCategory)
    
  }

}
