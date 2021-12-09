import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DishItem, DishItemDTO, DrinkItems, DrinkItemsDTO } from '../models/order.model';

class OrderItemRepresentation {
  id: number;
  notes: string;
  items: any[];

  constructor(id: number, notes: string, items: any[]) {
    this.id = id;
    this.notes = notes;
    this.items = items;
  }
}

class OrderItemCopy {
  notes: string;
  items: any[]

  constructor(notes: string, items: any) {
    this.notes = notes;
    this.items = items;
  }
}

enum ItemStatus {
  CREATE, UPDATE, DELETE, NONE
}

class DrinkItemCopy {
  id: number;
  amount: number;
  itemName: string;
  itemId: number;
  status: ItemStatus;

  constructor(id: number, amount: number, itemName: string, itemId: number, status: ItemStatus) {
    this.id = id;
    this.amount = amount;
    this.itemName = itemName;
    this.itemId = itemId;
    this.status = status;
  }
}

class DishItemCopy {
  amount: number;
  itemName: string;
  itemId: number;
  status: ItemStatus;

  constructor(amount: number, itemName: string, itemId: number, status: ItemStatus) {
    this.amount = amount;
    this.itemName = itemName;
    this.itemId = itemId;
    this.status = status;
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

  constructor(public dialogRef: MatDialogRef<OrderItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.itemType = this.data.orderItem instanceof DrinkItems ? 'DRINK' : 'DISH'
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
    console.log('representation: ',this.orderItemRepresentation)
    console.log('copy: ',this.orderItemCopy)
  }

  editOrderItem() {
    console.log(this.orderItemRepresentation.id)
  }

  resetChanges() {
    console.log('representation: ',this.orderItemRepresentation)
    console.log('copy: ',this.orderItemCopy)
  }

  addItem() {
    if(this.itemType === 'DISH') {
      this.orderItemCopy.items.push(new DishItemCopy(0, "item dish", 1, ItemStatus.CREATE))
    } else {
      this.orderItemCopy.items.push(new DrinkItemCopy(-1, 0, "item 1", 1, ItemStatus.CREATE))
    }
  }

  incrementAmount(item: any) {
    item.amount = item.amount + 1
  }

  decrementAmount(item: any) {
    item.amount = item.amount - 1
  }

}
