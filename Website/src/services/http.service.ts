import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private url = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getChatMessage(requestMessage: string): Promise<any> {
    return firstValueFrom(
      this.http.post(`${this.url}/chat`, { requestMessage: requestMessage }).pipe(
        map((response: any) => {
          if (response.status < 200 || response.status >= 300) {
            throw new Error(`Request failed with status code ${response.status}`);
          }
          return response;
        }),
        catchError((error) => {
          return throwError(() => new Error(`Error: ${error.message}`));
        })
      )
    );
  }

  getSummarizationMessage(formData: FormData): Promise<any> {
    return firstValueFrom(
      this.http.post(`${this.url}/summarization`, formData).pipe(
        map((response: any) => {
          if (response.status < 200 || response.status >= 300) {
            throw new Error(`Request failed with status code ${response.status}`);
          }
          return response;
        }),
        catchError((error) => {
          return throwError(() => new Error(`Error: ${error.message}`));
        })
      )
    );
  }

}
