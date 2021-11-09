import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DrinkItemsDetails } from 'src/app/bartender/bartender-homepage/model/DrinkItemsDetails.model';
import {MatDialog} from '@angular/material/dialog';
import { PincodeDialogComponent } from '../pincode-dialog/pincode-dialog.component';
import { AuthService } from 'src/app/autentification/services/auth.service';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {
  pinCode: number | undefined;
  @Input()
  item : DrinkItemsDetails | null = null;
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
      
      if(this.pinCodeIsValid()) {
        this.auth.checkPinCode(<number>this.pinCode, "bartender")
          .subscribe(data => {
              if(this.item?.state === "ON_HOLD")
                this.emitAcceptButtonEvent(data.id);
              else if(data.pinCode !== this.pinCode)
                alert("That order is not yours!");
              else
                this.emitAcceptButtonEvent(data.id);
            }, (err: any) => alert("You are not valid bartender!"));
      }

    });
  }

  pinCodeIsValid(): boolean {
    if(this.pinCode != undefined && this.pinCode >= 1000 && this.pinCode <= 9999)
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
