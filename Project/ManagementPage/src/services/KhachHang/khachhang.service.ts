import { ThongTinTaiKhoanEmailModel } from './../../models/NhanVien/thongtinemail';
import { KhachHangModel } from './../../models/KhachHang/khachhang';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KhachhangService {

  // // Mặc định là bằng false
  // private loggedInStatus = JSON.parse(sessionStorage.getItem('loggedIn') || 'false');
  // private loggedInAccount = JSON.parse(sessionStorage.getItem('loggedInAcount') || null);

  constructor(private http: HttpClient) { }

//   setLoggedIn(value: boolean, Khach_hang_id: string){

//     this.loggedInStatus = value;
//     sessionStorage.setItem('loggedIn', 'true');
//     this.loggedInAccount = Khach_hang_id;
//     sessionStorage.setItem('loggedInAcount', this.loggedInAccount);
//   }

//   get isLoggedIn(){
//     return JSON.parse(sessionStorage.getItem('loggedIn')
//     || this.loggedInStatus && sessionStorage.getItem('loggedInAcoount') || this.loggedInAccount);
//   }

// // Tạo biến gửi trùng tên với biến nhận bên server
//   DangNhapKhachHang(Khach_hang_id, Mat_khau){
//    return this.http.post('http://localhost:3000/khachhang/dangnhap', {Khach_hang_id, Mat_khau});
//   }
getListKhachHang(): Observable<KhachHangModel[]>{
  return this.http.get<KhachHangModel[]>('http://localhost:3000/khachhang').pipe();
}

ThemKhachHang(khachhang: KhachHangModel): Observable<KhachHangModel[]>{
  return this.http.post<KhachHangModel[]>('http://localhost:3000/khachhang/dangky', khachhang).pipe();
 }

 CapNhatKhachHang(khachhang: KhachHangModel): Observable<KhachHangModel[]>{
  return this.http.put<KhachHangModel[]>(`${'http://localhost:3000/khachhang/capnhatkhachhang'}/${khachhang.Khach_hang_id}`, khachhang).pipe(
  );
 }

 XoaKhachHang(Khach_hang_id: string): Observable<KhachHangModel[]>{
  return this.http.delete<KhachHangModel[]>(`${'http://localhost:3000/khachhang/xoakhachhang'}/${Khach_hang_id}`).pipe(
  );
 }

 XoaNhieuKhachHang(arrKhachHangID): Observable<KhachHangModel[]>{
   return this.http.post<KhachHangModel[]>('http://localhost:3000/khachhang/xoakhachhang', arrKhachHangID).pipe();
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
