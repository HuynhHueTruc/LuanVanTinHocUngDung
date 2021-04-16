import { SanPhamModel } from './../../models/SanPham/sanpham';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SanphamService {

  constructor(private http: HttpClient) { }

  getListSanPham(): Observable<SanPhamModel[]>{
    return this.http.get<SanPhamModel[]>('http://localhost:3000/sanpham/thongtin').pipe();
  }

  ThemSanPham(sanpham: SanPhamModel): Observable<SanPhamModel[]>{
    return this.http.post<SanPhamModel[]>('http://localhost:3000/sanpham/taomoi', sanpham).pipe();
   }

   CapNhatSanPham(sanpham: SanPhamModel): Observable<SanPhamModel[]>{
    return this.http.put<SanPhamModel[]>(`${'http://localhost:3000/sanpham/capnhatsanpham'}/${sanpham._id}`, sanpham).pipe(
    );
   }

   CapNhatSoLuongSanPham(arrSanPham): Observable<SanPhamModel[]>{
     console.log(arrSanPham)
    return this.http.post<SanPhamModel[]>('http://localhost:3000/sanpham/capnhatsanpham/soluong', arrSanPham).pipe();
   }

   XoaSanPham(_id: string): Observable<SanPhamModel[]>{
    return this.http.delete<SanPhamModel[]>(`${'http://localhost:3000/sanpham/xoasanpham'}/${_id}`).pipe(
    );
   }

   XoaNhieuSanPham(arrSanPhamID): Observable<SanPhamModel[]>{
     return this.http.post<SanPhamModel[]>('http://localhost:3000/sanpham/xoanhieusanpham', arrSanPhamID).pipe();
   }

}
