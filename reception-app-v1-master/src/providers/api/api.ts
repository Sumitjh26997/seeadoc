import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class Api {

  // public url: string = 'http://localhost:3000/api'; //Local Server
  // public url = 'https://appointment-backend.herokuapp.com/api'; // Heroku Server
  public url: string = 'http://13.232.149.183:3000/api'; //AWS Server

  constructor(public http: HttpClient) {
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(this.url + endpoint, reqOpts);
  }

  getByURL(url, params?, reqOpts?) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(url, reqOpts);
  }
  
  address(address) {
    return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}=AIzaSyD4FVRxg8I11XlYstoxqhY8K57HaXgOGJc`);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts)
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts);
  }
}
