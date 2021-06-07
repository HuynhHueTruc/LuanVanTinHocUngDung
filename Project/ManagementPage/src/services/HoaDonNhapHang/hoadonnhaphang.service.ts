import { Observable, Subject } from 'rxjs';
import { HoaDonNhapHangModel } from './../../models/HoaDonNhapHang/hoadonnhaphang';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HoadonnhaphangService {

  
  private refreshPage = new Subject<void>();

  constructor(private http: HttpClient) { }

  getRefeshPage() {
    return this.refreshPage;
  }

  getListHoaDonNhapHang(): Observable<HoaDonNhapHangModel[]>{
    return this.http.get<HoaDonNhapHangModel[]>('http://localhost:3000/hoadonnhaphang/thongtin').pipe();
  }

  ThemHoaDonNhapHang(hoadonnhaphang: HoaDonNhapHangModel): Observable<HoaDonNhapHangModel[]>{
    return this.http.post<HoaDonNhapHangModel[]>('http://localhost:3000/hoadonnhaphang/taomoi', hoadonnhaphang).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }
}
