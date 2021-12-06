import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/autentification/services/auth.service';
import { JwtDecoderService } from 'src/app/autentification/services/jwt-decoder.service';
import { PincodeDialogComponent } from 'src/app/unregistered/pincode-dialog/pincode-dialog.component';

@Component({
  selector: 'app-waiter-homepage',
  templateUrl: './waiter-homepage.component.html',
  styleUrls: ['./waiter-homepage.component.scss']
})
export class WaiterHomepageComponent implements OnInit {
  pinCode: string | undefined;
  table: string = 'T1';

  constructor() { }

  ngOnInit(): void {
  }

}
