import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DrinkItemsForListBox } from 'src/app/bartender/bartender-homepage/model/drinkitems-for-listbox.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  @Input()
  items : DrinkItemsForListBox[] = [];
  @Input()
  title: string = "";
  @Input()
  indexSelected: number = 0;
  @Output()
  itemClicked : EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onItemClick(itemId : number) : void {
    

    this.itemClicked.emit(itemId);
  }

}
