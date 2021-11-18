import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { DishItemService } from '../services/dish-item.service';
import { DishItemDetails } from './model/dishitem-details.model';
import { ItemsForListBox } from 'src/app/bartender/bartender-homepage/model/items-for-listbox.model';
import { SocketService } from 'src/app/sockets/socket.service';
import { SocketResponse } from 'src/app/sockets/model/socket-response.model';

@Component({
  selector: 'app-chef-homepage',
  templateUrl: './chef-homepage.component.html',
  styleUrls: ['./chef-homepage.component.scss']
})
export class ChefHomepageComponent implements OnInit {

  detailsAreDisplayed : boolean = false;
  items : ItemsForListBox[] = [];
  displayedItem : DishItemDetails | undefined;
  indexOfSelectedItem : number = 0;

  iSentRequest : boolean = false;

  constructor(private itemService: DishItemService, private toastService: ToastrService, private socketService: SocketService) { }

  ngOnInit(): void {
    this.getAllActiveItems();
    this.socketService.connect("dish-item", this.handleChange);
  }

  getAllActiveItems() : void {
    this.itemService.getActiveItems()
    .subscribe(data => {
      this.items = data
    }, (err: any) => this.toastService.error(convertResponseError(err), "Don't exist!"));
  }

  getFilteredItems(filter : string) : ItemsForListBox[] {
    return this.items.filter(item => item.state === filter);
  }

  handleChange = (data : SocketResponse) => {
    if(data.successfullyFinished) {
      this.getAllActiveItems();
      if(this.iSentRequest) {
        this.toastService.success(data.message, 'Ok')
      }
    } else {
      if(this.iSentRequest) {
        this.toastService.error(data.message, "Error")
      }
    }
    this.iSentRequest = false;
  }

  onAcceptButtonEvent(userId : number) : void {
    this.indexOfSelectedItem = 0;
    this.detailsAreDisplayed = false;
    // this.itemService.moveItem(<number>this.displayedItem?.id, userId)
    //   .subscribe(data => {
    //     let list = this.items.filter(item => item.id !== data.id);
    //     this.items = [...list, data];
    //     this.toastService.success("Dish item has changed state!", 'Updated');
    //   }, (err: any) => this.toastService.error(convertResponseError(err), "Don't exist!"));
    let data = {
      itemId: <number>this.displayedItem?.id,
      userId
    }
    this.iSentRequest = true;
    this.socketService.sendMessage("/dish-item/change-state", JSON.stringify(data))
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
