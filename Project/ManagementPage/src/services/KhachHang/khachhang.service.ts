import { ThongTinTaiKhoanEmailModel } from './../../models/NhanVien/thongtinemail';
import { KhachHangModel } from './../../models/KhachHang/khachhang';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KhachhangService {

  private refreshPage = new Subject<void>();

  constructor(private http: HttpClient) { }

  getRefeshPage() {
    return this.refreshPage;
  }

  getListKhachHang(): Observable<KhachHangModel[]>{
  return this.http.get<KhachHangModel[]>('http://localhost:3000/khachhang').pipe();
}

ThemKhachHang(khachhang: KhachHangModel): Observable<KhachHangModel[]>{
  return this.http.post<KhachHangModel[]>('http://localhost:3000/khachhang/dangky', khachhang).pipe(
    tap(() => {
      this.refreshPage.next();
    })
  );
 }

 CapNhatKhachHang(khachhang: KhachHangModel): Observable<KhachHangModel[]>{
  return this.http.put<KhachHangModel[]>(`${'http://localhost:3000/khachhang/capnhatkhachhang'}/${khachhang.Khach_hang_id}`, khachhang).pipe(
    tap(() => {
      this.refreshPage.next();
    })
  );
  
 }

 XoaKhachHang(Khach_hang_id: string): Observable<KhachHangModel[]>{
  return this.http.delete<KhachHangModel[]>(`${'http://localhost:3000/khachhang/xoakhachhang'}/${Khach_hang_id}`).pipe(
    tap(() => {
      this.refreshPage.next();
    })
  );
 }

 XoaNhieuKhachHang(arrKhachHangID): Observable<KhachHangModel[]>{
   return this.http.post<KhachHangModel[]>('http://localhost:3000/khachhang/xoakhachhang', arrKhachHangID).pipe(
    tap(() => {
      this.refreshPage.next();
    })
  );
 }

 GuiEmailTaiKhoan(arrThongTin): Observable<ThongTinTaiKhoanEmailModel[]>{
   return this.http.post<ThongTinTaiKhoanEmailModel[]>('http://localhost:3000/khachhang/guiemailtaikhoan', arrThongTin).pipe();
 }

 GuiEmailKhachHang(thongtinemail, noidung, chude): Observable<ThongTinTaiKhoanEmailModel[]>{
  return this.http.post<ThongTinTaiKhoanEmailModel[]>('http://localhost:3000/khachhang/guiemail', {thongtinemail, noidung, chude}).pipe();
}

GetOTP(khachhang: KhachHangModel): Observable<KhachHangModel[]>{
  return this.http.post<KhachHangModel[]>('http://localhost:3000/khachhang/guiOTP', khachhang).pipe();
}
}
