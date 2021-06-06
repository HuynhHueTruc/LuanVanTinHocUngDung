import { Observable } from 'rxjs';
import { GioHangModel } from './../../models/GioHang/giohang';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GiohangService {

  constructor(private http: HttpClient) { }

  ThemGioHang(khach_hang_id): Observable<GioHangModel[]>{
    return this.http.post<GioHangModel[]>('http://localhost:3000/giohang/taomoi', khach_hang_id).pipe();
   }

   XoaGioHang(khach_hang_id): Observable<GioHangModel[]>{
    return this.http.delete<GioHangModel[]>(`${'http://localhost:3000/giohang/xoa'}/${khach_hang_id}`).pipe();
   }

   XoaNhieuGioHang(arrKhachHangID): Observable<GioHangModel[]>{
    return this.http.post<GioHangModel[]>('http://localhost:3000/giohang/xoanhieugiohang', arrKhachHangID).pipe(
    
   );
  }
}
