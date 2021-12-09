import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
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
export class TableDetailsComponent implements OnInit, OnDestroy {
  pinCode: string | undefined;
  table: string = 'T1';
  isWaiter: boolean = false;
  order: OrderDTO | undefined;
  iSentRequest : boolean = false;

  discardedOrCharged : boolean = false;

  idFromRoute : number | undefined;
  routeSub: Subscription | undefined;

  constructor(public dialog: MatDialog, private auth: AuthService, private toastService: ToastrService,
    private router: Router, private orderService: OrderService,
    private socketService: SocketService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.idFromRoute = params['table'];

      this.socketService.connect("order", this.handleChange);
      this.pinCode = undefined;
      this.table = 'T1'
      const dialogRef = this.dialog.open(PincodeDialogComponent, {
        width: '250px',
        data: {pinCode: this.pinCode, heading: 'Access table'},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(!result)
          this.router.navigate(['/home/waiter'])
        this.pinCode = result;
        this.getOrderByRestaurantTableNameIfWaiterValid();
      });


    });
  }

  getOrderByRestaurantTableNameIfWaiterValid() {
    if(this.pinCode !== undefined) {
    this.orderService.getOrderByRestaurantTableNameIfWaiterValid(this.idFromRoute as number, this.pinCode)
          .subscribe((data) => {
            this.isWaiter = true
            this.order = new OrderDTO(data.id, data.totalPrice, data.createdAt, data.waiter, data.waiterId,
              data.dishItemList, data.drinkItemsList);
          }, (err: any) => {
            this.router.navigate(['/home/waiter'])
          });
      }
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

  handleChange = (data : SocketResponse) => {
    if(data.successfullyFinished) {
      this.getOrderByRestaurantTableNameIfWaiterValid();
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

  discard() : void {
    this.iSentRequest = true;
    this.discardedOrCharged = true;
    this.socketService.sendMessage("/order/discard/"+this.idFromRoute, JSON.stringify({}))
  }

  charge() : void {
    this.iSentRequest = true;
    this.discardedOrCharged = true;
    this.socketService.sendMessage("/order/charge/"+this.idFromRoute, JSON.stringify({}))
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
