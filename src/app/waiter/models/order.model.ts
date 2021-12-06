export interface OrderDTO {
  id: number,
  totalPrice: number,
  createdAt: string,
  waiter: string,
  dishItemList: DishItemDTO[],
  drinkItemsList: DrinkItemsDTO[]
}

interface DrinkItemsDTO {
  id: number,
  notes: string,
  state: string,
  itemList: DrinkItemDTO[],
  name: string
}

interface DrinkItemDTO {
  id: number,
  amount: number,
  itemName: string
}

interface DishItemDTO {
  id: number,
  notes: string,
  state: string,
  icon: string,
  orderedItem: DishItemOrderedDTO
}

interface DishItemOrderedDTO {
  itemName: string,
  amount: number
}