import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { DrinkItems } from 'src/app/bartender/bartender-homepage/model/DrinkItems.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  @Input()
  item: DrinkItems | null = null;
  @Input()
  indexSelected: number = 0;
  constructor() { }

  @Output()
  itemClicked : EventEmitter<number> = new EventEmitter();

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
    this.itemClicked.emit(this.item?.id);
  }

  amISelected() : boolean {
    if(!this.item)
      return false;
    return this.item.id === this.indexSelected;
  }

}
