import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidatorService } from 'src/app/services/validator.service';
import { ItemCreate } from '../models/item-create.model';
import { ItemService } from 'src/app/services/item.service';
import { ItemCategoryCreate } from '../models/item-category-create.model';
import { ItemCategory } from '../models/item-category.model';
import { convertResponseError } from 'src/app/error-converter.function';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.scss']
})
export class AddItemDialogComponent implements OnInit {
  showCategoryCreateField: boolean = false;
  reader: FileReader;
  areIngredientsOk: boolean = true;
  ingredient: string = '';
  newCategory: string = '';

  categories: ItemCategory[] = [];
  ingredients: Array<string> = ["borownica"];
  iconBase64: string = "";
  selectedFile = null;

  itemForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    itemCategory: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  categoryForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.min(3), Validators.max(30)]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public type: string, public dialogRef: MatDialogRef<AddItemDialogComponent>,
   public validator: ValidatorService, public _toastr: ToastrService, public _itemService: ItemService) { 
    this.validator.setForm(this.itemForm);
    this.reader = new FileReader();
  }

  ngOnInit(): void {
    this._fetchCategories();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void { 
    if (this.itemForm.invalid) {
      return;
    }
    const chosenCategory: ItemCategory = this.categories.filter(c => c.name === this.itemForm.controls["itemCategory"].value)[0];
    const chosenCategoryCreate: ItemCategoryCreate = {
      name: chosenCategory.name,
      type: chosenCategory.type
    }
    const formedItem: ItemCreate = {
      itemCategory: chosenCategoryCreate,
      price: this.itemForm.controls["price"].value,
      name: this.itemForm.controls["name"].value,
      description: this.itemForm.controls["description"].value,
      iconBase64: this.selectedFile,
      components: this.ingredients,
      type: this.type
    }
    this.dialogRef.close(formedItem);
  }

  deleteCategory(id: number, event: any) {
    event.stopPropagation();
    this._itemService.deleteCategory(id).subscribe(
      () => {
        this._toastr.success("Successfully deleted category!", "Deleted")
        this._fetchCategories();
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "Not deleted!")
      }
    );
  }

  showCategoryField(event: any) {
    event.stopPropagation();
    this.showCategoryCreateField = true;
  }

  addCategory() {
    if (this.categoryForm.invalid) {
      return;
    }
    const category: ItemCategoryCreate = {
      name: this.categoryForm.controls["name"].value,
      type: this.type
    }
    this._itemService.createCategory(category).subscribe(
      () => {
        this._toastr.success("Successfully created category!", "Created")
        this._fetchCategories();
        this.showCategoryCreateField = false;
        this.categoryForm.controls["name"].setValue("");
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "Not created!")
      }
    );
  }

  public onFileChanged(event: any): void {
    this.reader.onload = (event: any) => {
      this.selectedFile = event.target.result;
    };
    this.reader.onerror = () => {
      this.selectedFile = null;
    };
    this.reader.readAsDataURL(event.target.files[0]);
  }

  public addIngredient(): void {
    if (this.ingredient === '')
      return;
    if (this.ingredients.includes(this.ingredient)) {
      this.areIngredientsOk = false;
      return;
    }
    this.areIngredientsOk = true;
    this.ingredients.push(this.ingredient);
  }

  private _fetchCategories(): void {
    if (this.type === "DRINK") {
      this._itemService.getCategoriesForDrinks().subscribe(res => this.categories = res);
    } else {
      this._itemService.getCategoriesForDishes().subscribe(res => this.categories = res);
    }
  }
}
