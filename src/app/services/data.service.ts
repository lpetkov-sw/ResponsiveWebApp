import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/photos';
  
  constructor(private _http: HttpClient) {}

  loadData() {
    return this._http.get(this.apiUrl);
  }
}
