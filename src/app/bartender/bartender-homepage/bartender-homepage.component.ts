import { Component, OnInit } from '@angular/core';
import { DrinkItemsService } from '../services/drink-items.service';
import { ItemsForListBox } from './model/items-for-listbox.model';
import { DrinkItemsDetails } from './model/drinkitems-details.model';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { SocketService } from 'src/app/sockets/socket.service';

@Component({
  selector: 'app-bartender-homepage',
  templateUrl: './bartender-homepage.component.html',
  styleUrls: ['./bartender-homepage.component.scss']
})
export class BartenderHomepageComponent implements OnInit {

  detailsAreDisplayed : boolean = false;
  items : ItemsForListBox[] = [];
  displayedItem : DrinkItemsDetails | undefined;
  indexOfSelectedItem : number = 0;

  constructor(private itemService: DrinkItemsService, private toastService: ToastrService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.itemService.getActiveItems()
      .subscribe(data => {
        this.items = data
      }, (err: any) => this.toastService.error(convertResponseError(err), "Don't exist!"));
    this.socketService.connect("drink-items", this.handleChange);
  }

  getFilteredItems(filter : string) : ItemsForListBox[] {
    return this.items.filter(item => item.state === filter);
  }

  handleChange = (data) => {
    let list = this.items.filter(item => item.id !== data.id);
    this.items = [...list, data];
    this.toastService.success("Drink item has changed state!", 'Updated');
  }

  onAcceptButtonEvent(userId : number) : void {
    this.indexOfSelectedItem = 0;
    this.detailsAreDisplayed = false;
    let data = {
      itemId: <number>this.displayedItem?.id,
      userId
    }
    this.socketService.sendMessage("/drink-items/change-state", JSON.stringify(data))
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
