import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DrinkItemsDetails } from 'src/app/bartender/bartender-homepage/model/drinkitems-details.model';
import {MatDialog} from '@angular/material/dialog';
import { PincodeDialogComponent } from '../pincode-dialog/pincode-dialog.component';
import { AuthService } from 'src/app/autentification/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { DishItemDetails } from 'src/app/chef/chef-homepage/model/dishitem-details.model';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {

  pinCode: string | undefined;
  @Input()
  item : DrinkItemsDetails | DishItemDetails | undefined;
  @Output()
  closeEvent = new EventEmitter();
  @Output()
  acceptButtonEvent = new EventEmitter();

  constructor(public dialog: MatDialog, private auth: AuthService, private toastService: ToastrService) { }

  openDialog(): void {
    this.pinCode = undefined;
    const dialogRef = this.dialog.open(PincodeDialogComponent, {
      width: '250px',
      data: {pinCode: this.pinCode},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.pinCode = result;
      if(this.pinCode !== undefined) {
      

        let userType : string = this.getUserType().toLowerCase();
        if(this.pinCodeIsValid()) {
          this.auth.checkPinCode(Number.parseInt(<string>this.pinCode), userType)
            .subscribe(data => {
                if(this.item?.state === "ON_HOLD")
                  this.emitAcceptButtonEvent(data.id);
                else if(data.pinCode !== <string>this.pinCode)
                  this.toastService.error("That order is not yours!", 'Not updated');
                else
                  this.emitAcceptButtonEvent(data.id);
              }, (err: any) => this.toastService.error(`You are not valid ${userType}!`, 'Not updated'));
        } else {
          this.toastService.error(`You are not valid ${userType}!`, 'Not updated');
        }
      }
    });
  }

  getBartenderOrChefName() : string {
    if(this.item === undefined)
      return '';
    if('bartender' in this.item)
      return this.item?.bartender !== "" ? this.item?.bartender : "None";
    return this.item?.chef !== "" ? this.item?.chef : "None";

  }

  getUserType() : string {
    if(this.item === undefined)
    return '';
    if('bartender' in this.item)
      return "Bartender";
    return "Chef";
  }


  pinCodeIsValid(): boolean {
    if(this.pinCode === undefined)
      return false;
    let data  = Number(this.pinCode);
    if(this.pinCode.length === 4 && !isNaN(+data))
      return true;
    return false;
  }

  ngOnInit(): void {
  }

  getTime() : string {
    if(!this.item)
      return "";
    let time : Date = new Date(Number.parseInt(this.item.createdAt));
    return `${time.getHours()}:${time.getMinutes()}`;
  }

  getIcon() : string {
    if(!this.isThisBartenderPage())
      return (this.item as DishItemDetails).icon;
    return '';
  }

  isThisBartenderPage() : boolean {
    if(this.item === undefined)
    return true;
    if('bartender' in this.item)
      return true;
    return false;
  }

  getTextForButton() : string {
    if(!this.item)
      return "Prepare";
    if(this.item.state === "ON_HOLD")
      return "Prepare";
    else if(this.item.state === "PREPARATION")
      return "Ready";
    else
      return "Already prepared"
  }

  onClose() : void {
    this.closeEvent.emit();
  }

  emitAcceptButtonEvent(userId: number) : void {
    this.acceptButtonEvent.emit(userId);
  }

}
