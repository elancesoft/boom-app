import {Component, Input} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">

      <h4 class="modal-title">
        <img *ngIf="type=='autoSuccess'" src='../../assets/images/confirm.png' width="30">
        {{type == 'autoSuccess' ? '&nbsp;Quote Request Received!' : type}}
      </h4>
      <button mdbBtn type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p *ngIf="type!=='autoSuccess'">{{name}}</p>
      <p *ngIf="type=='autoSuccess'" style="text-align: center;margin-bottom: 0px;">Thank you! We will send you bundled
        rates as well!</p>
      <p *ngIf="type=='autoSuccess'" style="text-align: center;margin-bottom: 0px;">Please give us a call if you have
        any questions.</p>
    </div>
    <div class="modal-footer">
      <button mdbBtn type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close
      </button>
    </div>
  `,
  styles: ['.modal-content{top:70px !important;} .close{color: black !important;box-shadow: none !important; font-size:20px !important}' +
  '@media screen and (max-width: 768px){.modal-title{font-size: 25px !important}}']
})
export class NgbdModalContent {
  @Input() name;
  @Input() type;

  constructor(public activeModal: NgbActiveModal) {
  };
}

/*comment*/
