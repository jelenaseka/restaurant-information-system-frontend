import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DrinkItems } from 'src/app/bartender/bartender-homepage/model/DrinkItems.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {

  @Input()
  items : DrinkItems[] = [];
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
