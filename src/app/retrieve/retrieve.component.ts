import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../services/api-service";
import {LocalStorageService} from "angular-web-storage";
import {Router} from "@angular/router";
import {NgbdModalContent} from "../home/ngbd.modal.content";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-retrieve',
  templateUrl: './retrieve.component.html',
  styleUrls: ['./retrieve.component.scss']
})
export class RetrieveComponent implements OnInit {
  QuoteForm: FormGroup;
  quote: string;
  shwoDetailsBoard: boolean = false;
  data: object;

  constructor(private apiService: ApiService, public local: LocalStorageService, private router: Router, private modalService: NgbModal) {
  }

  Modalopen(type, text) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = text;
    modalRef.componentInstance.type = type;
  }

  validateQuoteForm() {
    let formData = {
        "quoteInput":
          new FormControl(this.quote, Validators.required),
      }
    ;
    this.QuoteForm = new FormGroup(formData);
  }

  get quoteInput() {
    return this.QuoteForm.get('quoteInput');
  }

  ngOnInit() {
    this.validateQuoteForm();
  }
  getQuoteData() {
    let data = {uniqueId: this.quote.trim()};
    this.apiService.getQuoteData(data).subscribe(res => {
      if (res['result'] == 'success' && res['data'].length != 0) {
        // this.shwoDetailsBoard = true;
        this.data = res['data'][0];
        this.router.navigate(['/esign', {
          policy_number: this.data['policy_number'],
          start_date: this.data['policy_start_date'],
          first_name:this.data['first_name'],
          quote_id:this.data['quote_id'],
          bind_now:this.data['bind_now'],
          policy_doc_url:this.data['policy_document_url']
        }])
      } else {
        this.Modalopen('Error', 'Data is not exists.');
      }
    }, (err) => {

        this.Modalopen('Error', 'An error occured.');
    });
  }
}
