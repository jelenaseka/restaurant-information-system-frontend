import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/autentification/services/auth.service';
import { PincodeDialogComponent } from 'src/app/unregistered/pincode-dialog/pincode-dialog.component';
import { OrderDTO } from '../models/order.model';
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

  constructor(public dialog: MatDialog, private auth: AuthService, private toastService: ToastrService,
    private router: Router, private orderService: OrderService) { }

  ngOnInit(): void {
    this.pinCode = undefined;
    this.table = 'T1'
    const dialogRef = this.dialog.open(PincodeDialogComponent, {
      width: '250px',
      data: {pinCode: this.pinCode, heading: 'Access table T1'},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.pinCode = result;

      if(this.pinCode !== undefined) {
        let userType : string = "waiter";
        this.orderService.getOrderByRestaurantTableNameIfWaiterValid('T1',this.pinCode)
          .subscribe((data) => {
            this.isWaiter = true
            this.order = data
            console.log(data)
          }, (err: any) => {
            this.router.navigate(['/home'])
          });
      }
    });
  }

  // getOrder(): void {
  //   this.orderService.getOrder()
  //     .subscribe((data) => {
  //       // this.order = data
  //     })
  // }

}
