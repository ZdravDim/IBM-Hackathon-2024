import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private url = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getChatMessage(requestMessage: string): Promise<any> {
    return firstValueFrom(this.http.post(`${this.url}/chat`, { requestMessage: requestMessage }));
  }

}
