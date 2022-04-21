import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Rate} from "../model/rate";

@Injectable({
  providedIn: 'root'
})
export class ExchangeApiService {

  constructor(private http: HttpClient) { }

  getRates(from: string, to: string) {
    return this.http.get<Rate>(`https://v6.exchangerate-api.com/v6/6e4db35094bf00a9f249be98/pair/${from}/${to}`);
  }
}
