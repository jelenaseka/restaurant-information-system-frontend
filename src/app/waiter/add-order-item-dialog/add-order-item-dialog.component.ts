import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DrinkItems, OrderItem } from '../models/order.model';
import { Category, CategoryService } from '../services/category.service';
import { mergeMap, map, filter, switchMap, concatAll } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface ItemForMenu {
  id: number,
  name: string,
  iconBase64: string
}

interface ItemsForMenu {
  category: string,
  items: ItemForMenu[]
}

@Component({
  selector: 'app-add-order-item-dialog',
  templateUrl: './add-order-item-dialog.component.html',
  styleUrls: ['./add-order-item-dialog.component.scss']
})
export class AddOrderItemDialogComponent implements OnInit {
  categories: Category[] = []
  itemsForMenu: ItemsForMenu[] = []
  itemType: string
  category: string

  constructor(public dialogRef: MatDialogRef<AddOrderItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public item: OrderItem,
    private categoryService: CategoryService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.itemType = this.item instanceof DrinkItems ? 'DRINK' : 'DISH'
    this.getCategories()
  }

  getCategories(): void {
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
      console.log(this.categories)
      console.log(this.itemsForMenu)
    })
  }

  getItemsForCategory(category: string): Observable<ItemForMenu[]> {
    return this.http.get<ItemForMenu[]>("/item/category/" + category);
  }

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }

}
