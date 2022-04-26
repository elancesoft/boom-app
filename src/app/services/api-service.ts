import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError, map, timeout } from "rxjs/operators";
import { environment } from "../../environments/environment";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(public http: HttpClient) { }

  private static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }

  private static extractData(res: Response) {
    return res || {};
  }

  getZillow(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_zillow", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  bindNow(data): Observable<any> {
    return this.http.get(environment.baseUrl + "/api/bind_now/" + data["uniqueId"], httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  saveUserData(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/save_user_data", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  addCarData(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/add_car_data", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  saveMortgage(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/save_mortgage", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  getQuoteData(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_quote_data", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  bundleAuto(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/bundle_auto", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  checkValid(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/check_valid", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }
  getWeatherData(url): Observable<any> {
    return this.http.get(url, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  sendDemoEmail(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/send_demo_email", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  sendDetailsEmail(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/send_details_email", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  getPdfLink(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_pdf_link", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  getPlymouthData(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_plymouth_pricing", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }
  getPlymouthDataDemo(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_plymouth_pricing_demo", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  getStillwaterData(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_stillwater_pricing", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  getStillwaterDemoData(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_stillwater_pricing_demo", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  getUniversalData(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_universal_pricing", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }


  getUniversalDataDemo(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_universal_pricing_demo", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  getNeptuneData(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_neptuneflood", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  getHippoData(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_hippo", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }
  getHavenLife(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_havenlife", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }
  getPdfDownloaded(data): Observable<any> {
    let headers = new HttpHeaders();
    return this.http.post(environment.baseUrl + "/api/downlod_pdf", data, { headers: headers, responseType: "blob" });
  }

  sendMail(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/send_mail", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  sendSelectedBuyMail(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/send_selected_buy_mail", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  getNationWideData(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_nationwide", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  getNationWideDataDemo(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_nationwide_demo", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  sendSearchAddressEmail(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/send_search_address_email", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  sendCarInfoEmail(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/send_car_info_email", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }
  sendMortgageEmail(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/send_mortgage_email", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

  sendCompleteInfoMail(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/send_complete_info_mail", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }


  
  getOurBranch(data): Observable<any> {
    return this.http.post(environment.baseUrl + "/api/get_ourbranch", data, httpOptions).pipe(map(ApiService.extractData), catchError(ApiService.handleError));
  }

}

/*comment*/
