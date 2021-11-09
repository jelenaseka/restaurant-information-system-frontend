import { Component, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';
import { DrinkItems } from './model/DrinkItems.model';
import { DrinkItemsDetails } from './model/DrinkItemsDetails.model';

@Component({
  selector: 'app-bartender-homepage',
  templateUrl: './bartender-homepage.component.html',
  styleUrls: ['./bartender-homepage.component.scss']
})
export class BartenderHomepageComponent implements OnInit {

  detailsAreDisplayed : boolean = false;
  items : DrinkItems[] = [];
  displayedItem : DrinkItemsDetails | null = null;
  indexOfSelectedItem : number = 0;

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.itemService.getActiveItems()
      .subscribe(data => {
        this.items = data
      }, (err: any) => console.log(err));
  }

  getFilteredItems(filter : string) : DrinkItems[] {
    return this.items.filter(item => item.state === filter);
  }

  onAcceptButtonEvent(userId : number) : void {
    this.indexOfSelectedItem = 0;
    this.detailsAreDisplayed = false;
    this.itemService.moveItem(<number>this.displayedItem?.id, userId)
      .subscribe(data => {
        let list = this.items.filter(item => item.id !== data.id);
        this.items = [...list, data]
      }, (err: any) => console.log(err));
  }

  onCloseEvent() : void {
    this.indexOfSelectedItem = 0;
    this.detailsAreDisplayed = false;
  }

  onItemClicked(itemId : number) : void {
    this.itemService.getItem(itemId)
      .subscribe(data => {
        this.displayedItem = data;
        this.detailsAreDisplayed = true;
        this.indexOfSelectedItem = data.id;
      }, (err: any) => console.log(err));
  }

}
