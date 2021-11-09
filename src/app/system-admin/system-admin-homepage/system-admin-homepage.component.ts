import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { convertResponseError } from 'src/app/error-converter.function';
@Component({
  selector: 'app-system-admin-homepage',
  templateUrl: './system-admin-homepage.component.html',
  styleUrls: ['./system-admin-homepage.component.scss']
})
export class SystemAdminHomepageComponent implements OnInit {
  constructor(private http: HttpClient, private _toastr: ToastrService) {}

  ngOnInit(): void {
  }

  send() : void {
    this.http.get<any>("/unregistered-user").subscribe( (useri) => {
    }, (err) => this._toastr.error(convertResponseError(err), "Don't exist!"))
  }
}
