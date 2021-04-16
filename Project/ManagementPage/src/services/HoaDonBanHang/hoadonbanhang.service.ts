import { HoaDonBanHangModel } from './../../models/HoaDonBanHang/hoadonbanhang';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HoadonbanhangService {

  constructor(private http: HttpClient) { }

  getListHoaDonBanHang(): Observable<HoaDonBanHangModel[]>{
    return this.http.get<HoaDonBanHangModel[]>('http://localhost:3000/hoadonbanhang/thongtin').pipe();
  }

  ThemHoaDonBanHang(hoadonbanhang: HoaDonBanHangModel): Observable<HoaDonBanHangModel[]>{
    return this.http.post<HoaDonBanHangModel[]>('http://localhost:3000/hoadonbanhang/taomoi', hoadonbanhang).pipe();
   }
}
