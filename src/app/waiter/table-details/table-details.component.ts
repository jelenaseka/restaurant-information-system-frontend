import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/autentification/services/auth.service';
import { convertResponseError } from 'src/app/error-converter.function';
import { SocketResponse } from 'src/app/sockets/model/socket-response.model';
import { SocketService } from 'src/app/sockets/socket.service';
import { PincodeDialogComponent } from 'src/app/unregistered/pincode-dialog/pincode-dialog.component';
import { DishItem, DishItemCreateDTO, DishItemDTO, DishItemUpdateDTO, DrinkItems, DrinkItemsCreateDTO, DrinkItemsDTO, DrinkItemsUpdateDTO, OrderDTO, OrderItem, OrderItemDTO } from '../models/order.model';
import { OrderItemDialogComponent } from '../order-item-dialog/order-item-dialog.component';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-table-details',
  templateUrl: './table-details.component.html',
  styleUrls: ['./table-details.component.scss']
})
export class TableDetailsComponent implements OnInit, OnDestroy {
  pinCode: string;
  isWaiter: boolean = false;
  waiterId: number;
  order: OrderDTO;
  selectedItemId: number
  iSentRequest : boolean = false;

  discardedOrCharged : boolean = false;

  tableIdFromRoute : number;
  routeSub: Subscription | undefined;
  orderCreated: boolean = false

  constructor(public dialog: MatDialog, private auth: AuthService, private toastService: ToastrService,
    private router: Router, private orderService: OrderService,
    private socketService: SocketService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.tableIdFromRoute = params['table'];
      this.socketService.connect("order", this.handleChange);
      this.pinCode = "";
      this.openPinCodeDialog();

    });
  }

  openPinCodeDialog() {
    const dialogRef = this.dialog.open(PincodeDialogComponent, {
      width: '250px',
      data: {pinCode: this.pinCode, heading: 'Access table'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result)
        this.router.navigate(['/home/waiter'])
      this.pinCode = result;
      this.getOrderByRestaurantTableNameIfWaiterValid("");
    });
  }

  getOrderByRestaurantTableNameIfWaiterValid(code: string) {
    if(this.pinCode !== undefined) {
    this.orderService.getOrderByRestaurantTableNameIfWaiterValid(this.tableIdFromRoute, this.pinCode)
          .subscribe((data) => {
            if(data.id === 0) {
              this.auth.checkPinCode(this.pinCode as unknown as number, 'WAITER')
                .subscribe(essentials => {
                  this.waiterId = essentials.id
                })
            }
            this.isWaiter = true
            this.order = new OrderDTO(data.id, data.totalPrice, data.createdAt, data.waiter, data.waiterId,
              data.dishItemList, data.drinkItemsList);
            if(this.order.dishItemList.length === 0 && this.order.drinkItemsList.length === 0
              && code !== "ORDER_CREATED" && this.order.id !== 0) {
              this.discard()
            }
          }, (err: any) => {
            this.router.navigate(['/home/waiter'])
            this.toastService.error(convertResponseError(err), 'Ok')

          });
      }
  }

  handleChange = async (data : SocketResponse) => {
    if(data.successfullyFinished) {
      this.getOrderByRestaurantTableNameIfWaiterValid(data.code);
      if(this.iSentRequest) {
        if(this.discardedOrCharged)
          this.router.navigate(['/home/waiter'])
        this.toastService.success(data.message, 'Ok')
      }
    } else {
      if(this.iSentRequest) {
        this.toastService.error(data.message, "Error")
      }
    }
    this.iSentRequest = false;
  }

  deliverAllDishesIsDisabled() : boolean {
    let flag : boolean = true;
    this.order?.dishItemList.forEach(dishItem => {
      if(dishItem.state === "READY") {
        flag = false;
      }
    });
    return flag;
  }

  deliverAllDrinksIsDisabled() : boolean {
    let flag : boolean = true;
    this.order?.drinkItemsList.forEach(drinkItem => {
      if(drinkItem.state === "READY") {
        flag = false;
      }
    });
    return flag;
  }

  deliverAllDishes() : void {
    this.order?.dishItemList.forEach(dishItem => {
      if(dishItem.state === "READY") {
        this.changeDishItemState(this.order?.waiterId, dishItem.id);
      }
    });
  }

  deliverAllDrinks() : void {
    this.order?.drinkItemsList.forEach(drinkItem => {
      if(drinkItem.state === "READY") {
        this.changeDrinkItemsState(this.order?.waiterId, drinkItem.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
    (this.routeSub as Subscription).unsubscribe();
  }

  

  discard() : void {
    this.iSentRequest = true;
    this.discardedOrCharged = true;
    this.socketService.sendMessage("/order/discard/"+this.order.id, JSON.stringify({}))
  }

  charge() : void {
    this.iSentRequest = true;
    this.discardedOrCharged = true;
    this.socketService.sendMessage("/order/charge/"+this.order.id, JSON.stringify({}))
  }

  changeDrinkItemsState(waiterId: number | undefined, itemId: number): void {
    let data = {
      itemId: <number>itemId,
      userId: waiterId
    }
    this.iSentRequest = true;
    this.socketService.sendMessage("/drink-items/change-state", JSON.stringify(data))
  }

  changeDishItemState(waiterId: number | undefined, itemId: number) {
    let data = {
      userId: waiterId,
      itemId: <number>itemId
    }
    this.iSentRequest = true;
    this.socketService.sendMessage("/dish-item/change-state", JSON.stringify(data))
  }

  openCreateDishItemDialog() {
    let item = {
      id: -1,
      itemId: -1,
      notes: "",
      state: "NEW",
      icon: "",
      orderedItem: {
        itemName: "",
        amount: 0
      }
    }
    let orderItem: OrderItem = new DishItem(new DishItemDTO(item));
    this.openItemDialog(orderItem)
  }

  openCreateDrinkItemsDialog() {
    let item = {
      id: -1,
      notes: "",
      state: "ON_HOLD",
      itemList: [],
      name: ""
    }
    let orderItem: OrderItem = new DrinkItems(new DrinkItemsDTO(item));
    this.openItemDialog(orderItem)
  }

  openItemDialog(orderItem: any) {
    let dialogRef = this.dialog.open(OrderItemDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: {orderItem, orderId: this.order.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.edit(result)
    });
  }

  openEditOrderItemDialog(item: OrderItemDTO) {
    let orderItem: OrderItem;
    this.selectedItemId = item.id
    if(item instanceof DrinkItemsDTO) {
      orderItem = new DrinkItems(item);
    } else {
      orderItem = new DishItem(item);
    }
    this.openItemDialog(orderItem)
  }

  createOrderItem(item: any, orderId: number, shouldCreateOrder: boolean) {
    item.orderId = orderId

    let createOrder: any = null
    if(shouldCreateOrder === true) {
      createOrder = {
        waiterId: this.waiterId,
        tableId: this.tableIdFromRoute
      }
    }

    if(item instanceof DrinkItemsUpdateDTO) {
      this.socketService.sendMessage("/drink-items/update/" + this.selectedItemId, JSON.stringify(item))
    } else if(item instanceof DishItemUpdateDTO) {
      this.socketService.sendMessage("/dish-item/update/" + this.selectedItemId, JSON.stringify(item))
    } else if (item instanceof DrinkItemsCreateDTO) {
      item.orderCreateDTO = createOrder
      this.socketService.sendMessage("/drink-items/create", JSON.stringify(item))
      this.orderCreated = true
    } else if (item instanceof DishItemCreateDTO) {
      item.orderCreateDTO = createOrder
      this.socketService.sendMessage("/dish-item/create", JSON.stringify(item))
      this.orderCreated = true
    }
  }

  edit(result: any) {
    if(result === "" || result === undefined) {
      return
    }

    if(this.order.id === 0) {
      this.iSentRequest = true;
      this.createOrderItem(result, this.order.id, true);
      return
    }

    this.iSentRequest = true;
    this.createOrderItem(result, this.order.id, false);
  }

  deleteDrinkItems(id: number) {
    this.iSentRequest = true;
    this.socketService.sendMessage("/drink-items/delete/" + id, "")
  }

  deleteDishItem(id: number) {
    this.iSentRequest = true;
    this.socketService.sendMessage("/dish-item/delete/" + id, "")
  }

}
