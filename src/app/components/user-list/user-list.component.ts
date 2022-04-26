import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {ModalDirective} from "ng-uikit-pro-standard";
import {CommonService} from "../../services/common.service";
import {ApiService} from "../../services/api-service";

import {BatchService} from "../../services/batch.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {
  users: any;
  currentUser = null;
  currentIndex = -1;
  code = '';

  constructor(private commonService: CommonService, private apiService: ApiService, private batchService: BatchService) {
  }

  ngOnInit() {
    this.retrieveUsers();
  }

  retrieveUsers () {
    this.batchService.getAll().subscribe(
      data => {
        this.users = data;
        console.log (data);
      },
      error => {
        console.log (error);
      }
    )
  }

  refreshList() {
    this.retrieveUsers();
    this.currentUser = null;
    this.currentIndex = -1;
  }

  setActiveUser(user, index) {
    this.currentUser = user;
    this.currentIndex = index;
  }

  removeAllUser() {
    this.batchService.deleteAll().subscribe(
      response => {
        console.log (response);
        this.retrieveUsers();
      },
      error => {
        console.log (error);
      }
    )
  }

  searchCode () {
    this.batchService.findAllByCode(this.code).subscribe(
      data=> {
        let result = [];
        result.push(data);

        this.users = result;
        console.log (data);
      },
      error => {
        console.log(error);
      }
    )
  }

}
