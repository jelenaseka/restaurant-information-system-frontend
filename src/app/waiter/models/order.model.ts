export class OrderDTO {
  id: number;
  totalPrice: number;
  createdAt: string;
  waiter: string;
  waiterId: number;
  dishItemList: DishItemDTO[];
  drinkItemsList: DrinkItemsDTO[];

  constructor(id: number,
    totalPrice: number,
    createdAt: string,
    waiter: string,
    waiterId: number,
    dishItemList: DishItemDTO[],
    drinkItemsList: DrinkItemsDTO[],) {
      this.id = id;
      this.totalPrice = totalPrice;
      this.createdAt = createdAt;
      this.waiter = waiter;
      this.waiterId = waiterId;
      this.dishItemList = [];
      this.drinkItemsList = [];
      for(let item of dishItemList) {
        this.dishItemList.push(new DishItemDTO(item));
      }
      for(let item of drinkItemsList) {
        this.drinkItemsList.push(new DrinkItemsDTO(item));
      }
  }

}

export interface OrderItemDTO {
}

export class DrinkItemsDTO implements OrderItemDTO {
  id: number;
  notes: string;
  state: string;
  itemList: DrinkItemDTO[];
  name: string;

  constructor(item: DrinkItemsDTO) {
    this.id = item.id;
    this.notes = item.notes;
    this.state = item.state;
    this.itemList = item.itemList;
    this.name = item.name;
  }
}

interface DrinkItemDTO {
  id: number,
  amount: number,
  itemName: string
}

export class DishItemDTO implements OrderItemDTO {
  id: number;
  notes: string;
  state: string;
  icon: string;
  orderedItem: DishItemOrderedDTO;

  // constructor(id: number, notes: string, state: string, icon: string, orderedItem: DishItemOrderedDTO) {
  //   this.id = id;
  //   this.notes = notes;
  //   this.state = state;
  //   this.icon = icon;
  //   this.orderedItem = orderedItem;
  // }

  constructor(item: DishItemDTO) {
    this.id = item.id;
    this.notes = item.notes;
    this.state = item.state;
    this.icon = item.icon;
    this.orderedItem = item.orderedItem;
  }
}

interface DishItemOrderedDTO {
  itemName: string,
  amount: number
}


export interface OrderItem {

}

export class DishItem implements OrderItem {
  dishItem: OrderItemDTO;

  constructor(dishItem: OrderItemDTO) {
    this.dishItem = dishItem;
  }
}

export class DrinkItems implements OrderItem {
  drinkItems: OrderItemDTO;
  constructor(drinkItems: OrderItemDTO) {
    this.drinkItems = drinkItems;
  }
}