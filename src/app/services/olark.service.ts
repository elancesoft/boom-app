import {Injectable} from '@angular/core';
import {CommonService} from "./common.service";

declare var olark;

@Injectable({
  providedIn: 'root'
})
export class OlarkService {

  constructor(private commonService: CommonService) {

  }

  load(o, l, a, r?, k?, y?) {
    // debugger;
    if (o.olark){
      // olark('api.box.onShrink', () => this.hide());
      olark.configure('box.inline', true);
      olark.configure('box.start_hidden', true);
      olark('api.chat.onReady', () => {
        if (!this.commonService.isMobileMode()) {
          document.getElementById('olark-box-container').style.border = 'solid 1px #edecec';
          document.querySelector('.chat-container .loader').remove();
        }
      });
      olark.configure('box.start_hidden', true);
      if (this.commonService.isMobileMode()) olark('api.box.onShrink', () => this.hide());
    }else{
      r = "script";
      y = l.createElement(r);
      r = l.getElementsByTagName(r)[0];
      y.async = 1;
      y.src = "//" + "static.olark.com/jsclient/loader.js";
      r.parentNode.insertBefore(y, r);
      y = o.olark = function () {
        k.s.push(arguments);
        k.t.push(+new Date)
      };
      y.extend = function (i, j) {
        y("extend", i, j)
      };
      y.identify = function (i) {
        y("identify", k.i = i)
      };
      y.configure = function (i, j) {
        y("configure", i, j);
        k.c[i] = j
      };

      k = y._ = {s: [], t: [+new Date], c: {}, l: a};
      new Promise((resolve) => {
        resolve({status: 200});
      });
    }


  }

  identify(id) {
    olark.identify(id);
  }

  configure(key, value) {
    olark.configure(key, value);
  }

  hide() {
    olark('api.box.hide');
  }

  expand() {
    olark('api.box.expand');
  }

  show() {
    olark('api.box.show');
    olark('api.box.expand');
  }
}
