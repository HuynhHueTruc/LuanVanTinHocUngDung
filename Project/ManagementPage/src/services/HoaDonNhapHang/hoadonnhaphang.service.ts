import { Observable } from 'rxjs';
import { HoaDonNhapHangModel } from './../../models/HoaDonNhapHang/hoadonnhaphang';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HoadonnhaphangService {

  constructor(private http: HttpClient) { }

  getListHoaDonNhapHang(): Observable<HoaDonNhapHangModel[]>{
    return this.http.get<HoaDonNhapHangModel[]>('http://localhost:3000/hoadonnhaphang/thongtin').pipe();
  }

  ThemHoaDonNhapHang(hoadonnhaphang: HoaDonNhapHangModel): Observable<HoaDonNhapHangModel[]>{
    console.log(hoadonnhaphang)
    return this.http.post<HoaDonNhapHangModel[]>('http://localhost:3000/hoadonnhaphang/taomoi', hoadonnhaphang).pipe();
   }
}
