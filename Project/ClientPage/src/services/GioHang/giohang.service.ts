import { GioHangModel } from './../../models/GioHang/giohang';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GiohangService {

  constructor(private http: HttpClient) { }

  getdsGioHang(): Observable<GioHangModel[]>{
    return this.http.get<GioHangModel[]>('http://localhost:3000/giohang').pipe();
  }

  getGioHang(KhachHang): Observable<GioHangModel[]>{
    return this.http.post<GioHangModel[]>('http://localhost:3000/giohang/thongtin', KhachHang).pipe();
  }
}
