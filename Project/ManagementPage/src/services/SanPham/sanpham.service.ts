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

  ThemSanPham(sanpham: SanPhamModel): Observable<SanPhamModel[]>{
    return this.http.post<SanPhamModel[]>('http://localhost:3000/sanpham/taomoi', sanpham).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

   CapNhatSanPham(sanpham: SanPhamModel): Observable<SanPhamModel[]>{
    return this.http.put<SanPhamModel[]>(`${'http://localhost:3000/sanpham/capnhatsanpham'}/${sanpham._id}`, sanpham).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

   CapNhatSoLuongSanPham(arrSanPham): Observable<SanPhamModel[]>{
    return this.http.post<SanPhamModel[]>('http://localhost:3000/sanpham/capnhatsanpham/soluong', arrSanPham).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

   XoaSanPham(_id: string): Observable<SanPhamModel[]>{
    return this.http.delete<SanPhamModel[]>(`${'http://localhost:3000/sanpham/xoasanpham'}/${_id}`).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

   XoaNhieuSanPham(arrSanPhamID): Observable<SanPhamModel[]>{
     return this.http.post<SanPhamModel[]>('http://localhost:3000/sanpham/xoanhieusanpham', arrSanPhamID).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

}
