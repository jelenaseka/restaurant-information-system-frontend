import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
import { ItemService } from 'src/app/services/item.service';
import { MenuItem } from '../models/menu-item.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dishItems: MenuItem[] = [];
  drinkItems: MenuItem[] = [];
  constructor(private _itemService: ItemService, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this._fetchItems();
  }

  public deleteItem(id: number) {
    this._itemService.deleteItem(id).subscribe(
      () => {
        this._toastr.success("You have to save changes to perform it permanently!", "Deleted")
        this._fetchItems();
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "Not deleted!")
      }
    );
  }

  public discardChanges() {
    this._itemService.discardChanges().subscribe(
      () => {
        this._toastr.success("", "Discared")
        this._fetchItems();
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "Not discarded!")
      }
    );
  }

  public saveChanges() {
    this._itemService.saveChanges().subscribe(
      () => {
        this._toastr.success("", "Saved")
        this._fetchItems();
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "Not saved!")
      }
    );
  }

  private _fetchItems(): void {
    this._itemService.getItemsForMenu().subscribe(
      (res) => {
        this.dishItems = res.filter(item => item.itemType === "dish");
        this.drinkItems = res.filter(item => item.itemType === "drink");
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "No recorded data!")
      }
    );
  }
}
