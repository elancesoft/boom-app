import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {ModalDirective} from "ng-uikit-pro-standard";
import {CommonService} from "../../services/common.service";
import {ApiService} from "../../services/api-service";

import {BatchService} from "../../services/batch.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})

export class UserDetailsComponent implements OnInit {
  currentUser = null;
  message = '';

  constructor(private commonService: CommonService,
              private apiService: ApiService,
              private batchService: BatchService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.message = '';
    this.getUser(this.route.snapshot.paramMap.get('id'));
  }

  getUser (id) {
    this.batchService.get(id).subscribe(
      data => {
        this.currentUser = data;
        console.log (data);
      },
      error => {
        console.log (error);
      }
    )
  }

  updatePublished(status) {
    const data = {
      user_email: this.currentUser.user_email,
      code: this.currentUser.code
    };
  }

  updateUser() {
    this.batchService.update(this.currentUser.id, this.currentUser).subscribe(
      response => {
        this.message = "The user was updated successfully!";
        console.log (response);
      },
      error => {
        console.log (error);
      }
    )
  }

  deleteUser() {
    this.batchService.delete(this.currentUser.id).subscribe(
      response => {
        this.router.navigate(['/users'])
        console.log (response);
      },
      error => {
        console.log (error);
      }
    )
  }
}
