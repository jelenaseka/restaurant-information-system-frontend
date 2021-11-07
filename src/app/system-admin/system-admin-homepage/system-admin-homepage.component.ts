import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-system-admin-homepage',
  templateUrl: './system-admin-homepage.component.html',
  styleUrls: ['./system-admin-homepage.component.scss']
})
export class SystemAdminHomepageComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }

  send() : void {
    this.http.get<any>("/unregistered-user").subscribe( (useri) => {
      console.log(useri)
    });
  }
}
