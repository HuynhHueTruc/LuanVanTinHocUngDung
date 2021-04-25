import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HoadonbanhangService {

  constructor(private http: HttpClient) { }

  getListHoaDonBan(): Observable<HoadonbanhangService[]>{
    return this.http.get<HoadonbanhangService[]>('http://localhost:3000/hoadonbanhang/thongtin').pipe();
  }

}
