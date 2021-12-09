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

export class DrinkItemsCreateDTO {
  notes: string;
  drinkItems: DrinkItemUpdateDTO[]

  constructor(notes: string, drinkItems: DrinkItemUpdateDTO[]) {
    this.notes = notes;
    this.drinkItems = drinkItems;
  }
}

export class DrinkItemsUpdateDTO {
  id: number;
  notes: string;
  drinkItems: DrinkItemUpdateDTO[]

  constructor(id: number, notes: string, drinkItems: DrinkItemUpdateDTO[]) {
    this.id = id;
    this.notes = notes;
    this.drinkItems = drinkItems;
  }
}

class DrinkItemUpdateDTO {
  id: number;
  amount: number;
  itemId: number;
  status: ItemStatus;

  constructor(id: number, amount: number, itemId: number, status: ItemStatus) {
    this.id = id;
    this.amount = amount;
    this.itemId = itemId;
    this.status = status;
  }
}

export class DishItemUpdateDTO {
  id: number;
  notes: string;
  amount: number;

  constructor(id: number, notes: string, amount: number) {
    this.id = id;
    this.notes = notes;
    this.amount = amount;
  }
}

export class DishItemCreateDTO {
  itemId: number;
  notes: string;
  amount: number;

  constructor(itemId: number, notes: string, amount: number) {
    this.itemId = itemId;
    this.notes = notes;
    this.amount = amount;
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
    // console.log('representation: ',this.orderItemRepresentation)
    // console.log('copy: ',this.orderItemCopy)
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
          items)
        this.dialogRef.close(drinkItemsCreateDTO);
      } else {
        console.log(this.orderItemCopy)
        if(this.orderItemCopy.items[0] == null) {
          return
        }
        let dishItemCreateDTO: DishItemCreateDTO = new DishItemCreateDTO(
          this.orderItemCopy.items[0].itemId,
          this.orderItemCopy.notes,
          this.orderItemCopy.items[0].amount
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
          items)

        this.dialogRef.close(drinkItemsUpdateDTO);
      } else {
        let dishItemUpdateDTO: DishItemUpdateDTO = new DishItemUpdateDTO(
          this.orderItemRepresentation.id,
          this.orderItemCopy.notes,
          this.orderItemCopy.items[0].amount
        )

        this.dialogRef.close(dishItemUpdateDTO)
      }
    }
  }

  resetChanges() {
    this.dialogRef.close("")
  }

  addItem() {
    if(this.itemType === 'DISH') {
      this.orderItemCopy.items.push(new DishItemCopy(0, "item dish", 1, ItemStatus.CREATE))
    } else {
      this.orderItemCopy.items.push(new DrinkItemCopy(-1, 0, "item 1", 1, ItemStatus.CREATE))
    }
  }

  removeItem(orderItem: any) {
    console.log(orderItem)
    this.orderItemCopy.items = this.orderItemCopy.items.filter(item => {
      return item.id !== orderItem.id && item.itemName !== orderItem.itemName
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

}
