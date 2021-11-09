import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
@NgModule({
  exports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatListModule, MatDialogModule],
})
export class MaterialModule {}
