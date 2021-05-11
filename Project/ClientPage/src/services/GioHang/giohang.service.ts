import { GioHangModel } from './../../models/GioHang/giohang';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GiohangService {


  arrSP = (sessionStorage.getItem('arrSanPhamThanhToan') || null);
  data: any;
  constructor(private http: HttpClient) { }

  private refreshPage = new Subject<void>();


  setArrSP(arrSanPham) {
    this.arrSP = arrSanPham;
    sessionStorage.setItem('arrSanPhamThanhToan', JSON.stringify(this.arrSP));
  }

  getArrSP() {
    this.data = JSON.parse(sessionStorage.getItem('arrSanPhamThanhToan'));
    return this.data;
  }

  getRefeshPage() {
    return this.refreshPage;
  }

  getGioHang(KhachHang): Observable<GioHangModel[]> {
    return this.http.post<GioHangModel[]>('http://localhost:3000/giohang/thongtin', KhachHang).pipe();
  }

  ThemGioHang(khach_hang_id): Observable<GioHangModel[]> {
    return this.http.post<GioHangModel[]>('http://localhost:3000/giohang/taomoi', khach_hang_id).pipe();
  }

  CapNhatGioHang(giohang): Observable<GioHangModel[]> {
    return this.http.put<GioHangModel[]>(`${'http://localhost:3000/giohang/capnhat'}/${giohang.KhachHang_id}`, giohang)
      .pipe(
        tap(() => {
          this.refreshPage.next();
        })
      );
  }

  CapNhatSoLuong(giohang): Observable<GioHangModel[]> {
    return this.http.put<GioHangModel[]>(`${'http://localhost:3000/giohang/capnhat/soluong'}/${giohang.KhachHang_id}`, giohang).pipe();
  }
}
