import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { KhachHangModel } from './../../models/KhachHang/khachhang';
import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KhachhangService {

  // Mặc định là bằng false
  //  loggedInStatus = JSON.parse(sessionStorage.getItem('loggedIn') || 'false');
  //  loggedInAccount = (sessionStorage.getItem('loggedInAcount') || null);
  loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');
  loggedInAccount = (localStorage.getItem('loggedInAcount') || null);
  datalogin: any;


  constructor(private http: HttpClient, private router: Router) { }

  setLoggedIn(value: boolean, data: any) {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', 'true');
    this.loggedInAccount = data;
    localStorage.setItem('loggedInAcount', JSON.stringify(this.loggedInAccount));
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
  }

  get isLoggedIn() {
    return JSON.parse(localStorage.getItem('loggedIn')
      || this.loggedInStatus && JSON.parse(localStorage.getItem('loggedInAcoount')) || this.loggedInAccount);
  }

  logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loggedInAcount');
    this.router.navigate(['login']);
  }

  getListKhachHang(): Observable<KhachHangModel[]>{
    return this.http.get<KhachHangModel[]>('http://localhost:3000/khachhang').pipe();
  }
  // Tạo biến gửi trùng tên với biến nhận bên server
  DangNhapKhachHang(Khach_hang_id, Mat_khau) {
    return this.http.post('http://localhost:3000/khachhang/dangnhap', { Khach_hang_id, Mat_khau });
  }

  DangKyKhachHang(Khach_hang_id, Ho_ten, Dia_chi, Gioi_tinh, So_dien_thoai, Mat_khau, Email) {
    return this.http.post('http://localhost:3000/khachhang/dangky',
      { Khach_hang_id, Ho_ten, Dia_chi, Gioi_tinh, So_dien_thoai, Mat_khau, Email });
  }

  ThemKhachHang(khachhang: KhachHangModel): Observable<KhachHangModel[]> {
    return this.http.post<KhachHangModel[]>('http://localhost:3000/khachhang/dangky', khachhang);
  }

  CapNhatKhachHang(khachhang: KhachHangModel): Observable<KhachHangModel[]> {
    return this.http.put<KhachHangModel[]>(`${'http://localhost:3000/khachhang/capnhatkhachhang'}/${khachhang.Khach_hang_id}`, khachhang).pipe(
    );
  }

  // GuiEmailKhachHang(thongtinemail, noidung, chude): Observable<ThongTinTaiKhoanEmailModel[]>{
  //   return this.http.post<ThongTinTaiKhoanEmailModel[]>('http://localhost:3000/khachhang/guiemail', {thongtinemail, noidung, chude}).pipe();
  // }

  GetOTP(khachhang: KhachHangModel): Observable<KhachHangModel[]>{
    return this.http.post<KhachHangModel[]>('http://localhost:3000/khachhang/guiOTP', khachhang).pipe();
  }

  TimKiemKhachHang(khachhang:KhachHangModel): Observable<KhachHangModel[]>{
    return this.http.post<KhachHangModel[]>('http://localhost:3000/khachhang/timkiemkhachhang', khachhang).pipe();
  }
}
