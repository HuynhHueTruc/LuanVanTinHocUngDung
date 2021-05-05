import { GioHangModel } from './../../models/GioHang/giohang';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GiohangService {

  constructor(private http: HttpClient) { }

  private refreshPage = new Subject<void>();

  getRefeshPage(){
    return this.refreshPage;
  }

  getdsGioHang(): Observable<GioHangModel[]>{
    return this.http.get<GioHangModel[]>('http://localhost:3000/giohang').pipe();
  }

  getGioHang(KhachHang): Observable<GioHangModel[]>{
    return this.http.post<GioHangModel[]>('http://localhost:3000/giohang/thongtin', KhachHang).pipe();
  }

  CapNhatGioHang(giohang): Observable<GioHangModel[]>{
    return this.http.put<GioHangModel[]>(`${'http://localhost:3000/giohang/capnhat'}/${giohang._id}`, giohang)
    .pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
   }

}
