import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-system-admin-homepage',
  templateUrl: './system-admin-homepage.component.html',
  styleUrls: ['./system-admin-homepage.component.scss']
})
export class SystemAdminHomepageComponent implements OnInit {
  private _loginUrl = 'http://localhost:8080/api/unregistered-user';
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }

  send() {
    this.http.get<any>(this._loginUrl).subscribe( (useri) => {
      console.log(useri)
    });
  }
}
