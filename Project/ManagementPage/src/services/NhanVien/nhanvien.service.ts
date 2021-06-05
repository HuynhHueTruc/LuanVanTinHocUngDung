import { Router } from '@angular/router';
import { NguoiNhanModel } from './../../models/NhanVien/nguoinhan';
import { ThongTinTaiKhoanEmailModel } from './../../models/NhanVien/thongtinemail';
import { NhanVienModel } from './../../models/NhanVien/nhanvien';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NhanvienService {

  loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');
  loggedInAccount = localStorage.getItem('loggedInAcount') || null;
  datalogin: any;
  private refreshPage = new Subject<void>();

  constructor(private http: HttpClient, private router: Router) { }

  getRefeshPage() {
    return this.refreshPage;
  }

  setLoggedIn(value: boolean, data: any) {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn', 'true');
    this.loggedInAccount = data;
    localStorage.setItem('loggedInAcount', JSON.stringify(this.loggedInAccount));
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
  }

  logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loggedInAcount');
    this.router.navigate(['login']);
  }

  get isLoggedIn() {
    return JSON.parse(localStorage.getItem('loggedIn')
      || this.loggedInStatus && localStorage.getItem('loggedInAcoount') || this.loggedInAccount);
  }

  // Tạo biến gửi trùng tên với biến nhận bên server
  DangNhapNhanVien(Nhan_vien_id, Mat_khau): Observable<NhanVienModel> {

    return this.http.post<NhanVienModel>('http://localhost:3000/nhanvien/dangnhap', { Nhan_vien_id, Mat_khau });
  }

  getListNhanVien(): Observable<NhanVienModel[]> {
    return this.http.get<NhanVienModel[]>('http://localhost:3000/nhanvien').pipe();
  }

  ThemNhanVien(nhanvien: NhanVienModel): Observable<NhanVienModel[]> {
    return this.http.post<NhanVienModel[]>('http://localhost:3000/nhanvien/dangky', nhanvien).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
  }

  CapNhatNhanVien(nhanvien: NhanVienModel): Observable<NhanVienModel[]> {
    return this.http.put<NhanVienModel[]>(`${'http://localhost:3000/nhanvien/capnhatnhanvien'}/${nhanvien.Nhan_vien_id}`, nhanvien).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
  }

  XoaNhanVien(Nhan_vien_id: string): Observable<NhanVienModel[]> {
    return this.http.delete<NhanVienModel[]>(`${'http://localhost:3000/nhanvien/xoanhanvien'}/${Nhan_vien_id}`).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
  }

  XoaNhieuNhanVien(arrNhanVienID): Observable<NhanVienModel[]> {
    return this.http.post<NhanVienModel[]>('http://localhost:3000/nhanvien/xoanhanvien', arrNhanVienID).pipe(
      tap(() => {
        this.refreshPage.next();
      })
    );
  }

  GuiEmailTaiKhoan(arrThongTin): Observable<ThongTinTaiKhoanEmailModel[]> {
    return this.http.post<ThongTinTaiKhoanEmailModel[]>('http://localhost:3000/nhanvien/guiemailtaikhoan', arrThongTin).pipe();
  }

  GuiEmailNhanVien(thongtinemail, noidung, chude): Observable<ThongTinTaiKhoanEmailModel[]> {
    return this.http.post<ThongTinTaiKhoanEmailModel[]>('http://localhost:3000/nhanvien/guiemail', { thongtinemail, noidung, chude }).pipe();
  }

  GetOTP(nhanvien: NhanVienModel): Observable<NhanVienModel[]> {
    return this.http.post<NhanVienModel[]>('http://localhost:3000/nhanvien/guiOTP', nhanvien).pipe();
  }

  TimKiemNhanVien(nhanvien: NhanVienModel): Observable<NhanVienModel[]> {
    return this.http.post<NhanVienModel[]>('http://localhost:3000/nhanvien/timkiemnhanvien', nhanvien).pipe();
  }

}
