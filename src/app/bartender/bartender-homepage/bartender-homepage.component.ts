import { Component, OnInit } from '@angular/core';
import { DrinkItemsService } from '../services/drink-items.service';
import { DrinkItemsForListBox } from './model/drinkitems-for-listbox.model';
import { DrinkItemsDetails } from './model/drinkitems-details.model';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';

@Component({
  selector: 'app-bartender-homepage',
  templateUrl: './bartender-homepage.component.html',
  styleUrls: ['./bartender-homepage.component.scss']
})
export class BartenderHomepageComponent implements OnInit {

  detailsAreDisplayed : boolean = false;
  items : DrinkItemsForListBox[] = [];
  displayedItem : DrinkItemsDetails | undefined;
  indexOfSelectedItem : number = 0;

  constructor(private itemService: DrinkItemsService, private toastService: ToastrService) { }

  ngOnInit(): void {
    this.itemService.getActiveItems()
      .subscribe(data => {
        this.items = data
      }, (err: any) => this.toastService.error(convertResponseError(err), "Don't exist!"));
  }

  getFilteredItems(filter : string) : DrinkItemsForListBox[] {
    return this.items.filter(item => item.state === filter);
  }

  onAcceptButtonEvent(userId : number) : void {
    this.indexOfSelectedItem = 0;
    this.detailsAreDisplayed = false;
    this.itemService.moveItem(<number>this.displayedItem?.id, userId)
      .subscribe(data => {
        let list = this.items.filter(item => item.id !== data.id);
        this.items = [...list, data];
        this.toastService.success("Drink item has changed state!", 'Updated');
      }, (err: any) => this.toastService.error(convertResponseError(err), "Don't exist!"));
  }

  onCloseEvent() : void {
    this.indexOfSelectedItem = 0;
    this.detailsAreDisplayed = false;
  }

  onItemClicked(itemId : number) : void {
    this.itemService.getItem(itemId)
      .subscribe(data => {
        this.displayedItem = data;
        this.indexOfSelectedItem = data.id;
        this.detailsAreDisplayed = true;
      }, (err: any) => this.toastService.error(convertResponseError(err), "Don't exist!"));
  }

}