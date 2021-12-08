import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/autentification/services/auth.service';
import { SocketResponse } from 'src/app/sockets/model/socket-response.model';
import { SocketService } from 'src/app/sockets/socket.service';
import { PincodeDialogComponent } from 'src/app/unregistered/pincode-dialog/pincode-dialog.component';
import { AddOrderItemDialogComponent } from '../add-dish-item-dialog/add-dish-item-dialog.component';
import { DishItem, DishItemDTO, DrinkItems, DrinkItemsDTO, OrderDTO, OrderItem, OrderItemDTO } from '../models/order.model';
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
  order: OrderDTO | undefined;
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
      if(!result)
        this.router.navigate(['/home/waiter'])
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
          }, (err: any) => {
            this.router.navigate(['/home/waiter'])
          });
      }
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  handleChange = (data : SocketResponse) => {
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

  openEditOrderItemDialog(item: OrderItemDTO) {
    let orderItem: OrderItem;
    if(item instanceof DrinkItemsDTO) {
      orderItem = new DrinkItems(item);
    } else {
      orderItem = new DishItem(item);
    }

    let dialogRef = this.dialog.open(AddOrderItemDialogComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      data: orderItem
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`); // Pizza!
    });
  }

}
