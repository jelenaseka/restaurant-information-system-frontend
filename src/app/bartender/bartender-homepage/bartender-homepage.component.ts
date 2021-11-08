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

  getOnHoldItems() : DrinkItems[] {
    return this.items.filter(item => item.state === "ON_HOLD");
  }

  getPreparationItems() : DrinkItems[] {
    return this.items.filter(item => item.state === "PREPARATION");
  }

  getReadyItems() : DrinkItems[] {
    return this.items.filter(item => item.state === "READY");
  }

  onCloseEvent() : void {
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
