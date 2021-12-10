import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/autentification/services/auth.service';
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
export class TableDetailsComponent implements OnInit {
  pinCode: string | undefined;
  table: string = 'T1';
  isWaiter: boolean = false;
  order: OrderDTO;
  selectedItemId: number
  iSentRequest : boolean = false;

  constructor(public dialog: MatDialog, private auth: AuthService, private toastService: ToastrService,
    private router: Router, private orderService: OrderService,
    private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.connect("order", this.handleChange);
    this.pinCode = undefined;
    this.table = 'T1'
    const dialogRef = this.dialog.open(PincodeDialogComponent, {
      width: '250px',
      data: {pinCode: this.pinCode, heading: 'Access table T1'},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.pinCode = result;
        this.getOrderByRestaurantTableNameIfWaiterValid();
    });
  }

  getOrderByRestaurantTableNameIfWaiterValid() {
    if(this.pinCode !== undefined) {
    this.orderService.getOrderByRestaurantTableNameIfWaiterValid('T1',this.pinCode)
          .subscribe((data) => {
            this.isWaiter = true
            this.order = new OrderDTO(data.id, data.totalPrice, data.createdAt, data.waiter, data.waiterId,
              data.dishItemList, data.drinkItemsList);
            console.log('ORDER: ',this.order)
          }, (err: any) => {
            this.router.navigate(['/home'])
          });
      }
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  handleChange = (data : SocketResponse) => {
    console.log('desi se')
    if(data.successfullyFinished) {
      this.getOrderByRestaurantTableNameIfWaiterValid();
      if(this.iSentRequest) {
        this.toastService.success(data.message, 'Ok')
      }
    } else {
      if(this.iSentRequest) {
        this.toastService.error(data.message, "Error")
      }
    }
    this.iSentRequest = false;
  }

  deliverDrinkItems(waiterId: number | undefined, itemId: number): void {
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

  openCreateDrinkItemsDialog() {
    let item = {
      id: -1,
      notes: "",
      state: "ON_HOLD",
      itemList: [],
      name: ""
    }
    let orderItem: OrderItem = new DrinkItems(new DrinkItemsDTO(item));
    
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

  edit(result: any) {
    if(result === "" || result === undefined) {
      return
    }
    this.iSentRequest = true;
    if(result instanceof DrinkItemsUpdateDTO) {
      this.socketService.sendMessage("/drink-items/update/" + this.selectedItemId, JSON.stringify(result))
    } else if(result instanceof DishItemUpdateDTO) {
      this.socketService.sendMessage("/dish-item/update/" + this.selectedItemId, JSON.stringify(result))
    } else if (result instanceof DrinkItemsCreateDTO) {
      console.log('ivde')
      this.socketService.sendMessage("/drink-items/create", JSON.stringify(result))
    } else if (result instanceof DishItemCreateDTO) {
      this.socketService.sendMessage("/dish-item/create", JSON.stringify(result))
    }
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
