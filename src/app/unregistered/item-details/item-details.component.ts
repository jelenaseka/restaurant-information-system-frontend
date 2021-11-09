import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DrinkItemsDetails } from 'src/app/bartender/bartender-homepage/model/drinkitems-details.model';
import {MatDialog} from '@angular/material/dialog';
import { PincodeDialogComponent } from '../pincode-dialog/pincode-dialog.component';
import { AuthService } from 'src/app/autentification/services/auth.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
  pinCode: string | undefined;
  @Input()
  item : DrinkItemsDetails | undefined;
  @Output()
  closeEvent = new EventEmitter();
  @Output()
  acceptButtonEvent = new EventEmitter();

  constructor(public dialog: MatDialog, private auth: AuthService) { }

  openDialog(): void {
    this.pinCode = undefined;
    const dialogRef = this.dialog.open(PincodeDialogComponent, {
      width: '250px',
      data: {pinCode: this.pinCode},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.pinCode = result;
      
      //TODO uzmi od simica one alertove i svuda stavi gde treba
      if(this.pinCodeIsValid()) {
        this.auth.checkPinCode(Number.parseInt(<string>this.pinCode), "bartender")
          .subscribe(data => {
              if(this.item?.state === "ON_HOLD")
                this.emitAcceptButtonEvent(data.id);
              else if(data.pinCode !== <string>this.pinCode)
                alert("That order is not yours!");
              else
                this.emitAcceptButtonEvent(data.id);
            }, (err: any) => alert("You are not valid bartender!"));
      }

    });
  }

  pinCodeIsValid(): boolean {
    console.log(parseInt(<string>this.pinCode))
    //TODO uzmi od simica validaciju
    if(this.pinCode != undefined && this.pinCode.length === 4 && parseInt(<string>this.pinCode) !== NaN)
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
