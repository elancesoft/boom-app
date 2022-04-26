import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {BatchService} from "../../services/batch.service";

@Component({
  selector: 'app-add-code-page',
  templateUrl: './add-code-page.component.html',
  styleUrls: ['./add-code-page.component.scss']
})

export class AddCodePageComponent implements OnInit {
  user = {
    user_email: '',
    code: ''
  };
  submitted = false;

  constructor(private batchService: BatchService) {
  }

  saveUser() {
    const data = {
      user_email: this.user.user_email,
      code: this.user.code
    };
    
    this.batchService.create(data).subscribe(
      response => {
        console.log (response);
        this.submitted = true;
      },
      error => {
        console.log(error);
      }
    )
  }

  newUser() {
    this.submitted = false;
    this.user = {
      user_email: '',
      code: ''
    }
  }

  ngOnInit() {
  }
}
