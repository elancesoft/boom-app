import {Component, OnDestroy, OnInit} from '@angular/core';
import {OlarkService} from "../services/olark.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [OlarkService]
})
export class ChatComponent implements OnInit, OnDestroy {
  constructor(public olark: OlarkService) {
  }

  ngOnInit() {
    this.setUpOlark();
  }

  ngOnDestroy(): void {
    this.olark.hide();
  }

  async setUpOlark() {
    await this.olark.load(window, document, "static.olark.com/jsclient/loader.js");
    this.olark.identify('4797-648-10-9515');
    this.olark.hide();
  };
}
