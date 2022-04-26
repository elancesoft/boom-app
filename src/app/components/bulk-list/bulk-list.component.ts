import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {ApiService} from "../../services/api-service";
import {BatchService} from "../../services/batch.service";

@Component({
  selector: 'app-bulk-list',
  templateUrl: './bulk-list.component.html',
  styleUrls: ['./bulk-list.component.scss']
})

export class BulkListComponent implements OnInit {
  @Input('user_email') public user_email: string;
  @Input('code') public code: string;

  bulks: any;
  filtered_bulks: any;
  currentUser = null;
  currentIndex = -1;

  headElements = ['address', 'code', 'cc', 'createdAt', 'id', 'phone', 'sendto', 'updatedAt', 'user_email'];
  is_ytd: boolean = true;
  is_2019: boolean = false;
  is_2018: boolean = false;
  no_data: boolean = false;

  constructor(private commonService: CommonService, private apiService: ApiService, private batchService: BatchService) {
  }

  ngOnInit() {
    this.retrieveBulks();
  }


  retrieveBulks () {
    this.batchService.bulk_findAllByCode(this.code).subscribe(
      data => {
        this.bulks = data;
        this.filtered_bulks = this.bulks;
        console.log (data);
      },
      error => {
        console.log (error);
      }
    )
  }

  removeAllUser() {
    this.batchService.deleteAll().subscribe(
      response => {
        console.log (response);
        this.retrieveBulks();
      },
      error => {
        console.log (error);
      }
    )
  }

  ytdClicked() {
    this.is_ytd = true;
    this.is_2019 = false;
    this.is_2018 = false;

    this.filtered_bulks = this.bulks;
    this.updateInfo();
  }

  Clicked2019() {
    this.is_ytd = false;
    this.is_2019 = true;
    this.is_2018 = false;

    this.filtered_bulks = [];
    if (this.bulks !== undefined) {
      for (let i = 0; i < this.bulks.length; i++) {
        let createdAt = new Date(this.bulks[i].createdAt);
        if (createdAt.getFullYear() == 2019) {
          this.filtered_bulks.push(this.bulks[i]);
        }
      }
    }
    this.updateInfo();
  }

  Clicked2018() {
    this.is_ytd = false;
    this.is_2019 = false;
    this.is_2018 = true;

    this.filtered_bulks = [];
    if (this.bulks !== undefined) {
      for (let i = 0; i < this.bulks.length; i++) {
        let createdAt = new Date(this.bulks[i].createdAt);
        if (createdAt.getFullYear() == 2018) {
          this.filtered_bulks.push(this.bulks[i]);
        }
      }
    }
    this.updateInfo();
  }

  updateInfo () {
    if (this.filtered_bulks.length == 0) {
      this.no_data = true;
    }
  }
}
