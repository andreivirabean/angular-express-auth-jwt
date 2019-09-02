import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DashboardService {
  private _booksUrl = 'http://localhost:3000/api/books';
  private _bookRequestsUrl = 'http://localhost:3000/api/bookRequests';

  constructor(private http: HttpClient) { }

  getBooks() {
    return this.http.get<any>(this._booksUrl);
  }

  getBookRequests() {
    return this.http.get<any>(this._bookRequestsUrl);
  }

}
