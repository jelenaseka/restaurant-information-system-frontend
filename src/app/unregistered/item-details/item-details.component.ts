import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DrinkItemsDetails } from 'src/app/bartender/bartender-homepage/model/DrinkItemsDetails.model';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {


  @Input()
  item : DrinkItemsDetails | null = null;
  @Output()
  closeEvent = new EventEmitter();

  constructor() { }

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

}
