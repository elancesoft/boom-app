import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';

// const apiUrl = 'https://boom.insure/api/';
// const apiUrl = "http://167.114.199.234:5000"
//const apiUrl = "http://54.80.33.127"
const apiUrl = "http://34.235.160.8"
// const apiUrl = 'http://localhost:3000/api/';

@Injectable({
  providedIn: 'root'
})

export class BatchService {
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get(apiUrl + 'user');
  }

  get(id) {
    return this.http.get(`${apiUrl}user/${id}`);
  }

  create(data) {
    return this.http.post(apiUrl + 'user', data);
  }

  update(id, data) {
    return this.http.put(`${apiUrl}user/${id}`, data);
  }

  delete(id) {
    return this.http.delete(`${apiUrl}user/${id}`);
  }

  deleteAll() {
    return this.http.delete(apiUrl + 'user');
  }

  findByCode(code) {
    return this.http.get(`${apiUrl}user?code=${code}`);
  }

  findAllByCode(code) {
    return this.http.get(`${apiUrl}user/code/${code}`);
  }

  //--------------- bulk emails----------------

  bulk_getAll() {
    return this.http.get(apiUrl + 'bulk');
  }

  bulk_get(id) {
    return this.http.get(`${apiUrl}bulk/${id}`);
  }

  bulk_create(data) {
    return this.http.post(apiUrl + 'bulk', data);
  }

  bulk_update(id, data) {
    return this.http.put(`${apiUrl}bulk/${id}`, data);
  }

  bulk_delete(id) {
    return this.http.delete(`${apiUrl}bulk/${id}`);
  }

  bulk_deleteAll() {
    return this.http.delete(apiUrl + 'bulk');
  }

  bulk_findByEmail(code) {
    return this.http.get(`${apiUrl}bulk?code=${code}`);
  }

  bulk_findAllByCode(code) {
    return this.http.get(`${apiUrl}bulk/code/${code}`);
  }

}
