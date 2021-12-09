import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ValidatorService } from 'src/app/services/validator.service';
import { ItemCreate } from '../models/item-create.model';
import { ItemService } from 'src/app/services/item.service';
import { ItemCategoryCreate } from '../models/item-category-create.model';
import { ItemCategory } from '../models/item-category.model';
import { convertResponseError } from 'src/app/error-converter.function';
import { UserIdAndType } from '../models/user-id-and-type.model';
import { ItemDetails } from '../models/item-details.model';
import { ItemUpdate } from '../models/item-update.model';

@Component({
  selector: 'app-menu-item-dialog',
  templateUrl: './menu-item-dialog.component.html',
  styleUrls: ['./menu-item-dialog.component.scss']
})
export class MenuItemDialogComponent implements OnInit {
  showCategoryCreateField: boolean = false;
  reader: FileReader;
  newCategory: string = '';
  selectedFile: string | null = null;
  itemDetails: ItemDetails | null = null;

  categories: ItemCategory[] = [];
  ingredients: Array<string> = [];
  iconBase64: string | null = "";

  itemForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    itemCategory: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  categoryForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.min(3), Validators.max(30)]),
  });

  ingredientForm: FormGroup = new FormGroup({
    ingredient: new FormControl('', [Validators.required]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: UserIdAndType, public dialogRef: MatDialogRef<MenuItemDialogComponent>,
   public validatorItem: ValidatorService, public _toastr: ToastrService, public _itemService: ItemService) { 
    this.validatorItem.setForm(this.itemForm);
    this.reader = new FileReader();
    if (data.id != 0) {
      this._fetchItemDetails();
    }
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
    let formedItem: ItemCreate | ItemUpdate;
    if (this.itemDetails == null) {
      formedItem = {
        itemCategory: chosenCategoryCreate,
        price: this.itemForm.controls["price"].value,
        name: this.itemForm.controls["name"].value,
        description: this.itemForm.controls["description"].value,
        iconBase64: this.selectedFile,
        components: this.ingredients,
        type: this.data.type
      }
    } else {
      formedItem = {
        itemCategory: chosenCategoryCreate,
        price: this.itemForm.controls["price"].value,
        name: this.itemForm.controls["name"].value,
        description: this.itemForm.controls["description"].value,
        iconBase64: this.selectedFile,
        components: this.ingredients,
        type: this.itemDetails.type,
        code: this.itemDetails.code
      }
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
    const category: ItemCategoryCreate = {
      name: this.categoryForm.controls["name"].value,
      type: this.data.type
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
      if (!event.target.result.startsWith('data:image')) {
        this._toastr.warning("Allowed files are images!");
        return;
      }
      this.selectedFile = event.target.result;
    };
    this.reader.onerror = () => {
      this.selectedFile = null;
    };
    this.reader.readAsDataURL(event.target.files[0]);
  }

  public addIngredient(): void {
    if (this.ingredientForm.invalid)
      return;
    let ing = this.ingredientForm.controls["ingredient"].value;
    if (this.ingredients.includes(ing)) {
      this._toastr.warning(`Ingredient ${ing} already contained in list.`, "Warning!")
      return;
    }
    this.ingredients.push(ing);
    this.ingredientForm.controls['ingredient'].setValue('');
  }

  public deleteIngredient(ing: string): void {
    this.ingredients = this.ingredients.filter(i => i !== ing);
  }

  public formatDate(createdAt: string) {
    try {
      let mainParts: string[] = createdAt.split('T');
      let dateParts: string[] = mainParts[0].split('-');
      let timeParts: string[] = mainParts[1].split(':');
      return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}. ${timeParts[0]}:${timeParts[1]}`;
    } catch(ex) {
      return createdAt;
    }
  }

  private _fetchCategories(): void {
    if (this.data.type === "DRINK") {
      this._itemService.getCategoriesForDrinks().subscribe(res => this.categories = res);
    } else {
      this._itemService.getCategoriesForDishes().subscribe(res => this.categories = res);
    }
  }

  private _fetchItemDetails(): void {
    this._itemService.getItemDetails(this.data.id).subscribe(
      (res) => {
        this.itemDetails = res;
        this._setupComponentsUsingModel();
      },
      (err) => {
        this._toastr.error(convertResponseError(err), "Don't exist!");
        this.dialogRef.close();
      }
    );
  }

  private _setupComponentsUsingModel(): void {
    if (this.itemDetails != null) {
      this.itemForm.patchValue(this.itemDetails);
      this.itemForm.controls["itemCategory"].setValue(this.itemDetails.itemCategory.name);
      this.selectedFile = this.itemDetails.iconBase64;
      let lastPrice = this.itemDetails.prices[this.itemDetails.prices.length - 1].value;
      this.itemForm.controls["price"].setValue(lastPrice);
      this.itemDetails.components.forEach(ing => {
        this.ingredients.push(ing);
      });
    }
  }
}
