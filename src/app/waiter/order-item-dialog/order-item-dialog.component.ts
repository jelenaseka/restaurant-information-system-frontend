import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { DishItem, DishItemCopy, DishItemCreateDTO, DishItemDTO, DishItemUpdateDTO, DrinkItemCopy, DrinkItems, DrinkItemsCreateDTO, DrinkItemsDTO, DrinkItemsUpdateDTO, DrinkItemUpdateDTO, ItemStatus, OrderItemCopy, OrderItemRepresentation } from '../models/order.model';
import { Category, CategoryService } from '../services/category.service';

interface ItemForMenu {
  id: number,
  name: string,
  iconBase64: string
}

class ItemsForMenu {
  category: string;
  items: ItemForMenu[];

  constructor(category: string, items: ItemForMenu[]) {
    this.category = category;
    this.items = items;
  }
}

@Component({
  selector: 'app-order-item-dialog',
  templateUrl: './order-item-dialog.component.html',
  styleUrls: ['./order-item-dialog.component.scss']
})
export class OrderItemDialogComponent implements OnInit {
  itemType: string = ''
  orderItemRepresentation: OrderItemRepresentation
  orderItemCopy: OrderItemCopy
  itemsForMenu: ItemsForMenu[] = []
  itemsByCategory: ItemsForMenu;
  categories: Category[] = []

  constructor(public dialogRef: MatDialogRef<OrderItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private categoryService: CategoryService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.itemsByCategory = new ItemsForMenu('', [])
    console.log('u initu za dijalog')
    this.getCategoriesAndItemsForMenu()
    this.itemType = this.data.orderItem instanceof DrinkItems ? 'DRINK' : 'DISH'
    console.log('item type: ',this.itemType)
    if(this.itemType == 'DISH') {
      let notes = JSON.parse(JSON.stringify(((this.data.orderItem as DishItem).dishItem as DishItemDTO).notes))
      let id = JSON.parse(JSON.stringify(((this.data.orderItem as DishItem).dishItem as DishItemDTO).id))
      let item = JSON.parse(JSON.stringify(((this.data.orderItem as DishItem).dishItem as DishItemDTO).orderedItem))
      
      this.orderItemCopy = new OrderItemCopy(notes, []);
      this.orderItemRepresentation = new OrderItemRepresentation(id, notes, [])

      if(item.amount !== 0) {
        this.orderItemRepresentation.items.push(item);
        this.orderItemRepresentation.items.forEach(item => {
          this.orderItemCopy.items.push(new DishItemCopy(item.amount, item.itemName, -1, ItemStatus.NONE))
        })
      }
      
    } else {
      let notes = JSON.parse(JSON.stringify(((this.data.orderItem as DrinkItems).drinkItems as DrinkItemsDTO).notes))
      let id = JSON.parse(JSON.stringify(((this.data.orderItem as DrinkItems).drinkItems as DrinkItemsDTO).id))
      let items = JSON.parse(JSON.stringify(((this.data.orderItem as DrinkItems).drinkItems as DrinkItemsDTO).itemList))
      
      this.orderItemCopy = new OrderItemCopy(notes, []);
      this.orderItemRepresentation = new OrderItemRepresentation(id, notes, [])
      
      this.orderItemRepresentation.items = items;
      this.orderItemRepresentation.items.forEach(item => {
        this.orderItemCopy.items.push(new DrinkItemCopy(item.id, item.amount, item.itemName, -1, ItemStatus.NONE))
      })
      
    }
  }

  getCategoriesAndItemsForMenu(): void {
    console.log('na pocetku dobavljanja')
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
      console.log('dobavio')
      i = i + 1
    })
  }

  getItemsForCategory(category: string): Observable<ItemForMenu[]> {
    return this.http.get<ItemForMenu[]>("/item/category/" + category);
  }

  editOrderItem() {
    if(this.orderItemRepresentation.id === -1) {
      //create
      if(this.itemType === 'DRINK') {
        let items: DrinkItemUpdateDTO[] = []
        this.orderItemCopy.items.forEach(item => {
          items.push(new DrinkItemUpdateDTO(item.id, item.amount, item.itemId, item.status))
        })
        let drinkItemsCreateDTO: DrinkItemsCreateDTO = new DrinkItemsCreateDTO(
          this.orderItemCopy.notes,
          items,
          this.data.orderId)
        this.dialogRef.close(drinkItemsCreateDTO);
      } else {
        console.log(this.orderItemCopy)
        if(this.orderItemCopy.items[0] == null) {
          return
        }
        let dishItemCreateDTO: DishItemCreateDTO = new DishItemCreateDTO(
          this.orderItemCopy.items[0].itemId,
          this.orderItemCopy.notes,
          this.orderItemCopy.items[0].amount,
          this.data.orderId
        )

        this.dialogRef.close(dishItemCreateDTO)
      }
    } else {
      // update
      if(this.itemType === 'DRINK') {
        let items: DrinkItemUpdateDTO[] = []
        this.orderItemCopy.items.forEach(item => {
          console.log('item', item)
          items.push(new DrinkItemUpdateDTO(item.id, item.amount, item.itemId, item.status))
        })
        let drinkItemsUpdateDTO: DrinkItemsUpdateDTO = new DrinkItemsUpdateDTO(
          this.orderItemRepresentation.id,
          this.orderItemCopy.notes,
          items,
          this.data.orderId)

        this.dialogRef.close(drinkItemsUpdateDTO);
      } else {
        let dishItemUpdateDTO: DishItemUpdateDTO = new DishItemUpdateDTO(
          this.orderItemRepresentation.id,
          this.orderItemCopy.notes,
          this.orderItemCopy.items[0].amount,
          this.data.orderId
        )

        this.dialogRef.close(dishItemUpdateDTO)
      }
    }
  }

  resetChanges() {
    this.dialogRef.close("")
  }

  removeItem(orderItem: any) {
    console.log(orderItem)
    this.orderItemCopy.items = this.orderItemCopy.items.filter(item => {
      if(item.itemId !== orderItem.itemId && item.itemName !== orderItem.itemName) {
        if(item.status !== ItemStatus.CREATE) {
          item.status = ItemStatus.DELETE
        }
      }
      if(item.itemId === -1) {
        return item.id !== orderItem.id && item.itemName !== orderItem.itemName
      } else {
        return item.itemId !== orderItem.itemId && item.itemName !== orderItem.itemName
      }
    })
  }

  incrementAmount(item: any) {
    item.amount = item.amount + 1
    if(item.status !== ItemStatus.CREATE) {
      item.status = ItemStatus.UPDATE
    }
  }

  decrementAmount(item: any) {
    item.amount = item.amount - 1
    if(item.status !== ItemStatus.CREATE) {
      item.status = ItemStatus.UPDATE
    }
  }

  async tabChanged(tabChangeEvent: MatTabChangeEvent): Promise<void> {
    const sleep = async () => {
      return new Promise(resolve => setTimeout(resolve, 1000));
    }
    if(this.itemsForMenu.length === 0) {
      await sleep();
    }
    this.itemsByCategory = new ItemsForMenu('', [])
    let categoryAndItems = this.itemsForMenu.find(item => item.category === this.categories[tabChangeEvent.index].name)
    console.log(categoryAndItems)
    if(categoryAndItems === undefined) return
    this.itemsByCategory.items = categoryAndItems.items
    this.itemsByCategory.category = categoryAndItems.category
  }

  addItemToList(itemId: number, itemName: string) {
    if(this.itemType === 'DISH') {
      this.orderItemCopy.items.push(new DishItemCopy(0, itemName, itemId, ItemStatus.CREATE))
    } else {
      this.orderItemCopy.items.push(new DrinkItemCopy(-1, 0, itemName, itemId, ItemStatus.CREATE))
    }
  }

  isAddButtonDisabled(itemId: number) {
    let shouldDisable = false
    if(this.itemType === 'DISH' && this.orderItemRepresentation.id !== -1) {
      shouldDisable = true
    }
    if(this.itemType === 'DISH' && this.orderItemCopy.items.length === 1) {
      shouldDisable = true
    } 
    else if(this.itemType === 'DRINK') {
      this.orderItemCopy.items.forEach(item => {
        if(item.itemId === itemId) shouldDisable = true
      })
    }
    return shouldDisable
  }

  isRemoveButtonDisabled() {
    return (this.itemType === 'DISH' && this.orderItemRepresentation.id !== -1)
  }

  isDoneButtonDisabled() {
    let shouldDisable = false
    if(this.orderItemCopy.items[0] == null || (this.itemType === 'DISH' && this.orderItemCopy.items[0].amount === 0)) {
      shouldDisable = true
    }
    if(this.itemType === 'DRINK' && this.orderItemCopy.items.length > 0) {
      this.orderItemCopy.items.forEach(item => {
        if(item.amount === 0) {
          shouldDisable = true
        }
      })
    }
    return shouldDisable;
  }
}
