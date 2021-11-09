import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { DrinkItemsForListBox } from 'src/app/bartender/bartender-homepage/model/drinkitems-for-listbox.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  @Input()
  item: DrinkItemsForListBox | undefined;
  @Input()
  indexSelected: number | undefined;
  @Output()
  itemClicked : EventEmitter<number> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  getItemName() : string {
    if(!this.item)
      return "";
    let array : string[] = this.item.name.split(",");
    if(array.length > 1)
      return array[0]+",...";
    return this.item.name;
  }

  onItemClick() : void {
    if(this.item)
      this.itemClicked.emit(this.item.id);
  }

  amISelected() : boolean {
    if(!this.item || !this.indexSelected)
      return false;
    return this.item.id === this.indexSelected;
  }

}
