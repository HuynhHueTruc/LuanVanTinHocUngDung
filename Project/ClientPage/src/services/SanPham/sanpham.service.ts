import { DanhGiaModel } from './../../models/SanPham/danhgia';
import { SanPhamModel } from './../../models/SanPham/sanpham';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SanphamService {

  private refreshPage = new Subject<void>();

  constructor(private http: HttpClient) { }

  getRefeshPage() {
    return this.refreshPage;
  }
  getListSanPham(): Observable<SanPhamModel[]>{
    return this.http.get<SanPhamModel[]>('http://localhost:3000/sanpham/thongtin').pipe();
  }

  DanhGiaSanPham(danhgia, Khach_hang_id, flag): Observable<DanhGiaModel[]>{
    return this.http.post<DanhGiaModel[]>('http://localhost:3000/sanpham/danhgiasanpham', {danhgia, Khach_hang_id, flag})  .pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }
}
