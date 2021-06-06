import { HoaDonBanHangModel } from './../../models/HoaDonBanHang/hoadonbanhang';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HoadonbanhangService {


  private refreshPage = new Subject<void>();

  constructor(private http: HttpClient) { }

  getRefeshPage() {
    return this.refreshPage;
  }

  getListHoaDonBanHang(): Observable<HoaDonBanHangModel[]>{
    return this.http.get<HoaDonBanHangModel[]>('http://localhost:3000/hoadonbanhang/thongtin').pipe();
  }

  ThemHoaDonBanHang(hoadonbanhang: HoaDonBanHangModel): Observable<HoaDonBanHangModel[]>{
    return this.http.post<HoaDonBanHangModel[]>('http://localhost:3000/hoadonbanhang/taomoi', hoadonbanhang).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }
}
